package main

import (
	"context"
	"log"

	"github.com/owbird/one-dev/backend/database"
	"github.com/owbird/one-dev/backend/frontend/git"
	"github.com/owbird/one-dev/backend/frontend/helpers"
	"github.com/owbird/one-dev/backend/frontend/home"
	"github.com/owbird/one-dev/backend/frontend/settings"
)

type App struct {
	ctx context.Context
	*helpers.HelperFunctions
	*home.HomeFunctions
	*git.GitFunctions
	*settings.SettingsFunctions
}

func NewApp() *App {
	return &App{
		HelperFunctions:   helpers.NewInstance(),
		HomeFunctions:     home.NewInstance(),
		GitFunctions:      git.NewInstance(),
		SettingsFunctions: settings.NewInstance(),
	}
}

func (a *App) startup(ctx context.Context) {
	log.Println("[+] App startup")
	a.ctx = ctx
	a.GitFunctions.Ctx = ctx

	db := database.NewInstance()

	db.EnsureOneDir()
}
