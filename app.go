package main

import (
	"context"
	"log"

	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/frontend/git"
	"github.com/owbird/one-dev/logic/frontend/home"
	"github.com/owbird/one-dev/logic/frontend/shared"
)

type App struct {
	ctx context.Context
	*shared.SharedFunctions
	*home.HomeFunctions
	*git.GitFunctions
}

func NewApp() *App {
	return &App{
		SharedFunctions: shared.NewInstance(),
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
