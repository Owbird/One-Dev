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
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.parentDir = source["parentDir"];
	        this.dir = source["dir"];
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
	
	    static createFrom(source: any = {}) {
	        return new OneJson(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.git = this.convertValues(source["git"], OneJsonGit);
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
	    createdAt: any;
	    // Go type: time
	    updatedAt: any;
	    // Go type: time
	    pushedAt: any;
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
	        this.createdAt = this.convertValues(source["createdAt"], null);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
	        this.pushedAt = this.convertValues(source["pushedAt"], null);
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
	
	
	export class TechnologyCounter {
	    technology: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new TechnologyCounter(source);
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
	    technologies: TechnologyCounter[];
	
	    static createFrom(source: any = {}) {
	        return new RepoAnalytics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contributors = this.convertValues(source["contributors"], RepoContributors);
	        this.technologies = this.convertValues(source["technologies"], TechnologyCounter);
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
	    analytics: RepoAnalytics;
	    parentDir: string;
	    dir: string;
	
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
	        this.analytics = this.convertValues(source["analytics"], RepoAnalytics);
	        this.parentDir = source["parentDir"];
	        this.dir = source["dir"];
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
	
	
	
	
	export class UserMeta {
	    name: string;
	    userName: string;
	
	    static createFrom(source: any = {}) {
	        return new UserMeta(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.userName = source["userName"];
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

