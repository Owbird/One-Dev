package git

import (
	"context"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"sync"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/database"
	"github.com/owbird/one-dev/backend/utils"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const (
	ErrPrefix = "GF"

	GetRepoErr = iota
	GetRemoteReposErr
	ChangeBranchErr
	CloneRepoErr
	GetGitDirsErr
	GetGitTokensErr
	CreateCommitErr
	GetIndexedReposErr
	PushToOriginErr
	PullFromOriginErr
	GetCommitDiffErr
	GetRemoteRepoBranchesErr
	GetRepoRemoteURLErr
)

func NewInstance() *GitFunctions {
	return &GitFunctions{
		db: *database.NewInstance(),
	}
}

type GitFunctions struct {
	Ctx context.Context
	db  database.Database
}

// GetRemoteRepoBranches returns an array of remote branches for the repo
func (gf *GitFunctions) GetRemoteRepoBranches(path string) ([]string, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetRemoteRepoBranchesErr)

	log.Println("[+] Getting remote branches")

	branches := []string{}

	repo, err := git.PlainOpen(path)
	if err != nil {
		return branches, err
	}

	remote, _ := repo.Remote("origin")

	remotes, err := remote.List(&git.ListOptions{})
	if err != nil {
		return branches, err
	}

	for _, remote := range remotes {
		remoteBranch := remote.Name()

		if strings.Contains(remoteBranch.String(), "heads") {
			branches = append(branches, fmt.Sprintf("remotes/origin/%s", remoteBranch.Short()))
		}

	}

	return branches, nil
}

// GetRepo returns a data.Repo struct containing information about the git repository
// located at the specified path. This function takes a single parameter, path, a string
// representing the path to the git repository.
// It returns a data.Repo struct.
func (gf *GitFunctions) GetRepo(path string) (data.Repo, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetRepoErr)

	log.Println("[+] Getting git dir")

	wg := sync.WaitGroup{}

	gitRepo := data.Repo{
		File: data.File{
			ParentDir: path,
			Dir:       filepath.Base(path),
		},
	}

	repo, err := git.PlainOpen(path)
	if err != nil {
		return data.Repo{}, err
	}

	head, err := repo.Head()
	if err != nil {
		return gitRepo, nil
	}

	branch := head.Name()

	gitRepo.CurrentBranch = branch.Short()

	gitLog, err := repo.Log(&git.LogOptions{
		Order: git.LogOrderCommitterTime,
	})
	if err != nil {
		return gitRepo, nil
	}

	contributorCommits := make(map[string]int)
	contributedDays := make(map[int]int)

	// Handle Commits
	wg.Add(1)
	go func() {
		gitLog.ForEach((func(commit *object.Commit) error {
			gitRepo.Commits = append(gitRepo.Commits, data.RepoCommit{
				Message:        commit.Message,
				CommitterName:  commit.Committer.Name,
				CommitterEmail: commit.Committer.Email,
				Hash:           commit.Hash.String(),
				Date:           commit.Committer.When.Format("Mon Jan 02 15:04:05 2006"),
			})

			contributorID := fmt.Sprintf("%s <%s>", commit.Committer.Name, commit.Committer.Email)
			contributorCommits[contributorID]++

			contributedDays[int(commit.Committer.When.Weekday())]++

			return nil
		}))

		for contributor, commits := range contributorCommits {
			percentage := float64(commits) / float64(len(gitRepo.Commits)) * 100
			formattedPercentage := fmt.Sprintf("%.2f", percentage) // Format the percentage to two decimal places
			gitRepo.Analytics.Contributors = append(gitRepo.Analytics.Contributors, data.RepoContributors{
				Contributor:  contributor,
				TotalCommits: commits,
				Percentage:   formattedPercentage,
			})
		}

		gitRepo.Analytics.ContributedDays = contributedDays

		wg.Done()
	}()

	localBranchesErrCh := make(chan error, 1)
	tagsErrCh := make(chan error, 1)

	// Handle Local Branches
	wg.Add(1)
	go func() {
		log.Println("[+] Gettting repo local branches")
		branches, err := repo.Branches()

		localBranchesErrCh <- err

		branches.ForEach(func(branch *plumbing.Reference) error {
			gitRepo.LocalBranches = append(gitRepo.LocalBranches, branch.Name().Short())

			return nil
		})

		close(localBranchesErrCh)

		wg.Done()
	}()

	localBranchesErrVal := <-localBranchesErrCh

	if localBranchesErrVal != nil {
		return gitRepo, localBranchesErrVal
	}

	// Handle tags
	wg.Add(1)
	go func() {
		log.Println("[+] Getting repo tags")
		tags, _ := repo.Tags()

		tagsErrCh <- err

		tags.ForEach(func(tag *plumbing.Reference) error {
			gitRepo.Tags = append(gitRepo.Tags, tag.Name().Short())

			return nil
		})

		close(tagsErrCh)

		wg.Done()
	}()

	tagsErrVal := <-tagsErrCh

	if tagsErrVal != nil {
		return gitRepo, tagsErrVal
	}

	// go-git worktree.Status() has an issue
	// https://github.com/go-git/go-git/issues/181
	res, err := exec.Command("git", "-C", path, "status", "-s").Output()
	if err != nil {
		return gitRepo, nil
	}

	status := strings.Split(string(res), "\n")

	for _, stat := range status {
		// for staged files
		formattedStat := strings.ReplaceAll(stat, "  ", " ")

		// <status> <file>
		changes := strings.Split(strings.Trim(formattedStat, " "), " ")

		if changes[0] != "" {

			status := changes[0]

			// Untracked file
			if status == "??" {
				status = "U"
			}

			change := data.RepoChange{
				File:   changes[1],
				Status: status,
			}

			gitRepo.Changes = append(gitRepo.Changes, change)
		}

	}

	technologiesCounter := make(map[string]int)

	// Handle technologies counter
	wg.Add(1)
	go func() {
		filepath.WalkDir(path, func(path string, info fs.DirEntry, err error) error {
			if !info.IsDir() {
				ext := filepath.Ext(path)
				ext = strings.TrimPrefix(ext, ".")
				if ext != "" {
					technologiesCounter[ext]++
				}
			}
			return nil
		})

		for technology, count := range technologiesCounter {
			gitRepo.Analytics.Technologies = append(gitRepo.Analytics.Technologies, data.RepoTechnologies{
				Technology: technology,
				Count:      count,
			})
		}

		wg.Done()
	}()

	wg.Wait()

	// Handle frontend null data with empty arrays
	if len(gitRepo.Tags) == 0 {
		gitRepo.Tags = []string{}
	}

	if len(gitRepo.Commits) == 0 {
		gitRepo.Commits = []data.RepoCommit{}
	}

	if len(gitRepo.Changes) == 0 {
		gitRepo.Changes = []data.RepoChange{}
	}

	return gitRepo, nil
}

// GetRemoteRepos retrieves the list of remote repositories for the authenticated user
// using the GitHub API. It returns a RemoteRepo struct containing information about
// each repository.
func (gf *GitFunctions) GetRemoteRepos() ([]data.RemoteRepo, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetRemoteReposErr)

	log.Println("[+] Getting remote repos")

	user, err := gf.db.GetGitUser()

	if user.Token == "" {
		return []data.RemoteRepo{}, fmt.Errorf("missing remote config")
	}

	if err != nil {
		return []data.RemoteRepo{}, err
	}

	payload := map[string]string{
		"query": `{
  viewer {
    repositories(first: 100, affiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR], ownerAffiliations: [OWNER, ORGANIZATION_MEMBER, COLLABORATOR], orderBy: { field: UPDATED_AT, direction: DESC }) {
	nodes {
	id
	name
	stargazerCount
	forkCount
	updatedAt
	isPrivate
	description
	diskUsage
	url	
	primaryLanguage {
		name
	}
	watchers {
		totalCount
        }
	owner {
		login
		avatarUrl
	}
      }
    }
  }
}
`,
	}

	payloadJson, _ := json.Marshal(payload)

	body, err := utils.MakeAuthorizedRequest("POST", "https://api.github.com/graphql", user.Token, payloadJson)
	if err != nil {
		return []data.RemoteRepo{}, err
	}

	var response data.RemoteRepoResponse

	err = json.Unmarshal(body, &response)
	if err != nil {
		return []data.RemoteRepo{}, fmt.Errorf("could not get repos: %s", string(body))
	}

	return response.Data.Viewer.Repositories.Nodes, nil
}

// ChangeBranch changes the branch of a Git repository.
//
// It takes in the repository path and the name of the branch as parameters.
// There is no return value.
func (gf *GitFunctions) ChangeBranch(repoPath string, branch string) error {
	// Has a hanging issue
	// err = worktree.Checkout(&git.CheckoutOptions{
	// 	Branch: plumbing.NewBranchReferenceName(branch),
	// })

	defer utils.HandlePanic(gf.Ctx, ErrPrefix, ChangeBranchErr)

	cmd := exec.Command("git", "checkout", branch)
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf(string(output))
	}

	return nil
}

// CloneRepo clones a Git repository from the given URL and name.
//
// url: the URL of the repository to clone.
// name: the name of the repository.
// error: returns an error if there was a problem cloning the repository.
func (gf *GitFunctions) CloneRepo(url string, name string) error {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, CloneRepoErr)

	home, err := utils.UserHome()
	if err != nil {
		return err
	}

	user, err := gf.db.GetGitUser()
	if err != nil {
		return err
	}

	path, err := runtime.OpenDirectoryDialog(gf.Ctx, runtime.OpenDialogOptions{
		Title:            fmt.Sprintf("Clone %s repo", name),
		DefaultDirectory: home,
	})

	path = filepath.Join(path, name)

	os.MkdirAll(path, 0755)

	if err != nil {
		return err
	}

	auth := &http.BasicAuth{
		Username: user.Username,
		Password: user.Token,
	}

	log.Println("[+] Cloning repo")

	repo, err := git.PlainClone(path, false, &git.CloneOptions{
		URL:      url,
		Progress: os.Stdout,
		Auth:     auth,
	})
	if err != nil {
		log.Println(err)
	}

	log.Println(repo)

	log.Println("[+] Repo cloned")

	return nil
}

// GetGitUser returns the GitUser object and an error.
//
// No parameters.
// Returns a GitUser object and an error.
func (gf *GitFunctions) GetGitUser() (data.GitUser, error) {
	return gf.db.GetGitUser()
}

// GetGitDirs returns a slice of data File structs representing Git directories.
//
// This function returns a slice of data File structs.
func (gf *GitFunctions) GetGitDirs() ([]data.File, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetGitDirsErr)

	dirs := []data.File{}

	log.Println("[+] Reading Git dirs")
	home, err := utils.UserHome()
	if err != nil {
		log.Fatalln(err)
	}

	filepath.WalkDir(home, func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {

			dirName := d.Name()

			if string(dirName[0]) == "." && dirName != ".git" {
				return filepath.SkipDir
			}

			if dirName == ".git" {
				info, err := d.Info()
				if err != nil {
					return err
				}

				repoUser := "Unknown"

				remoteUrl, err := gf.GetRepoRemoteURL(path)
				if err == nil {
					repoUser = strings.Split(remoteUrl, "/")[3]
				}

				dir := data.File{
					User:      repoUser,
					ParentDir: filepath.Dir(path),
					Dir:       filepath.Base(filepath.Dir(path)),
					ModTime:   info.ModTime(),
				}

				dirs = append(dirs, dir)
			}
		}

		return nil
	})

	sort.Slice(dirs, func(i, j int) bool {
		return dirs[i].ModTime.After(dirs[j].ModTime)
	})

	gf.db.IndexLocalRepos(dirs)

	return dirs, nil
}

// GetGitTokens returns a slice of strings representing Git tokens and an error.
//
// This function retrieves the list of Git directories from the database and
// iterates over each directory. For each directory, it opens the corresponding
// Git repository and retrieves the list of remotes. For each remote, it extracts
// the token from the URL and adds it to the tokens slice. Finally, it returns
// the tokens slice and any error that occurred during the process.
func (gf *GitFunctions) GetGitTokens() ([]string, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetGitTokensErr)

	tokens := []string{}

	gitDirs := []data.File{}

	indexedDirs, err := gf.GetIndexedRepos()

	if err == nil {
		gitDirs = indexedDirs
	}

	if len(gitDirs) == 0 {

		gitDirs, err = gf.GetGitDirs()
		if err != nil {
			return []string{}, err
		}

	}

	for _, dir := range gitDirs {
		repo, err := git.PlainOpen(dir.ParentDir)
		if err != nil {
			return tokens, err
		}

		remotes, err := repo.Remotes()
		if err != nil {
			return tokens, err
		}

		for _, remote := range remotes {
			// url = https://<token>@github.com/<user>/<repo>.git
			for _, url := range remote.Config().URLs {
				atParts := strings.Split(url, "@") // [https://<token>, @github.com/<user>/<repo>.git]

				if len(atParts) == 2 {
					httpParts := strings.Split(atParts[0], "https://") // ["",<token>]

					token := httpParts[1]

					alreadyExists := false

					// Check if token has already been appended
					for _, t := range tokens {
						if t == token {
							alreadyExists = true
							break
						}
					}

					if !alreadyExists {
						tokens = append(tokens, token)
					}

				}
			}
		}
	}

	return tokens, nil
}

// CreateCommit commits changes to the Git repository.
//
// The function takes a `CreateCommit` struct as a parameter, which contains the
// necessary information for creating a commit. The `CreateCommit` struct has the
// following fields:
//   - `Repo`: the path to the Git repository.
//   - `Files`: a list of file paths to be added to the commit.
//   - `Message`: the commit message.
//
// The function returns an error if there is any issue with adding files or
// committing the changes.
func (gf *GitFunctions) CreateCommit(commit data.CreateCommit) error {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, CreateCommitErr)

	// worktree.Add has an issue
	log.Println("[+] Commiting changes")

	for _, file := range commit.Files {
		cmd := exec.Command("git", "add", file)
		cmd.Dir = commit.Repo

		output, err := cmd.CombinedOutput()
		if err != nil {
			return fmt.Errorf(string(output))
		}

	}

	cmd := exec.Command("git", "commit", "-m", commit.Message)
	cmd.Dir = commit.Repo

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf(string(output))
	}

	return nil
}

// GetIndexedRepos retrieves the indexed repositories from the GitFunctions struct.
func (gf *GitFunctions) GetIndexedRepos() ([]data.File, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetIndexedReposErr)

	repos, err := gf.db.GetIndexedRepos()
	if err != nil {
		return []data.File{}, err
	}

	if len(repos) > 0 {
		log.Println("[+] Using indexed repos")
		return repos, nil
	}

	return gf.GetGitDirs()
}

// PushToOrigin pushes the changes in the Git repository to the origin.
func (gf *GitFunctions) PushToOrigin(repoDir string) error {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, PushToOriginErr)

	log.Println("[+] Pushing to origin")

	repo, err := git.PlainOpen(repoDir)
	if err != nil {
		return err
	}

	err = repo.Push(&git.PushOptions{})

	return err
}

func (gf *GitFunctions) PullFromOrigin(repoDir string) error {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, PullFromOriginErr)

	log.Println("[+] Pulling from origin")

	repo, err := git.PlainOpen(repoDir)
	if err != nil {
		return err
	}

	worktree, err := repo.Worktree()
	if err != nil {
		return err
	}

	err = worktree.Pull(&git.PullOptions{})

	return err
}

func (gf *GitFunctions) GetCommitDiff(repoDir, currentHash, prevHash string) ([]data.CommitDiff, error) {
	// defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetCommitDiffErr)

	repo, err := git.PlainOpen(repoDir)
	if err != nil {
		return nil, err
	}

	currentCommit, err := repo.CommitObject(plumbing.NewHash(currentHash))
	if err != nil {
		return nil, err
	}

	prevCommit, err := repo.CommitObject(plumbing.NewHash(prevHash))
	if err != nil {
		return nil, err
	}

	patch, err := prevCommit.Patch(currentCommit)
	if err != nil {
		return nil, err
	}

	files := patch.FilePatches()

	currentTree, err := currentCommit.Tree()
	if err != nil {
		return nil, err
	}

	prevTree, err := prevCommit.Tree()

	changes := []data.CommitDiff{}

	for _, file := range files {
		from, to := file.Files()

		var currentContent string
		var prevContent string

		if to != nil {
			currentTree.Files().ForEach(func(file *object.File) error {
				if file.Name == to.Path() {
					currentContent, err = file.Contents()
					if err != nil {
						return err
					}

				}

				return nil
			})
		}

		if from != nil {
			prevTree.Files().ForEach(func(file *object.File) error {
				if file.Name == from.Path() {
					prevContent, err = file.Contents()
					if err != nil {
						return err
					}
				}

				return nil
			})
		}

		var file string

		if to == nil {
			file = from.Path()
		} else {
			file = to.Path()
		}

		changes = append(changes, data.CommitDiff{
			File:           file,
			CurrentContent: currentContent,
			PrevContent:    prevContent,
		})
	}

	return changes, nil
}

// Returns the remote origin url of the repo
func (gf *GitFunctions) GetRepoRemoteURL(path string) (string, error) {
	defer utils.HandlePanic(gf.Ctx, ErrPrefix, GetRepoRemoteURLErr)

	log.Println("[+] Getting remote url")

	repo, err := git.PlainOpen(path)
	if err != nil {
		return "", err
	}

	remote, err := repo.Remote("origin")
	if err != nil {
		return "", err
	}

	return remote.Config().URLs[0], nil
}
