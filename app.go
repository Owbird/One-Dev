package main

import (
	"context"
	"log"

	"fyne.io/systray"
	"github.com/owbird/one-dev/backend/database"
	"github.com/owbird/one-dev/backend/frontend/directories"
	"github.com/owbird/one-dev/backend/frontend/git"
	"github.com/owbird/one-dev/backend/frontend/helpers"
	"github.com/owbird/one-dev/backend/frontend/home"
	"github.com/owbird/one-dev/backend/frontend/settings"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
	*helpers.HelperFunctions
	*home.HomeFunctions
	*git.GitFunctions
	*settings.SettingsFunctions
	*directories.DirectoriesFunctions
}

func NewApp() *App {
	return &App{
		HelperFunctions:      helpers.NewInstance(),
		HomeFunctions:        home.NewInstance(),
		GitFunctions:         git.NewInstance(),
		SettingsFunctions:    settings.NewInstance(),
		DirectoriesFunctions: directories.NewInstance(),
	}
}

func (a *App) startup(ctx context.Context) {
	log.Println("[+] App startup")
	a.ctx = ctx
	a.GitFunctions.Ctx = ctx
	a.DirectoriesFunctions.Ctx = ctx
	a.HomeFunctions.Ctx = ctx
	a.HelperFunctions.Ctx = ctx
	a.SettingsFunctions.Ctx = ctx

	db := database.NewInstance()

	db.EnsureOneDir()

	runtime.WindowMaximise(ctx)

	systray.Run(func() {
	}, func() {})
}
