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

// GetGitToken retrieves the Git token from the database.
//
// Returns a string representing the Git token.
func (dbc *DatabaseController) GetGitToken() string {
	return database.GetGitToken()
}

// SaveGitToken saves a Git token into the database.
//
// token: a string representing the Git token.
func (dbc *DatabaseController) SaveGitToken(token string) {
	database.SaveGitToken(token)
}

// GetGitDirs returns a slice of data.File representing the Git directories
// available in the database.
func (dbc *DatabaseController) GetGitDirs() []data.File {

	return database.GetGitDirs()
}
