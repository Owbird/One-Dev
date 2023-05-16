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

