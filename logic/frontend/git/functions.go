package git

import (
	"encoding/json"
	"fmt"
	"log"
	"os/exec"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/utils"
)

func NewInstance() *GitFunctions {
	return &GitFunctions{}
}

type GitFunctions struct {
}

// GetRepo returns a data.Repo struct containing information about the git repository
// located at the specified path. This function takes a single parameter, path, a string
// representing the path to the git repository.
// It returns a data.Repo struct.
func (gf *GitFunctions) GetRepo(path string) (data.Repo, error) {
	log.Println("[+] Getting git dir")

	git_repo := data.Repo{}

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
func (gf *GitFunctions) GetRemoteRepos() (data.RemoteRepo, error) {
	token := database.GetGitToken()

	url := "https://api.github.com/user"
	method := "GET"

	body, err := utils.MakeAuthorizedRequest(method, url, token)

	if err != nil {
		return data.RemoteRepo{}, err
	}

	var user data.GitUser

	json.Unmarshal(body, &user)

	body, err = utils.MakeAuthorizedRequest(method, fmt.Sprintf("https://api.github.com/search/repositories?q=user:%s", user.Name), token)

	if err != nil {
		return data.RemoteRepo{}, err

	}

	var repos data.RemoteRepo

	err = json.Unmarshal(body, &repos)

	if err != nil {
		return data.RemoteRepo{}, err
	}

	return repos, nil

}

// GetGitTokens returns an array of Git tokens that are not duplicates.
func (gf *GitFunctions) GetGitTokens() ([]string, error) {

	log.Println("[+] Reading Git tokens")

	tokens := []string{}

	dirs, err := database.GetGitDirs()

	if err != nil {
		return []string{}, err
	}

	for _, dir := range dirs {

		res, err := exec.Command("git", "-C", dir.ParentDir, "remote", "-v").Output()

		if err != nil {
			return []string{}, err

		}

		url := strings.Split(string(res), "@")

		if len(url) > 1 {
			token := url[0]
			token = strings.Split(token, "//")[1]

			insert := true

			for _, t := range tokens {
				if t == token {
					insert = false
					break
				}

			}

			if insert {
				tokens = append(tokens, token)
			}
		}

	}

	return tokens, nil
}
