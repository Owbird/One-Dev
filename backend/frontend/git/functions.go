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

func NewInstance() *GitFunctions {
	return &GitFunctions{
		db: *database.NewInstance(),
	}
}

type GitFunctions struct {
	Ctx context.Context
	db  database.Database
}

// GetRepo returns a data.Repo struct containing information about the git repository
// located at the specified path. This function takes a single parameter, path, a string
// representing the path to the git repository.
// It returns a data.Repo struct.
func (gf *GitFunctions) GetRepo(path string) (data.Repo, error) {
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

	gitLog, err := repo.Log(&git.LogOptions{})

	if err != nil {
		return gitRepo, nil
	}

	contributorCommits := make(map[string]int)

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

	// Handle remote branchess
	wg.Add(1)
	go func() {
		defer wg.Done()

		log.Println("[+] Gettting repo remote branches")
		remote, _ := repo.Remote("origin")

		remotes, err := remote.List(&git.ListOptions{})

		if err != nil {
			gitRepo.RemoteBranches = []string{}

			return
		}


		for _, remote := range remotes {
			remoteBranch := remote.Name()

			if strings.Contains(remoteBranch.String(), "heads") {
				gitRepo.RemoteBranches = append(gitRepo.RemoteBranches, fmt.Sprintf("remotes/origin/%s", remoteBranch.Short()))
			}

		}

	}()


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

	tagsErrVal := <- tagsErrCh

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

	//Handle frontend null data with empty arrays
	if len(gitRepo.Tags) == 0 {
		gitRepo.Tags = []string{}
	}

	if len(gitRepo.LocalBranches) == 0 {
		gitRepo.RemoteBranches = []string{}
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

	log.Println("[+] Getting remote repos")

	user, err := gf.db.GetGitUser()

	if user.Token == "" {
		return []data.RemoteRepo{}, fmt.Errorf("missing remote config")
	}

	if err != nil {
		return []data.RemoteRepo{}, err

	}

	body, err := utils.MakeAuthorizedRequest("GET", "https://api.github.com/user/repos?per_page=500", user.Token)
	if err != nil {
		return []data.RemoteRepo{}, err
	}

	var repos []data.RemoteRepo

	err = json.Unmarshal(body, &repos)

	if err != nil {
		return []data.RemoteRepo{}, fmt.Errorf("could not get repos: %s", string(body))
	}

	return repos, nil

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
				dir := data.File{
					ParentDir: filepath.Dir(path),
					Dir:       filepath.Base(filepath.Dir(path)),
				}

				dirs = append(dirs, dir)

				// database.IndexGitDir(dir)
			}
		}

		return nil
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
	tokens := []string{}

	gitDirs, err := gf.GetGitDirs()

	if err != nil {
		return []string{}, err
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
	log.Println("[+] Pushing to origin")

	repo, err := git.PlainOpen(repoDir)

	if err != nil {
		return err
	}

	err = repo.Push(&git.PushOptions{})

	return err
}

func (gf *GitFunctions) PullFromOrigin(repoDir string) error {
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
