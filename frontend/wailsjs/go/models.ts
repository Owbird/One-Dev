export namespace data {
	
	export class OpenedTabs {
	    label: string;
	    source: string;
	    meta: Record<string, any>;
	
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
	    user: string;
	    parentDir: string;
	    dir: string;
	    // Go type: time
	    modTime: any;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.user = source["user"];
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
	export class Ip {
	    ip: string;
	    interface: string;
	
	    static createFrom(source: any = {}) {
	        return new Ip(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ip = source["ip"];
	        this.interface = source["interface"];
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
	export class RepoWatchersCount {
	    totalCount: number;
	
	    static createFrom(source: any = {}) {
	        return new RepoWatchersCount(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.totalCount = source["totalCount"];
	    }
	}
	export class RemoteRepoOwner {
	    login: string;
	    avatarUrl: string;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepoOwner(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.login = source["login"];
	        this.avatarUrl = source["avatarUrl"];
	    }
	}
	export class RemoteRepoLanguage {
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepoLanguage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	    }
	}
	export class RemoteRepo {
	    id: string;
	    url: string;
	    description: string;
	    diskUsage: number;
	    forkCount: number;
	    isPrivate: boolean;
	    name: string;
	    primaryLanguage: RemoteRepoLanguage;
	    owner: RemoteRepoOwner;
	    stargazerCount: number;
	    watchers: RepoWatchersCount;
	    // Go type: time
	    updatedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new RemoteRepo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.url = source["url"];
	        this.description = source["description"];
	        this.diskUsage = source["diskUsage"];
	        this.forkCount = source["forkCount"];
	        this.isPrivate = source["isPrivate"];
	        this.name = source["name"];
	        this.primaryLanguage = this.convertValues(source["primaryLanguage"], RemoteRepoLanguage);
	        this.owner = this.convertValues(source["owner"], RemoteRepoOwner);
	        this.stargazerCount = source["stargazerCount"];
	        this.watchers = this.convertValues(source["watchers"], RepoWatchersCount);
	        this.updatedAt = this.convertValues(source["updatedAt"], null);
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
	    contributedDays: Record<number, number>;
	
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
	    user: string;
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
	        this.user = source["user"];
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
	    localIP: Ip[];
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
	        this.localIP = this.convertValues(source["localIP"], Ip);
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

