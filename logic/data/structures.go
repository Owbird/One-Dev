package data

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
