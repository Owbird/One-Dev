package home

import (
	"context"
	"fmt"
	"math"
	"os"
	"os/user"
	"runtime"
	"slices"
	"strings"

	"fyne.io/systray"
	"github.com/distatus/battery"
	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/frontend/network"
	"github.com/owbird/one-dev/backend/utils"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/mem"
	"github.com/shirou/gopsutil/process"
)

const (
	ErrPrefix = "HF"

	GetUserMetaErr = iota
	GetSystemResourcesErr
	GetSystemProcessesErr
	GetFileSystemsErrs
)

func NewInstance() *HomeFunctions {
	return &HomeFunctions{}
}

type HomeFunctions struct {
	Ctx   context.Context
	State struct {
		ChargingState  string
		BattPowerNotif []int
	}
}

func (hf *HomeFunctions) GetUserMeta() (data.UserMeta, error) {
	defer utils.HandlePanic(hf.Ctx, ErrPrefix, GetUserMetaErr)

	meta := data.UserMeta{}

	user, err := user.Current()
	if err != nil {
		return meta, err
	}

	if user.Name == "" {
		meta.Name = user.Username
	} else {
		meta.Name = user.Name
	}

	return meta, nil
}

func (hf *HomeFunctions) GetSystemResources() (data.SystemResources, error) {
	defer utils.HandlePanic(hf.Ctx, ErrPrefix, GetSystemResourcesErr)

	stats := data.SystemResources{}

	memoryStats, err := mem.VirtualMemory()
	if err != nil {
		return stats, err
	}

	cpuInfo, err := cpu.Info()
	if err != nil {
		return stats, err
	}

	cpuUsages, err := cpu.Percent(0, true)
	if err != nil {
		return stats, err
	}

	upTime, err := utils.GetUptime()

	if err != nil {
		upTime = data.UpTime{}
	} else {
		stats.UpTime = upTime
	}

	stats.MemoryStats.Total = memoryStats.Total
	stats.MemoryStats.Free = memoryStats.Free
	stats.MemoryStats.Used = memoryStats.Used
	stats.MemoryStats.UsedPercentage = memoryStats.UsedPercent

	stats.CPUStats = data.CPUStats{
		Model:  cpuInfo[0].ModelName,
		Cores:  len(cpuInfo),
		Usages: cpuUsages,
	}

	batteries, err := battery.GetAll()
	if err != nil {
		stats.IsLaptop = false
		stats.BatteryStats.CurrentPower = 0
		stats.BatteryStats.ChargingState = "Unknown"
	} else if len(batteries) > 0 {

		batteryStats := batteries[0]

		stats.IsLaptop = true

		stats.BatteryStats.CurrentPower = int(math.Round(batteryStats.Current / batteryStats.Full * 100))
		stats.BatteryStats.ChargingState = batteryStats.State.String()
	} else {

		stats.IsLaptop = false
		stats.BatteryStats.CurrentPower = 100
		stats.BatteryStats.ChargingState = "Full"

	}
	chargingState := stats.BatteryStats.ChargingState

	// Set new charging state
	if hf.State.ChargingState == "" {
		hf.State.ChargingState = chargingState
		hf.State.BattPowerNotif = []int{30, 20, 10, 5}
	}

	if (hf.State.ChargingState != chargingState) && (chargingState != "Unknown" && chargingState != "Idle") {
		utils.Notify(chargingState)
		hf.State.ChargingState = chargingState

		// Reset charging notification states
		if chargingState == "Charging" {
			hf.State.BattPowerNotif = []int{30, 20, 10, 5}
		}
	}

	if chargingState != "Charging" {
		for index, threshold := range hf.State.BattPowerNotif {
			if stats.BatteryStats.CurrentPower == threshold {
				utils.Notify(fmt.Sprintf("Battery power at %v%%", stats.BatteryStats.CurrentPower))
				hf.State.BattPowerNotif = slices.Delete(hf.State.BattPowerNotif, 0, index+1)
			}
		}
	}

	wkCliPath, err := utils.WakaTimeCli()
	if err != nil {
		return stats, err
	}

	_, err = os.Stat(wkCliPath)

	stats.HasWaka = err == nil

	network := network.NewInstance()

	ips, err := network.FetchLocalIps()
	if err != nil {
		return stats, err
	}

	stats.LocalIPs = ips

	toolTipBuilder := strings.Builder{}

	toolTipBuilder.WriteString(fmt.Sprintf("Uptime: %v Days %v Hours %v Minutes\n\n", stats.UpTime.Days, stats.UpTime.Hours, stats.UpTime.Minutes))

	toolTipBuilder.WriteString(fmt.Sprintf("Memory usage: %.2f%%\n\n", stats.MemoryStats.UsedPercentage))

	for index, cpu := range stats.CPUStats.Usages {
		toolTipBuilder.WriteString(fmt.Sprintf("CPU #%v: %.2f%%\n", index, cpu))
	}

	newTooltip := toolTipBuilder.String()

	if runtime.GOOS != "windows" {
		systray.SetTitle(newTooltip)
	} else {
		systray.SetTooltip(newTooltip)
	}

	return stats, nil
}

func (hf *HomeFunctions) GetSystemProcesses() ([]data.Process, error) {
	defer utils.HandlePanic(hf.Ctx, ErrPrefix, GetSystemProcessesErr)

	stats := []data.Process{}

	allProcesses, err := process.Processes()
	if err != nil {
		return stats, err
	}

	for _, currentProcess := range allProcesses {
		name, _ := currentProcess.Name()
		cpuUsage, _ := currentProcess.CPUPercent()
		memory_usage, _ := currentProcess.MemoryPercent()
		username, _ := currentProcess.Username()
		pid := currentProcess.Pid

		process := data.Process{
			Name:        name,
			CPUUsage:    cpuUsage,
			MemoryUsage: float64(memory_usage),
			Pid:         pid,
			Username:    username,
		}

		stats = append(stats, process)

	}
	return stats, nil
}

func (hf *HomeFunctions) GetFileSystems() ([]data.DiskStats, error) {
	defer utils.HandlePanic(hf.Ctx, ErrPrefix, GetFileSystemsErrs)

	stats := []data.DiskStats{}

	diskPartitions, err := disk.Partitions(false)
	if err != nil {
		return []data.DiskStats{}, err
	}

	for _, diskPartition := range diskPartitions {
		if !strings.Contains(diskPartition.Device, "loop") {
			diskStats, _ := disk.Usage(diskPartition.Mountpoint)

			stats = append(stats, data.DiskStats{
				Path:           "/",
				DiskType:       diskStats.Fstype,
				Device:         diskPartition.Device,
				Total:          diskStats.Total,
				Free:           diskStats.Free,
				Used:           diskStats.Used,
				UsedPercentage: diskStats.UsedPercent,
			})
		}
	}
	return stats, nil
}
