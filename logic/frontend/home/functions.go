package home

import (
	"context"
	"math"
	"os"

	"github.com/distatus/battery"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/utils"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/process"
)

func GetSystemStat(ctx context.Context) data.SystemStats {

	memoryStats, _ := mem.VirtualMemory()
	batteryStats, _ := battery.GetAll()
	stats := data.SystemStats{}

	stats.UpTime = utils.GetUptime()

	stats.MemoryStats.Total = memoryStats.Total
	stats.MemoryStats.Free = memoryStats.Free
	stats.MemoryStats.Used = memoryStats.Used
	stats.MemoryStats.UsedPercentage = memoryStats.UsedPercent

	cpu_info, _ := cpu.Info()

	cpu_usages, err := cpu.Percent(0, true)

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

	utils.HandleError(ctx, err)

	stats.CPUStats = data.CPUStats{
		Model:  cpu_info[0].ModelName,
		Cores:  len(cpu_info),
		Usages: cpu_usages,
	}

	if len(batteryStats) > 0 {

		stats.IsLaptop = true

		main_battery := batteryStats[0]

		stats.BatteryStats.CurrentPower = int(math.Round(main_battery.Current / main_battery.Full * 100))

		stats.BatteryStats.ChargingState = main_battery.State.String()
	} else {

		stats.IsLaptop = false
		stats.BatteryStats.CurrentPower = 100
		stats.BatteryStats.ChargingState = "Full"

	}

	_, err = os.Stat(utils.WakaTimeCli())

	stats.HasWaka = err == nil

	return stats
}
