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
	Contributors []RepoContributors `json:"contributors"`
	Technologies []RepoTechnologies `json:"technologies"`
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

type RemoteRepoOwner struct {
	Login             string `json:"login"`
	ID                int    `json:"id"`
	NodeID            string `json:"nodeID"`
	AvatarURL         string `json:"avatarURL"`
	GravatarID        string `json:"gravatarID"`
	URL               string `json:"url"`
	HTMLURL           string `json:"htmlURL"`
	FollowersURL      string `json:"followersURL"`
	FollowingURL      string `json:"followingURL"`
	GistsURL          string `json:"gistsURL"`
	StarredURL        string `json:"starredURL"`
	SubscriptionsURL  string `json:"subscriptionsURL"`
	OrganizationsURL  string `json:"organizationsURL"`
	ReposURL          string `json:"reposURL"`
	EventsURL         string `json:"eventsURL"`
	ReceivedEventsURL string `json:"receivedEventsURL"`
	Type              string `json:"type"`
	SiteAdmin         bool   `json:"siteAdmin"`
}

type RemoteRepoPermissions struct {
	Admin    bool `json:"admin"`
	Maintain bool `json:"maintain"`
	Push     bool `json:"push"`
	Triage   bool `json:"triage"`
	Pull     bool `json:"pull"`
}

type CommitDiff struct {
	File           string `json:"file"`
	PrevContent    string `json:"prevContent"`
	CurrentContent string `json:"currentContent"`
}

type RemoteRepo struct {
	ID                       int                   `json:"id"`
	NodeID                   string                `json:"nodeID"`
	Name                     string                `json:"name"`
	FullName                 string                `json:"fullName"`
	Private                  bool                  `json:"private"`
	Owner                    RemoteRepoOwner       `json:"owner"`
	HTMLURL                  string                `json:"htmlURL"`
	Description              string                `json:"description"`
	Fork                     bool                  `json:"fork"`
	URL                      string                `json:"url"`
	ForksURL                 string                `json:"forksURL"`
	KeysURL                  string                `json:"keysURL"`
	CollaboratorsURL         string                `json:"collaboratorsURL"`
	TeamsURL                 string                `json:"teamsURL"`
	HooksURL                 string                `json:"hooksURL"`
	IssueEventsURL           string                `json:"issueEventsURL"`
	EventsURL                string                `json:"eventsURL"`
	AssigneesURL             string                `json:"assigneesURL"`
	BranchesURL              string                `json:"branchesURL"`
	TagsURL                  string                `json:"tagsURL"`
	BlobsURL                 string                `json:"blobsURL"`
	GitTagsURL               string                `json:"gitTagsURL"`
	GitRefsURL               string                `json:"gitRefsURL"`
	TreesURL                 string                `json:"treesURL"`
	StatusesURL              string                `json:"statusesURL"`
	LanguagesURL             string                `json:"languagesURL"`
	StargazersURL            string                `json:"stargazersURL"`
	ContributorsURL          string                `json:"contributorsURL"`
	SubscribersURL           string                `json:"subscribersURL"`
	SubscriptionURL          string                `json:"subscriptionURL"`
	CommitsURL               string                `json:"commitsURL"`
	GitCommitsURL            string                `json:"gitCommitsURL"`
	CommentsURL              string                `json:"commentsURL"`
	IssueCommentURL          string                `json:"issueCommentURL"`
	ContentsURL              string                `json:"contentsURL"`
	CompareURL               string                `json:"compareURL"`
	MergesURL                string                `json:"mergesURL"`
	ArchiveURL               string                `json:"archiveURL"`
	DownloadsURL             string                `json:"downloadsURL"`
	IssuesURL                string                `json:"issuesURL"`
	PullsURL                 string                `json:"pullsURL"`
	MilestonesURL            string                `json:"milestonesURL"`
	NotificationsURL         string                `json:"notificationsURL"`
	LabelsURL                string                `json:"labelsURL"`
	ReleasesURL              string                `json:"releasesURL"`
	DeploymentsURL           string                `json:"deploymentsURL"`
	CreatedAt                time.Time             `json:"createdAt"`
	UpdatedAt                time.Time             `json:"updatedAt"`
	PushedAt                 time.Time             `json:"pushedAt"`
	GitURL                   string                `json:"gitURL"`
	SSHURL                   string                `json:"sshURL"`
	CloneURL                 string                `json:"cloneURL"`
	SvnURL                   string                `json:"svnURL"`
	Homepage                 interface{}           `json:"homepage"`
	Size                     int                   `json:"size"`
	StargazersCount          int                   `json:"stargazersCount"`
	WatchersCount            int                   `json:"watchersCount"`
	Language                 string                `json:"language"`
	HasIssues                bool                  `json:"hasIssues"`
	HasProjects              bool                  `json:"hasProjects"`
	HasDownloads             bool                  `json:"hasDownloads"`
	HasWiki                  bool                  `json:"hasWiki"`
	HasPages                 bool                  `json:"hasPages"`
	HasDiscussions           bool                  `json:"hasDiscussions"`
	ForksCount               int                   `json:"forksCount"`
	MirrorURL                interface{}           `json:"mirrorURL"`
	Archived                 bool                  `json:"archived"`
	Disabled                 bool                  `json:"disabled"`
	OpenIssuesCount          int                   `json:"openIssuesCount"`
	License                  interface{}           `json:"license"`
	AllowForking             bool                  `json:"allowForking"`
	IsTemplate               bool                  `json:"isTemplate"`
	WebCommitSignoffRequired bool                  `json:"webCommitSignoffRequired"`
	Topics                   []interface{}         `json:"topics"`
	Visibility               string                `json:"visibility"`
	Forks                    int                   `json:"forks"`
	OpenIssues               int                   `json:"openIssues"`
	Watchers                 int                   `json:"watchers"`
	DefaultBranch            string                `json:"defaultBranch"`
	Permissions              RemoteRepoPermissions `json:"permissions"`
	Score                    float64               `json:"score"`
}
