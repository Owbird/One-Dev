package main

import (
	"context"
  "log"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
  log.Println("[+] App startup")
  a.ctx = ctx 

}
