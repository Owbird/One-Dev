export namespace data {
	
	export class OpenedTabs {
	    label: string;
	    source: string;
	    meta: {[key: string]: any};
	
	    static createFrom(source: any = {}) {
	        return new OpenedTabs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.label = source["label"];
	        this.source = source["source"];
	        this.meta = source["meta"];
	    }
	}
	export class AppState {
	    openedTabs: OpenedTabs[];
	    activeIndex: number;
	
	    static createFrom(source: any = {}) {
	        return new AppState(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.openedTabs = this.convertValues(source["openedTabs"], OpenedTabs);
	        this.activeIndex = source["activeIndex"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	export class BatteryStats {
	    chargingState: string;
	    currentPower: number;
	
	    static createFrom(source: any = {}) {
	        return new BatteryStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chargingState = source["chargingState"];
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
	export class CommitDiff {
	    file: string;
	    prevContent: string;
	    currentContent: string;
	
	    static createFrom(source: any = {}) {
	        return new CommitDiff(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.file = source["file"];
	        this.prevContent = source["prevContent"];
	        this.currentContent = source["currentContent"];
	    }
	}
	export class CreateCommit {
	    message: string;
	    files: string[];
	    repo: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateCommit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	        this.files = source["files"];
	        this.repo = source["repo"];
	    }
	}
	export class Directory {
	    name: string;
	    isDir: boolean;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new Directory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.isDir = source["isDir"];
	        this.path = source["path"];
	    }
	}
	export class DiskStats {
	    path: string;
	    diskType: string;
	    device: string;
	    total: number;
	    free: number;
	    used: number;
	    usedPercentage: number;
	
	    static createFrom(source: any = {}) {
	        return new DiskStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.diskType = source["diskType"];
	        this.device = source["device"];
	        this.total = source["total"];
	        this.free = source["free"];
	        this.used = source["used"];
	        this.usedPercentage = source["usedPercentage"];
	    }
	}
	export class File {
	    parentDir: string;
	    dir: string;
	    // Go type: time
	    modTime: any;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.parentDir = source["parentDir"];
	        this.dir = source["dir"];
	        this.modTime = this.convertValues(source["modTime"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	export class GitUser {
	    username: string;
	    token: string;
	
	    static createFrom(source: any = {}) {
	        return new GitUser(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.username = source["username"];
	        this.token = source["token"];
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
	export class OneJsonGit {
	    token: string;
	    username: string;
	
	    static createFrom(source: any = {}) {
	        return new OneJsonGit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.token = source["token"];
	        this.username = source["username"];
	    }
	}
	export class OneJson {
	    git: OneJsonGit;
	    modules: string[];
	
	    static createFrom(source: any = {}) {
	        return new OneJson(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.git = this.convertValues(source["git"], OneJsonGit);
	        this.modules = source["modules"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	export class RemoteRepoPermissions {
	    admin: boolean;
	    maintain: boolean;
	    push: boolean;
	    triage: boolean;
	    pull: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepoPermissions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.admin = source["admin"];
	        this.maintain = source["maintain"];
	        this.push = source["push"];
	        this.triage = source["triage"];
	        this.pull = source["pull"];
	    }
	}
	export class RemoteRepoOwner {
	    login: string;
	    id: number;
	    nodeID: string;
	    avatarURL: string;
	    gravatarID: string;
	    url: string;
	    htmlURL: string;
	    followersURL: string;
	    followingURL: string;
	    gistsURL: string;
	    starredURL: string;
	    subscriptionsURL: string;
	    organizationsURL: string;
	    reposURL: string;
	    eventsURL: string;
	    receivedEventsURL: string;
	    type: string;
	    siteAdmin: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepoOwner(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.login = source["login"];
	        this.id = source["id"];
	        this.nodeID = source["nodeID"];
	        this.avatarURL = source["avatarURL"];
	        this.gravatarID = source["gravatarID"];
	        this.url = source["url"];
	        this.htmlURL = source["htmlURL"];
	        this.followersURL = source["followersURL"];
	        this.followingURL = source["followingURL"];
	        this.gistsURL = source["gistsURL"];
	        this.starredURL = source["starredURL"];
	        this.subscriptionsURL = source["subscriptionsURL"];
	        this.organizationsURL = source["organizationsURL"];
	        this.reposURL = source["reposURL"];
	        this.eventsURL = source["eventsURL"];
	        this.receivedEventsURL = source["receivedEventsURL"];
	        this.type = source["type"];
	        this.siteAdmin = source["siteAdmin"];
	    }
	}
	export class RemoteRepo {
	    id: number;
	    nodeID: string;
	    name: string;
	    fullName: string;
	    private: boolean;
	    owner: RemoteRepoOwner;
	    htmlURL: string;
	    description: string;
	    fork: boolean;
	    url: string;
	    forksURL: string;
	    keysURL: string;
	    collaboratorsURL: string;
	    teamsURL: string;
	    hooksURL: string;
	    issueEventsURL: string;
	    eventsURL: string;
	    assigneesURL: string;
	    branchesURL: string;
	    tagsURL: string;
	    blobsURL: string;
	    gitTagsURL: string;
	    gitRefsURL: string;
	    treesURL: string;
	    statusesURL: string;
	    languagesURL: string;
	    stargazersURL: string;
	    contributorsURL: string;
	    subscribersURL: string;
	    subscriptionURL: string;
	    commitsURL: string;
	    gitCommitsURL: string;
	    commentsURL: string;
	    issueCommentURL: string;
	    contentsURL: string;
	    compareURL: string;
	    mergesURL: string;
	    archiveURL: string;
	    downloadsURL: string;
	    issuesURL: string;
	    pullsURL: string;
	    milestonesURL: string;
	    notificationsURL: string;
	    labelsURL: string;
	    releasesURL: string;
	    deploymentsURL: string;
	    // Go type: time
	    created_at: any;
	    // Go type: time
	    updated_at: any;
	    // Go type: time
	    pushed_at: any;
	    gitURL: string;
	    sshURL: string;
	    cloneURL: string;
	    svnURL: string;
	    homepage: any;
	    size: number;
	    stargazersCount: number;
	    watchersCount: number;
	    language: string;
	    hasIssues: boolean;
	    hasProjects: boolean;
	    hasDownloads: boolean;
	    hasWiki: boolean;
	    hasPages: boolean;
	    hasDiscussions: boolean;
	    forksCount: number;
	    mirrorURL: any;
	    archived: boolean;
	    disabled: boolean;
	    openIssuesCount: number;
	    license: any;
	    allowForking: boolean;
	    isTemplate: boolean;
	    webCommitSignoffRequired: boolean;
	    topics: any[];
	    visibility: string;
	    forks: number;
	    openIssues: number;
	    watchers: number;
	    defaultBranch: string;
	    permissions: RemoteRepoPermissions;
	    score: number;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.nodeID = source["nodeID"];
	        this.name = source["name"];
	        this.fullName = source["fullName"];
	        this.private = source["private"];
	        this.owner = this.convertValues(source["owner"], RemoteRepoOwner);
	        this.htmlURL = source["htmlURL"];
	        this.description = source["description"];
	        this.fork = source["fork"];
	        this.url = source["url"];
	        this.forksURL = source["forksURL"];
	        this.keysURL = source["keysURL"];
	        this.collaboratorsURL = source["collaboratorsURL"];
	        this.teamsURL = source["teamsURL"];
	        this.hooksURL = source["hooksURL"];
	        this.issueEventsURL = source["issueEventsURL"];
	        this.eventsURL = source["eventsURL"];
	        this.assigneesURL = source["assigneesURL"];
	        this.branchesURL = source["branchesURL"];
	        this.tagsURL = source["tagsURL"];
	        this.blobsURL = source["blobsURL"];
	        this.gitTagsURL = source["gitTagsURL"];
	        this.gitRefsURL = source["gitRefsURL"];
	        this.treesURL = source["treesURL"];
	        this.statusesURL = source["statusesURL"];
	        this.languagesURL = source["languagesURL"];
	        this.stargazersURL = source["stargazersURL"];
	        this.contributorsURL = source["contributorsURL"];
	        this.subscribersURL = source["subscribersURL"];
	        this.subscriptionURL = source["subscriptionURL"];
	        this.commitsURL = source["commitsURL"];
	        this.gitCommitsURL = source["gitCommitsURL"];
	        this.commentsURL = source["commentsURL"];
	        this.issueCommentURL = source["issueCommentURL"];
	        this.contentsURL = source["contentsURL"];
	        this.compareURL = source["compareURL"];
	        this.mergesURL = source["mergesURL"];
	        this.archiveURL = source["archiveURL"];
	        this.downloadsURL = source["downloadsURL"];
	        this.issuesURL = source["issuesURL"];
	        this.pullsURL = source["pullsURL"];
	        this.milestonesURL = source["milestonesURL"];
	        this.notificationsURL = source["notificationsURL"];
	        this.labelsURL = source["labelsURL"];
	        this.releasesURL = source["releasesURL"];
	        this.deploymentsURL = source["deploymentsURL"];
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.updated_at = this.convertValues(source["updated_at"], null);
	        this.pushed_at = this.convertValues(source["pushed_at"], null);
	        this.gitURL = source["gitURL"];
	        this.sshURL = source["sshURL"];
	        this.cloneURL = source["cloneURL"];
	        this.svnURL = source["svnURL"];
	        this.homepage = source["homepage"];
	        this.size = source["size"];
	        this.stargazersCount = source["stargazersCount"];
	        this.watchersCount = source["watchersCount"];
	        this.language = source["language"];
	        this.hasIssues = source["hasIssues"];
	        this.hasProjects = source["hasProjects"];
	        this.hasDownloads = source["hasDownloads"];
	        this.hasWiki = source["hasWiki"];
	        this.hasPages = source["hasPages"];
	        this.hasDiscussions = source["hasDiscussions"];
	        this.forksCount = source["forksCount"];
	        this.mirrorURL = source["mirrorURL"];
	        this.archived = source["archived"];
	        this.disabled = source["disabled"];
	        this.openIssuesCount = source["openIssuesCount"];
	        this.license = source["license"];
	        this.allowForking = source["allowForking"];
	        this.isTemplate = source["isTemplate"];
	        this.webCommitSignoffRequired = source["webCommitSignoffRequired"];
	        this.topics = source["topics"];
	        this.visibility = source["visibility"];
	        this.forks = source["forks"];
	        this.openIssues = source["openIssues"];
	        this.watchers = source["watchers"];
	        this.defaultBranch = source["defaultBranch"];
	        this.permissions = this.convertValues(source["permissions"], RemoteRepoPermissions);
	        this.score = source["score"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	
	
	export class RepoTechnologies {
	    technology: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new RepoTechnologies(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.technology = source["technology"];
	        this.count = source["count"];
	    }
	}
	export class RepoContributors {
	    contributor: string;
	    percentage: string;
	    totalCommits: number;
	
	    static createFrom(source: any = {}) {
	        return new RepoContributors(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contributor = source["contributor"];
	        this.percentage = source["percentage"];
	        this.totalCommits = source["totalCommits"];
	    }
	}
	export class RepoAnalytics {
	    contributors: RepoContributors[];
	    technologies: RepoTechnologies[];
	    contributedDays: {[key: number]: number};
	
	    static createFrom(source: any = {}) {
	        return new RepoAnalytics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contributors = this.convertValues(source["contributors"], RepoContributors);
	        this.technologies = this.convertValues(source["technologies"], RepoTechnologies);
	        this.contributedDays = source["contributedDays"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	    committerName: string;
	    committerEmail: string;
	    hash: string;
	    date: string;
	
	    static createFrom(source: any = {}) {
	        return new RepoCommit(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.message = source["message"];
	        this.committerName = source["committerName"];
	        this.committerEmail = source["committerEmail"];
	        this.hash = source["hash"];
	        this.date = source["date"];
	    }
	}
	export class RepoChange {
	    file: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new RepoChange(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.file = source["file"];
	        this.status = source["status"];
	    }
	}
	export class Repo {
	    currentBranch: string;
	    localBranches: string[];
	    tags: string[];
	    changes: RepoChange[];
	    commits: RepoCommit[];
	    analytics: RepoAnalytics;
	    parentDir: string;
	    dir: string;
	    // Go type: time
	    modTime: any;
	
	    static createFrom(source: any = {}) {
	        return new Repo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentBranch = source["currentBranch"];
	        this.localBranches = source["localBranches"];
	        this.tags = source["tags"];
	        this.changes = this.convertValues(source["changes"], RepoChange);
	        this.commits = this.convertValues(source["commits"], RepoCommit);
	        this.analytics = this.convertValues(source["analytics"], RepoAnalytics);
	        this.parentDir = source["parentDir"];
	        this.dir = source["dir"];
	        this.modTime = this.convertValues(source["modTime"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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
	
	
	
	
	
	export class UserMeta {
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new UserMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
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
	export class SystemResources {
	    hasWaka: boolean;
	    isLaptop: boolean;
	    localIP: string;
	    uptime: UpTime;
	    batteryStats: BatteryStats;
	    memoryStats: MemoryStats;
	    cpuStats: CPUStats;
	    userMeta: UserMeta;
	
	    static createFrom(source: any = {}) {
	        return new SystemResources(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hasWaka = source["hasWaka"];
	        this.isLaptop = source["isLaptop"];
	        this.localIP = source["localIP"];
	        this.uptime = this.convertValues(source["uptime"], UpTime);
	        this.batteryStats = this.convertValues(source["batteryStats"], BatteryStats);
	        this.memoryStats = this.convertValues(source["memoryStats"], MemoryStats);
	        this.cpuStats = this.convertValues(source["cpuStats"], CPUStats);
	        this.userMeta = this.convertValues(source["userMeta"], UserMeta);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
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

