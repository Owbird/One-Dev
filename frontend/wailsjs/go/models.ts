export namespace data {
	
	export class BatteryStats {
	    charginState: string;
	    currentPower: number;
	
	    static createFrom(source: any = {}) {
	        return new BatteryStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.charginState = source["charginState"];
	        this.currentPower = source["currentPower"];
	    }
	}
	export class CPUStats {
	    model: string;
	    cores: number;
	    usages: number[];
	
	    static createFrom(source: any = {}) {
	        return new CPUStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.model = source["model"];
	        this.cores = source["cores"];
	        this.usages = source["usages"];
	    }
	}
	export class File {
	    parentDir: string;
	    dir: string;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.parentDir = source["parentDir"];
	        this.dir = source["dir"];
	    }
	}
	export class MemoryStats {
	    total: number;
	    used: number;
	    free: number;
	    usedPercentage: number;
	
	    static createFrom(source: any = {}) {
	        return new MemoryStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.total = source["total"];
	        this.used = source["used"];
	        this.free = source["free"];
	        this.usedPercentage = source["usedPercentage"];
	    }
	}
	export class Process {
	    name: string;
	    username: string;
	    pid: number;
	    memoryUsage: number;
	    cpuUsage: number;
	
	    static createFrom(source: any = {}) {
	        return new Process(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.username = source["username"];
	        this.pid = source["pid"];
	        this.memoryUsage = source["memoryUsage"];
	        this.cpuUsage = source["cpuUsage"];
	    }
	}
	export class RemoteRepo {
	    id: number;
	    node_id: string;
	    name: string;
	    full_name: string;
	    private: boolean;
	    // Go type: struct { Login string "json:\"login\""; ID int "json:\"id\""; NodeID string "json:\"node_id\""; AvatarURL string "json:\"avatar_url\""; GravatarID string "json:\"gravatar_id\""; URL string "json:\"url\""; HTMLURL string "json:\"html_url\""; FollowersURL string "json:\"followers_url\""; FollowingURL string "json:\"following_url\""; GistsURL string "json:\"gists_url\""; StarredURL string "json:\"starred_url\""; SubscriptionsURL string "json:\"subscriptions_url\""; OrganizationsURL string "json:\"organizations_url\""; ReposURL string "json:\"repos_url\""; EventsURL string "json:\"events_url\""; ReceivedEventsURL string "json:\"received_events_url\""; Type string "json:\"type\""; SiteAdmin bool "json:\"site_admin\"" }
	    owner: any;
	    html_url: string;
	    description: any;
	    fork: boolean;
	    url: string;
	    forks_url: string;
	    keys_url: string;
	    collaborators_url: string;
	    teams_url: string;
	    hooks_url: string;
	    issue_events_url: string;
	    events_url: string;
	    assignees_url: string;
	    branches_url: string;
	    tags_url: string;
	    blobs_url: string;
	    git_tags_url: string;
	    git_refs_url: string;
	    trees_url: string;
	    statuses_url: string;
	    languages_url: string;
	    stargazers_url: string;
	    contributors_url: string;
	    subscribers_url: string;
	    subscription_url: string;
	    commits_url: string;
	    git_commits_url: string;
	    comments_url: string;
	    issue_comment_url: string;
	    contents_url: string;
	    compare_url: string;
	    merges_url: string;
	    archive_url: string;
	    downloads_url: string;
	    issues_url: string;
	    pulls_url: string;
	    milestones_url: string;
	    notifications_url: string;
	    labels_url: string;
	    releases_url: string;
	    deployments_url: string;
	    // Go type: time
	    created_at: any;
	    // Go type: time
	    updated_at: any;
	    // Go type: time
	    pushed_at: any;
	    git_url: string;
	    ssh_url: string;
	    clone_url: string;
	    svn_url: string;
	    homepage: string;
	    size: number;
	    stargazers_count: number;
	    watchers_count: number;
	    language: string;
	    has_issues: boolean;
	    has_projects: boolean;
	    has_downloads: boolean;
	    has_wiki: boolean;
	    has_pages: boolean;
	    has_discussions: boolean;
	    forks_count: number;
	    mirror_url: any;
	    archived: boolean;
	    disabled: boolean;
	    open_issues_count: number;
	    license: any;
	    allow_forking: boolean;
	    is_template: boolean;
	    web_commit_signoff_required: boolean;
	    topics: any[];
	    visibility: string;
	    forks: number;
	    open_issues: number;
	    watchers: number;
	    default_branch: string;
	    // Go type: struct { Admin bool "json:\"admin\""; Maintain bool "json:\"maintain\""; Push bool "json:\"push\""; Triage bool "json:\"triage\""; Pull bool "json:\"pull\"" }
	    permissions: any;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.node_id = source["node_id"];
	        this.name = source["name"];
	        this.full_name = source["full_name"];
	        this.private = source["private"];
	        this.owner = this.convertValues(source["owner"], Object);
	        this.html_url = source["html_url"];
	        this.description = source["description"];
	        this.fork = source["fork"];
	        this.url = source["url"];
	        this.forks_url = source["forks_url"];
	        this.keys_url = source["keys_url"];
	        this.collaborators_url = source["collaborators_url"];
	        this.teams_url = source["teams_url"];
	        this.hooks_url = source["hooks_url"];
	        this.issue_events_url = source["issue_events_url"];
	        this.events_url = source["events_url"];
	        this.assignees_url = source["assignees_url"];
	        this.branches_url = source["branches_url"];
	        this.tags_url = source["tags_url"];
	        this.blobs_url = source["blobs_url"];
	        this.git_tags_url = source["git_tags_url"];
	        this.git_refs_url = source["git_refs_url"];
	        this.trees_url = source["trees_url"];
	        this.statuses_url = source["statuses_url"];
	        this.languages_url = source["languages_url"];
	        this.stargazers_url = source["stargazers_url"];
	        this.contributors_url = source["contributors_url"];
	        this.subscribers_url = source["subscribers_url"];
	        this.subscription_url = source["subscription_url"];
	        this.commits_url = source["commits_url"];
	        this.git_commits_url = source["git_commits_url"];
	        this.comments_url = source["comments_url"];
	        this.issue_comment_url = source["issue_comment_url"];
	        this.contents_url = source["contents_url"];
	        this.compare_url = source["compare_url"];
	        this.merges_url = source["merges_url"];
	        this.archive_url = source["archive_url"];
	        this.downloads_url = source["downloads_url"];
	        this.issues_url = source["issues_url"];
	        this.pulls_url = source["pulls_url"];
	        this.milestones_url = source["milestones_url"];
	        this.notifications_url = source["notifications_url"];
	        this.labels_url = source["labels_url"];
	        this.releases_url = source["releases_url"];
	        this.deployments_url = source["deployments_url"];
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.pushed_at = this.convertValues(source["pushed_at"], null);
	        this.git_url = source["git_url"];
	        this.ssh_url = source["ssh_url"];
	        this.clone_url = source["clone_url"];
	        this.svn_url = source["svn_url"];
	        this.homepage = source["homepage"];
	        this.size = source["size"];
	        this.stargazers_count = source["stargazers_count"];
	        this.watchers_count = source["watchers_count"];
	        this.language = source["language"];
	        this.has_issues = source["has_issues"];
	        this.has_projects = source["has_projects"];
	        this.has_downloads = source["has_downloads"];
	        this.has_wiki = source["has_wiki"];
	        this.has_pages = source["has_pages"];
	        this.has_discussions = source["has_discussions"];
	        this.forks_count = source["forks_count"];
	        this.mirror_url = source["mirror_url"];
	        this.archived = source["archived"];
	        this.disabled = source["disabled"];
	        this.open_issues_count = source["open_issues_count"];
	        this.license = source["license"];
	        this.allow_forking = source["allow_forking"];
	        this.is_template = source["is_template"];
	        this.web_commit_signoff_required = source["web_commit_signoff_required"];
	        this.topics = source["topics"];
	        this.visibility = source["visibility"];
	        this.forks = source["forks"];
	        this.open_issues = source["open_issues"];
	        this.watchers = source["watchers"];
	        this.default_branch = source["default_branch"];
	        this.permissions = this.convertValues(source["permissions"], Object);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class RepoCommit {
	    message: string;
	    committer: string;
	    hash: string;
	    date: string;
	
	    static createFrom(source: any = {}) {
	        return new RepoCommit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	        this.committer = source["committer"];
	        this.hash = source["hash"];
	        this.date = source["date"];
	    }
	}
	export class RepoChange {
	    file: string;
	    change: string;
	
	    static createFrom(source: any = {}) {
	        return new RepoChange(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.file = source["file"];
	        this.change = source["change"];
	    }
	}
	export class Repo {
	    currentBranch: string;
	    branches: string[];
	    tags: string[];
	    changes: RepoChange[];
	    commits: RepoCommit[];
	
	    static createFrom(source: any = {}) {
	        return new Repo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentBranch = source["currentBranch"];
	        this.branches = source["branches"];
	        this.tags = source["tags"];
	        this.changes = this.convertValues(source["changes"], RepoChange);
	        this.commits = this.convertValues(source["commits"], RepoCommit);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class UpTime {
	    days: number;
	    hours: number;
	    minutes: number;
	
	    static createFrom(source: any = {}) {
	        return new UpTime(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.days = source["days"];
	        this.hours = source["hours"];
	        this.minutes = source["minutes"];
	    }
	}
	export class SystemStats {
	    isLaptop: boolean;
	    uptime: UpTime;
	    batteryStats: BatteryStats;
	    // Go type: DiskStats
	    diskStats: any;
	    memoryStats: MemoryStats;
	    cpuStats: CPUStats;
	    processes: Process[];
	    hasWaka: boolean;
	
	    static createFrom(source: any = {}) {
	        return new SystemStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.isLaptop = source["isLaptop"];
	        this.uptime = this.convertValues(source["uptime"], UpTime);
	        this.batteryStats = this.convertValues(source["batteryStats"], BatteryStats);
	        this.diskStats = this.convertValues(source["diskStats"], null);
	        this.memoryStats = this.convertValues(source["memoryStats"], MemoryStats);
	        this.cpuStats = this.convertValues(source["cpuStats"], CPUStats);
	        this.processes = this.convertValues(source["processes"], Process);
	        this.hasWaka = source["hasWaka"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

