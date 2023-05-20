package main

import (
	"context"
	"fmt"
	"log"
	"math"
	"os"
	"os/exec"

	"github.com/distatus/battery"
	"github.com/gen2brain/beeep"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/utils"
	"github.com/shirou/gopsutil/process"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	log.Println("[+] App startup")
	a.ctx = ctx
}

func (a *App) Notify(message string) {
	beeep.Alert("One Dev", message, "")
}

func (a *App) GetWakaToday() string {
	log.Println("[+] Getting waka today")

	waka_cli := utils.WakaTimeCli()

	res, err := exec.Command(waka_cli, "--today").Output()

	if err != nil {
		log.Println(err)
		return "0 seconds Today"
	}

	return fmt.Sprintf("%s Today", string(res))

}

func (a *App) KillProcess(pid int) {

	process, err := os.FindProcess(pid)

	if err != nil {
		log.Println(err)
	}

	err = process.Signal(os.Kill)

	if err != nil {
		log.Println(err)
	}

}

func (a *App) GetSystemStat() data.SystemStats {

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

	if err != nil {
		log.Fatalln(err)
	}

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
