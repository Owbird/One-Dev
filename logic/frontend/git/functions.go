package frontend

import (
	"log"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/owbird/one-dev/logic/data"
)

func GetRepo(path string) data.Repo {
	log.Println("[+] Getting git dir")

	git_repo := data.Repo{}

	repo, err := git.PlainOpen(path)

	if err != nil {
		log.Println(err)
	}

	head, err := repo.Head()

	if err != nil {
		return git_repo
	}

	branch := head.Name()

	git_repo.CurrentBranch = branch.Short()

	git_log, err := repo.Log(&git.LogOptions{})

	if err != nil {
		log.Println(err)
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
		log.Println(err)
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

	worktree, err := repo.Worktree()

	if err != nil {
		log.Println(err)
	}

	status, err := worktree.Status()

	if err != nil {
		log.Println(err)
	}

	for file, status := range status {

		code := strings.ReplaceAll(string(status.Staging), " ", "M")

		code = strings.ReplaceAll(code, "?", "N")

		change := data.RepoChange{
			File:   file,
			Change: code,
		}

		git_repo.Changes = append(git_repo.Changes, change)

	}

	log.Println(git_repo)
	return git_repo
}
