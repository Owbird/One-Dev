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
	ChargingState string `json:"chargingState"`
	CurrentPower  int    `json:"currentPower"`
}

type CPUStats struct {
	Model  string    `json:"model"`
	Cores  int       `json:"cores"`
	Usages []float64 `json:"usages"`
}

type DiskStats struct {
	Path           string  `json:"path"`
	DiskType       string  `json:"diskType"`
	Device         string  `json:"device"`
	Total          uint64  `json:"total"`
	Free           uint64  `json:"free"`
	Used           uint64  `json:"used"`
	UsedPercentage float64 `json:"usedPercentage"`
}

type MemoryStats struct {
	Total          uint64  `json:"total"`
	Used           uint64  `json:"used"`
	Free           uint64  `json:"free"`
	UsedPercentage float64 `json:"usedPercentage"`
}

type UserMeta struct {
	Name string `json:"name"`
}

type SystemResources struct {
	HasWaka      bool         `json:"hasWaka"`
	IsLaptop     bool         `json:"isLaptop"`
	LocalIP      string       `json:"localIP"`
	UpTime       UpTime       `json:"uptime"`
	BatteryStats BatteryStats `json:"batteryStats"`
	MemoryStats  MemoryStats  `json:"memoryStats"`
	CPUStats     CPUStats     `json:"cpuStats"`
	UserMeta     UserMeta     `json:"userMeta"`
}

type SystemStats struct {
	Resources   SystemResources `json:"resources"`
	Processes   []Process       `json:"processes"`
	FileSystems []DiskStats     `json:"fileSystems"`
}
