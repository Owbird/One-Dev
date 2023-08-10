package home

import (
	"math"
	"os"
	"os/user"

	"github.com/distatus/battery"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/utils"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/process"
)

func NewInstance() *HomeFunctions {
	return &HomeFunctions{}
}

type HomeFunctions struct {
}

// GetSystemStat returns system statistics like uptime, cpu usage, memory usage, battery status and processes.
func (hf *HomeFunctions) GetSystemStat() (data.SystemStats, error) {

	memory_stats, _ := mem.VirtualMemory()
	battery_stats, _ := battery.GetAll()

	disk_stats, _ := disk.Usage("/")

	stats := data.SystemStats{}

	stats.DiskStats = data.DiskStats{
		Path:           "/",
		DiskType:       disk_stats.Fstype,
		Total:          disk_stats.Total,
		Free:           disk_stats.Free,
		Used:           disk_stats.Used,
		UsedPercentage: disk_stats.UsedPercent,
	}

	user, err := user.Current()

	if err != nil {
		return data.SystemStats{}, err
	}

	stats.UserMeta.UserName = user.Username
	stats.UserMeta.Name = user.Name

	upTime, err := utils.GetUptime()

	if err != nil {
		upTime = data.UpTime{}
	} else {
		stats.UpTime = upTime
	}

	stats.MemoryStats.Total = memory_stats.Total
	stats.MemoryStats.Free = memory_stats.Free
	stats.MemoryStats.Used = memory_stats.Used
	stats.MemoryStats.UsedPercentage = memory_stats.UsedPercent

	cpu_info, err := cpu.Info()

	if err != nil {
		return data.SystemStats{}, err
	}

	cpu_usages, err := cpu.Percent(0, true)

	if err != nil {
		return data.SystemStats{}, err
	}

	stats.Processes = []data.Process{}

	all_processes, _ := process.Processes()

	for _, current_process := range all_processes {
		name, _ := current_process.Name()
		cpu_usage, _ := current_process.CPUPercent()
		memory_usage, _ := current_process.MemoryPercent()
		username, _ := current_process.Username()
		pid := current_process.Pid

		process := data.Process{
			Name:        name,
			CPUUsage:    cpu_usage,
			MemoryUsage: float64(memory_usage),
			Pid:         pid,
			Username:    username,
		}

		stats.Processes = append(stats.Processes, process)

	}

	stats.CPUStats = data.CPUStats{
		Model:  cpu_info[0].ModelName,
		Cores:  len(cpu_info),
		Usages: cpu_usages,
	}

	if len(battery_stats) > 0 {

		stats.IsLaptop = true

		main_battery := battery_stats[0]

		stats.BatteryStats.CurrentPower = int(math.Round(main_battery.Current / main_battery.Full * 100))

		stats.BatteryStats.ChargingState = main_battery.State.String()
	} else {

		stats.IsLaptop = false
		stats.BatteryStats.CurrentPower = 100
		stats.BatteryStats.ChargingState = "Full"

	}

	wk_cli_path, err := utils.WakaTimeCli()

	if err != nil {
		return stats, err
	}

	_, err = os.Stat(wk_cli_path)

	stats.HasWaka = err == nil

	ip, err := utils.GetLocalIp()

	if err != nil {
		return stats, err
	}

	stats.LocalIP = ip

	return stats, nil
}
