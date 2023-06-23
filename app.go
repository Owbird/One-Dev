package main

import (
	"context"
	"log"

	"github.com/owbird/one-dev/logic/background"
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
	go background.RunTasks()
	a.ctx = ctx
}
