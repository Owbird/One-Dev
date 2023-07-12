package git

import (
	"context"
	"encoding/json"
	"fmt"
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
	return &GitFunctions{}
}

type GitFunctions struct {
	Ctx context.Context
}

// GetRepo returns a data.Repo struct containing information about the git repository
// located at the specified path. This function takes a single parameter, path, a string
// representing the path to the git repository.
// It returns a data.Repo struct.
func (gf *GitFunctions) GetRepo(path string) (data.Repo, error) {
	log.Println("[+] Getting git dir")

	git_repo := data.Repo{
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
		return git_repo, nil
	}

	branch := head.Name()

	git_repo.CurrentBranch = branch.Short()

	git_log, err := repo.Log(&git.LogOptions{})

	if err != nil {
		return git_repo, nil
	}

	git_log.ForEach((func(commit *object.Commit) error {

		git_repo.Commits = append(git_repo.Commits, data.RepoCommit{
			Message:   commit.Message,
			Committer: commit.Committer.Name,
			Hash:      commit.Hash.String(),
			Date:      commit.Committer.When.Format("2nd January, 2006"),
		})

		return nil
	}))

	branches, err := repo.Branches()

	if err != nil {
		return git_repo, nil
	}

	branches.ForEach(func(branch *plumbing.Reference) error {

		git_repo.Branches = append(git_repo.Branches, branch.Name().Short())

		return nil
	})

	tags, err := repo.Tags()

	if err != nil {
		log.Println(err)
	}

	tags.ForEach(func(tag *plumbing.Reference) error {

		git_repo.Tags = append(git_repo.Tags, tag.Name().Short())

		return nil
	})

	// go-git worktree.Status() has an issue
	// https://github.com/go-git/go-git/issues/181
	res, err := exec.Command("git", "-C", path, "status", "-s").Output()

	if err != nil {
		return git_repo, nil
	}

	status := strings.Split(string(res), "\n")

	for _, stat := range status {
		changes := strings.Split(strings.Trim(stat, " "), " ")

		if changes[0] != "" {

			change := data.RepoChange{
				File:   changes[1],
				Change: changes[0],
			}

			git_repo.Changes = append(git_repo.Changes, change)
		}

	}

	return git_repo, nil
}

// GetRemoteRepos retrieves the list of remote repositories for the authenticated user
// using the GitHub API. It returns a RemoteRepo struct containing information about
// each repository.
func (gf *GitFunctions) GetRemoteRepos() ([]data.RemoteRepo, error) {

	log.Println("[+] Getting remote repos")

	user, err := database.GetGitUser()

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
		return []data.RemoteRepo{}, err
	}

	return repos, nil

}

// ChangeBranch changes the branch of a Git repository.
//
// It takes in the repository path and the name of the branch as parameters.
// There is no return value.
func (gf *GitFunctions) ChangeBranch(repoPath string, branch string) {

	repo, err := git.PlainOpen(repoPath)

	if err != nil {
		log.Fatalln((err))

	}

	worktree, err := repo.Worktree()

	if err != nil {
		log.Fatalln(err)
	}

	worktree.Checkout(&git.CheckoutOptions{
		Branch: plumbing.NewBranchReferenceName(branch),
	})

}

func (gf *GitFunctions) CloneRepo(url string, name string) error {
	home, err := utils.UserHome()

	if err != nil {
		return err
	}

	user, err := database.GetGitUser()

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

func (gf *GitFunctions) GetGitUser() (data.GitUser, error) {
	return database.GetGitUser()
}

func (gf *GitFunctions) GetGitDirs() ([]data.File, error) {
	return database.GetGitDirs()
}
