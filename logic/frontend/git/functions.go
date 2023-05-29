package frontend

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/utils"
)

func GetRepo(ctx context.Context, path string) data.Repo {
	log.Println("[+] Getting git dir")

	git_repo := data.Repo{}

	repo, err := git.PlainOpen(path)

	utils.HandleError(ctx, err)

	head, err := repo.Head()

	if err != nil {
		return git_repo
	}

	branch := head.Name()

	git_repo.CurrentBranch = branch.Short()

	git_log, err := repo.Log(&git.LogOptions{})

	utils.HandleError(ctx, err)

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

	utils.HandleError(ctx, err)

	branches.ForEach(func(branch *plumbing.Reference) error {

		git_repo.Branches = append(git_repo.Branches, branch.Name().Short())

		return nil
	})

	tags, err := repo.Tags()

	utils.HandleError(ctx, err)

	tags.ForEach(func(tag *plumbing.Reference) error {

		git_repo.Tags = append(git_repo.Tags, tag.Name().Short())

		return nil
	})

	// go-git worktree.Status() has an issue
	// https://github.com/go-git/go-git/issues/181
	res, err := exec.Command("git", "-C", path, "status", "-s").Output()

	utils.HandleError(ctx, err)

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

	return git_repo
}

func GetRemoteRepos() []data.RemoteRepo {
	token := database.GetGitToken()

	url := "https://api.github.com/user"
	method := "GET"

	client := &http.Client{}

	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		log.Println(err)
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(req)

	if err != nil {
		log.Println(err)
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
	}

	var user data.GitUser

	json.Unmarshal(body, &user)

	req, err = http.NewRequest(method, fmt.Sprintf("%s/repos", url), nil)

	if err != nil {
		log.Println(err)
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err = client.Do(req)

	if err != nil {
		log.Println(err)
	}

	defer res.Body.Close()

	body, err = ioutil.ReadAll(res.Body)

	if err != nil {
		log.Println(err)
	}

	log.Println(string(body))

	var repos []data.RemoteRepo

	json.Unmarshal(body, &repos)

	return repos

}

func GetGitTokens() []string {

	log.Println("[+] Reading Git tokens")

	tokens := []string{}

	for _, dir := range database.GetGitDirs() {

		res, err := exec.Command("git", "-C", dir.ParentDir, "remote", "-v").Output()

		if err != nil {
			log.Println(err)
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

	return tokens
}
