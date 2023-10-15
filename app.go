package main

import (
	"context"
	"log"

	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/frontend/git"
	"github.com/owbird/one-dev/logic/frontend/helpers"
	"github.com/owbird/one-dev/logic/frontend/home"
)

type App struct {
	ctx context.Context
	*helpers.HelperFunctions
	*home.HomeFunctions
	*git.GitFunctions
}

func NewApp() *App {
	return &App{
		HelperFunctions: helpers.NewInstance(),
		HomeFunctions:   home.NewInstance(),
		GitFunctions:    git.NewInstance(),
	}
}

func (a *App) startup(ctx context.Context) {
	log.Println("[+] App startup")
	a.ctx = ctx
	a.GitFunctions.Ctx = ctx

	db := database.NewInstance()

	db.EnsureOneDir()
}
