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

type UserMeta struct {
	Name     string `json:"name"`
	UserName string `json:"userName"`
}

type SystemStats struct {
	IsLaptop     bool         `json:"isLaptop"`
	UpTime       UpTime       `json:"uptime"`
	BatteryStats BatteryStats `json:"batteryStats"`
	DiskStats    DiskStats    `json:"diskStats"`
	MemoryStats  MemoryStats  `json:"memoryStats"`
	CPUStats     CPUStats     `json:"cpuStats"`
	Processes    []Process    `json:"processes"`
	UserMeta     UserMeta     `json:"userMeta"`
	HasWaka      bool         `json:"hasWaka"`
}
