package main

import (
	"context"
	"fmt"
	"log"
	"math"
	"os"
	"os/exec"
	"strings"

	"github.com/distatus/battery"
	"github.com/gen2brain/beeep"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
	"github.com/go-git/go-git/v5/plumbing/object"
	"github.com/owbird/one-dev/logic/background"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
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
	go background.RunTasks()
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

func (a *App) GetGitDirs() []data.File {
	return database.GetGitDirs()
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

func (a *App) GetRepo(path string) data.Repo {
	log.Println("[+] Getting git dir")

	git_repo := data.Repo{}

	repo, err := git.PlainOpen(path)

	if err != nil {
		log.Println(err)
	}

	head, err := repo.Head()

	if err != nil {
		return git_repo
	}

	branch := head.Name()

	git_repo.CurrentBranch = branch.Short()

	git_log, err := repo.Log(&git.LogOptions{})

	if err != nil {
		log.Println(err)
	}

	git_log.ForEach((func(commit *object.Commit) error {

		git_repo.Commits = append(git_repo.Commits, data.RepoCommit{
			Message:   commit.Message,
			Committer: commit.Committer.Name,
			Hash:      commit.Hash.String(),
			Date:      commit.Committer.When.Format("2nd January, 2006"),
		})

		return nil
	}))

	branches, err := repo.Branches()

	if err != nil {
		log.Println(err)
	}

	branches.ForEach(func(branch *plumbing.Reference) error {

		git_repo.Branches = append(git_repo.Branches, branch.Name().Short())

		return nil
	})

	tags, err := repo.Tags()

	if err != nil {
		log.Println(err)
	}

	tags.ForEach(func(tag *plumbing.Reference) error {

		git_repo.Tags = append(git_repo.Tags, tag.Name().Short())

		return nil
	})

	worktree, err := repo.Worktree()

	if err != nil {
		log.Println(err)
	}

	status, err := worktree.Status()

	if err != nil {
		log.Println(err)
	}

	for file, status := range status {

		code := strings.ReplaceAll(string(status.Staging), " ", "M")

		code = strings.ReplaceAll(code, "?", "N")

		change := data.RepoChange{
			File:   file,
			Change: code,
		}

		git_repo.Changes = append(git_repo.Changes, change)

	}

	log.Println(git_repo)
	return git_repo
}
