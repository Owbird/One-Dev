package database

import (
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
)

func NewInstance() *DatabaseController {
	return &DatabaseController{}
}

type DatabaseController struct {
}

func (dbc *DatabaseController) GetGitToken() string {
	return database.GetGitToken()
}

func (dbc *DatabaseController) SaveGitToken(token string) {
	database.SaveGitToken(token)
}

func (dbc *DatabaseController) GetGitDirs() []data.File {

	return database.GetGitDirs()
}
