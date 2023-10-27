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

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/go-git/go-git/v5/plumbing/transport/http"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/utils"
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

	branches, err := repo.Branches()

	if err != nil {
		return gitRepo, nil
	}

	branches.ForEach(func(branch *plumbing.Reference) error {

		gitRepo.Branches = append(gitRepo.Branches, branch.Name().Short())

		return nil
	})

	tags, err := repo.Tags()

	if err != nil {
		log.Println(err)
	}

	tags.ForEach(func(tag *plumbing.Reference) error {

		gitRepo.Tags = append(gitRepo.Tags, tag.Name().Short())

		return nil
	})

	// go-git worktree.Status() has an issue
	// https://github.com/go-git/go-git/issues/181
	res, err := exec.Command("git", "-C", path, "status", "-s").Output()

	if err != nil {
		return gitRepo, nil
	}

	status := strings.Split(string(res), "\n")

	for _, stat := range status {
		changes := strings.Split(strings.Trim(stat, " "), " ")

		if changes[0] != "" {

			change := data.RepoChange{
				File:   changes[1],
				Change: changes[0],
			}

			gitRepo.Changes = append(gitRepo.Changes, change)
		}

	}

	technologiesCounter := make(map[string]int)

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
		gitRepo.Analytics.Technologies = append(gitRepo.Analytics.Technologies, data.TechnologyCounter{
			Technology: technology,
			Count:      count,
		})
	}

	return gitRepo, nil
}

// GetRemoteRepos retrieves the list of remote repositories for the authenticated user
// using the GitHub API. It returns a RemoteRepo struct containing information about
// each repository.
func (gf *GitFunctions) GetRemoteRepos() ([]data.RemoteRepo, error) {

	log.Println("[+] Getting remote repos")

	user, err := gf.db.GetGitUser()

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

// GetGitDirs returns a list of Git directories.
//
// It does not take any parameters.
// It returns a slice of data.File and an error.
func (gf *GitFunctions) GetGitDirs() ([]data.File, error) {
	return gf.db.GetGitDirs()
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

	gitDirs, err := gf.db.GetGitDirs()

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
