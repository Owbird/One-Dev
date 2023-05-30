package data

import "time"

type UpTime struct {
	Days    int `json:"days"`
	Hours   int `json:"hours"`
	Minutes int `json:"minutes"`
}

type Process struct {
	Name        string  `json:"name"`
	Username    string  `json:"username"`
	Pid         int32   `json:"pid"`
	MemoryUsage float64 `json:"memoryUsage"`
	CPUUsage    float64 `json:"cpuUsage"`
}

type BatteryStats struct {
	ChargingState string `json:"charginState"`
	CurrentPower  int    `json:"currentPower"`
}

type CPUStats struct {
	Model  string    `json:"model"`
	Cores  int       `json:"cores"`
	Usages []float64 `json:"usages"`
}

type DiskStats struct {
}

type MemoryStats struct {
	Total          uint64  `json:"total"`
	Used           uint64  `json:"used"`
	Free           uint64  `json:"free"`
	UsedPercentage float64 `json:"usedPercentage"`
}

type SystemStats struct {
	IsLaptop     bool         `json:"isLaptop"`
	UpTime       UpTime       `json:"uptime"`
	BatteryStats BatteryStats `json:"batteryStats"`
	DiskStats    DiskStats    `json:"diskStats"`
	MemoryStats  MemoryStats  `json:"memoryStats"`
	CPUStats     CPUStats     `json:"cpuStats"`
	Processes    []Process    `json:"processes"`
	HasWaka      bool         `json:"hasWaka"`
}

type File struct {
	ParentDir string `json:"parentDir"`
	Dir       string `json:"dir"`
}

type RepoChange struct {
	File   string `json:"file"`
	Change string `json:"change"`
}

type Repo struct {
	CurrentBranch string       `json:"currentBranch"`
	Branches      []string     `json:"branches"`
	Tags          []string     `json:"tags"`
	Changes       []RepoChange `json:"changes"`
	Commits       []RepoCommit `json:"commits"`
}

type RepoCommit struct {
	Message   string `json:"message"`
	Committer string `json:"committer"`
	Hash      string `json:"hash"`
	Date      string `json:"date"`
}

type GitUser struct {
	Login                   string    `json:"login"`
	ID                      int       `json:"id"`
	NodeID                  string    `json:"node_id"`
	AvatarURL               string    `json:"avatar_url"`
	GravatarID              string    `json:"gravatar_id"`
	URL                     string    `json:"url"`
	HTMLURL                 string    `json:"html_url"`
	FollowersURL            string    `json:"followers_url"`
	FollowingURL            string    `json:"following_url"`
	GistsURL                string    `json:"gists_url"`
	StarredURL              string    `json:"starred_url"`
	SubscriptionsURL        string    `json:"subscriptions_url"`
	OrganizationsURL        string    `json:"organizations_url"`
	ReposURL                string    `json:"repos_url"`
	EventsURL               string    `json:"events_url"`
	ReceivedEventsURL       string    `json:"received_events_url"`
	Type                    string    `json:"type"`
	SiteAdmin               bool      `json:"site_admin"`
	Name                    string    `json:"name"`
	Company                 any       `json:"company"`
	Blog                    string    `json:"blog"`
	Location                any       `json:"location"`
	Email                   any       `json:"email"`
	Hireable                any       `json:"hireable"`
	Bio                     any       `json:"bio"`
	TwitterUsername         any       `json:"twitter_username"`
	PublicRepos             int       `json:"public_repos"`
	PublicGists             int       `json:"public_gists"`
	Followers               int       `json:"followers"`
	Following               int       `json:"following"`
	CreatedAt               time.Time `json:"created_at"`
	UpdatedAt               time.Time `json:"updated_at"`
	PrivateGists            int       `json:"private_gists"`
	TotalPrivateRepos       int       `json:"total_private_repos"`
	OwnedPrivateRepos       int       `json:"owned_private_repos"`
	DiskUsage               int       `json:"disk_usage"`
	Collaborators           int       `json:"collaborators"`
	TwoFactorAuthentication bool      `json:"two_factor_authentication"`
	Plan                    struct {
		Name          string `json:"name"`
		Space         int    `json:"space"`
		Collaborators int    `json:"collaborators"`
		PrivateRepos  int    `json:"private_repos"`
	} `json:"plan"`
}

type RemoteRepoOwner struct {
	Login             string `json:"login"`
	ID                int    `json:"id"`
	NodeID            string `json:"node_id"`
	AvatarURL         string `json:"avatar_url"`
	GravatarID        string `json:"gravatar_id"`
	URL               string `json:"url"`
	HTMLURL           string `json:"html_url"`
	FollowersURL      string `json:"followers_url"`
	FollowingURL      string `json:"following_url"`
	GistsURL          string `json:"gists_url"`
	StarredURL        string `json:"starred_url"`
	SubscriptionsURL  string `json:"subscriptions_url"`
	OrganizationsURL  string `json:"organizations_url"`
	ReposURL          string `json:"repos_url"`
	EventsURL         string `json:"events_url"`
	ReceivedEventsURL string `json:"received_events_url"`
	Type              string `json:"type"`
	SiteAdmin         bool   `json:"site_admin"`
}

type RemoteRepoPermissions struct {
	Admin    bool `json:"admin"`
	Maintain bool `json:"maintain"`
	Push     bool `json:"push"`
	Triage   bool `json:"triage"`
	Pull     bool `json:"pull"`
}

type RemoteRepoItem struct {
	ID                       int                   `json:"id"`
	NodeID                   string                `json:"node_id"`
	Name                     string                `json:"name"`
	FullName                 string                `json:"full_name"`
	Private                  bool                  `json:"private"`
	Owner                    RemoteRepoOwner       `json:"owner"`
	HTMLURL                  string                `json:"html_url"`
	Description              string                `json:"description"`
	Fork                     bool                  `json:"fork"`
	URL                      string                `json:"url"`
	ForksURL                 string                `json:"forks_url"`
	KeysURL                  string                `json:"keys_url"`
	CollaboratorsURL         string                `json:"collaborators_url"`
	TeamsURL                 string                `json:"teams_url"`
	HooksURL                 string                `json:"hooks_url"`
	IssueEventsURL           string                `json:"issue_events_url"`
	EventsURL                string                `json:"events_url"`
	AssigneesURL             string                `json:"assignees_url"`
	BranchesURL              string                `json:"branches_url"`
	TagsURL                  string                `json:"tags_url"`
	BlobsURL                 string                `json:"blobs_url"`
	GitTagsURL               string                `json:"git_tags_url"`
	GitRefsURL               string                `json:"git_refs_url"`
	TreesURL                 string                `json:"trees_url"`
	StatusesURL              string                `json:"statuses_url"`
	LanguagesURL             string                `json:"languages_url"`
	StargazersURL            string                `json:"stargazers_url"`
	ContributorsURL          string                `json:"contributors_url"`
	SubscribersURL           string                `json:"subscribers_url"`
	SubscriptionURL          string                `json:"subscription_url"`
	CommitsURL               string                `json:"commits_url"`
	GitCommitsURL            string                `json:"git_commits_url"`
	CommentsURL              string                `json:"comments_url"`
	IssueCommentURL          string                `json:"issue_comment_url"`
	ContentsURL              string                `json:"contents_url"`
	CompareURL               string                `json:"compare_url"`
	MergesURL                string                `json:"merges_url"`
	ArchiveURL               string                `json:"archive_url"`
	DownloadsURL             string                `json:"downloads_url"`
	IssuesURL                string                `json:"issues_url"`
	PullsURL                 string                `json:"pulls_url"`
	MilestonesURL            string                `json:"milestones_url"`
	NotificationsURL         string                `json:"notifications_url"`
	LabelsURL                string                `json:"labels_url"`
	ReleasesURL              string                `json:"releases_url"`
	DeploymentsURL           string                `json:"deployments_url"`
	CreatedAt                time.Time             `json:"created_at"`
	UpdatedAt                time.Time             `json:"updated_at"`
	PushedAt                 time.Time             `json:"pushed_at"`
	GitURL                   string                `json:"git_url"`
	SSHURL                   string                `json:"ssh_url"`
	CloneURL                 string                `json:"clone_url"`
	SvnURL                   string                `json:"svn_url"`
	Homepage                 interface{}           `json:"homepage"`
	Size                     int                   `json:"size"`
	StargazersCount          int                   `json:"stargazers_count"`
	WatchersCount            int                   `json:"watchers_count"`
	Language                 string                `json:"language"`
	HasIssues                bool                  `json:"has_issues"`
	HasProjects              bool                  `json:"has_projects"`
	HasDownloads             bool                  `json:"has_downloads"`
	HasWiki                  bool                  `json:"has_wiki"`
	HasPages                 bool                  `json:"has_pages"`
	HasDiscussions           bool                  `json:"has_discussions"`
	ForksCount               int                   `json:"forks_count"`
	MirrorURL                interface{}           `json:"mirror_url"`
	Archived                 bool                  `json:"archived"`
	Disabled                 bool                  `json:"disabled"`
	OpenIssuesCount          int                   `json:"open_issues_count"`
	License                  interface{}           `json:"license"`
	AllowForking             bool                  `json:"allow_forking"`
	IsTemplate               bool                  `json:"is_template"`
	WebCommitSignoffRequired bool                  `json:"web_commit_signoff_required"`
	Topics                   []interface{}         `json:"topics"`
	Visibility               string                `json:"visibility"`
	Forks                    int                   `json:"forks"`
	OpenIssues               int                   `json:"open_issues"`
	Watchers                 int                   `json:"watchers"`
	DefaultBranch            string                `json:"default_branch"`
	Permissions              RemoteRepoPermissions `json:"permissions"`
	Score                    float64               `json:"score"`
}

type RemoteRepo struct {
	TotalCount        int              `json:"total_count"`
	IncompleteResults bool             `json:"incomplete_results"`
	Items             []RemoteRepoItem `json:"items"`
}
