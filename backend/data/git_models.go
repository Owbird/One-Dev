package data

import "time"

type RepoChange struct {
	File   string `json:"file"`
	Status string `json:"status"`
}

type CreateCommit struct {
	Message string   `json:"message"`
	Files   []string `json:"files"`
	Repo    string   `json:"repo"`
}

type RepoContributors struct {
	Contributor  string `json:"contributor"`
	Percentage   string `json:"percentage"`
	TotalCommits int    `json:"totalCommits"`
}

type RepoTechnologies struct {
	Technology string `json:"technology"`
	Count      int    `json:"count"`
}

type RepoAnalytics struct {
	Contributors    []RepoContributors `json:"contributors"`
	Technologies    []RepoTechnologies `json:"technologies"`
	ContributedDays map[int]int        `json:"contributedDays"`
}

type Repo struct {
	CurrentBranch string        `json:"currentBranch"`
	LocalBranches []string      `json:"localBranches"`
	Tags          []string      `json:"tags"`
	Changes       []RepoChange  `json:"changes"`
	Commits       []RepoCommit  `json:"commits"`
	Analytics     RepoAnalytics `json:"analytics"`
	File
}

type RepoCommit struct {
	Message        string `json:"message"`
	CommitterName  string `json:"committerName"`
	CommitterEmail string `json:"committerEmail"`
	Hash           string `json:"hash"`
	Date           string `json:"date"`
}

type GitUser struct {
	Username string `json:"username"`
	Token    string `json:"token"`
}

type CommitDiff struct {
	File           string `json:"file"`
	PrevContent    string `json:"prevContent"`
	CurrentContent string `json:"currentContent"`
}

type RemoteRepoLanguage struct {
	Name string `json:"name"`
}

type RemoteRepoOwner struct {
	Login     string `json:"login"`
	AvatarURL string `json:"avatarUrl"`
}

type RepoWatchersCount struct {
	TotalCount int `json:"totalCount"`
}

type RemoteRepo struct {
	Id              string             `json:"id"`
	Url             string             `json:"url"`
	Description     string             `json:"description"`
	DiskUsage       int                `json:"diskUsage"`
	ForkCount       int                `json:"forkCount"`
	IsPrivate       bool               `json:"isPrivate"`
	Name            string             `json:"name"`
	PrimaryLanguage RemoteRepoLanguage `json:"primaryLanguage"`
	Owner           RemoteRepoOwner    `json:"owner"`
	StargazerCount  int                `json:"stargazerCount"`
	Watchers        RepoWatchersCount  `json:"watchers"`
	UpdatedAt       time.Time          `json:"updatedAt"`
}

type RemoteRepoResponse struct {
	Data struct {
		Viewer struct {
			Repositories struct {
				Nodes []RemoteRepo `json:"nodes"`
			} `json:"repositories"`
		} `json:"viewer"`
	} `json:"data"`
}
