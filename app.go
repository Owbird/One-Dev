package main

import (
	"context"
	"log"

	"github.com/owbird/one-dev/logic/background"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	git_ui "github.com/owbird/one-dev/logic/frontend/git"
	"github.com/owbird/one-dev/logic/frontend/home"
	"github.com/owbird/one-dev/logic/frontend/shared"
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
	shared.Notify(message)
}

func (a *App) GetWakaToday() string {
	return shared.GetWakaToday()
}

func (a *App) GetGitDirs() []data.File {
	return database.GetGitDirs()
}

func (a *App) KillProcess(pid int) {
	shared.KillProcess(pid)
}

func (a *App) GetSystemStat() data.SystemStats {
	return home.GetSystemStat()
}

func (a *App) GetRepo(path string) data.Repo {
	return git_ui.GetRepo(path)
}
