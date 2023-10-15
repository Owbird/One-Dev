package home

import (
	"math"
	"os"
	"os/user"
	"strings"

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

func (hf *HomeFunctions) GetUserMeta() (data.UserMeta, error) {
	meta := data.UserMeta{}

	user, err := user.Current()

	if err != nil {
		return meta, err
	}

	meta.UserName = user.Username
	meta.Name = user.Name

	return meta, nil
}

func (hf *HomeFunctions) GetSystemResources() (data.SystemResources, error) {
	stats := data.SystemResources{}

	memory_stats, err := mem.VirtualMemory()

	if err != nil {
		return stats, err
	}

	battery_stats, err := battery.GetAll()

	if err != nil {
		return stats, err
	}

	cpu_info, err := cpu.Info()

	if err != nil {
		return stats, err
	}

	cpu_usages, err := cpu.Percent(0, true)

	if err != nil {
		return stats, err
	}

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

func (hf *HomeFunctions) GetSystemProcesses() ([]data.Process, error) {

	stats := []data.Process{}

	all_processes, err := process.Processes()

	if err != nil {
		return stats, err
	}

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

		stats = append(stats, process)

	}
	return stats, nil
}

func (hf *HomeFunctions) GetFileSystems() ([]data.DiskStats, error) {
	stats := []data.DiskStats{}

	disk_partitions, err := disk.Partitions(false)

	if err != nil {
		return []data.DiskStats{}, err
	}

	for _, disk_partition := range disk_partitions {

		if !strings.Contains(disk_partition.Device, "loop") {
			disk_stats, _ := disk.Usage(disk_partition.Mountpoint)

			stats = append(stats, data.DiskStats{
				Path:           "/",
				DiskType:       disk_stats.Fstype,
				Device:         disk_partition.Device,
				Total:          disk_stats.Total,
				Free:           disk_stats.Free,
				Used:           disk_stats.Used,
				UsedPercentage: disk_stats.UsedPercent,
			})
		}

	}
	return stats, nil
}
