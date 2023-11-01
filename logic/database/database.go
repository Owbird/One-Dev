package database

import (
	"encoding/json"
	"log"
	"os"
	"path"

	"sync"

	c "github.com/ostafen/clover"
	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/utils"
)

type Database struct {
	OpenState sync.Mutex
	Db        *c.DB
}

var database Database

func NewInstance() *Database {
	return &Database{}
}

// GetGitToken retrieves the Git token from the database.
//
// It returns a string.
func (db *Database) GetGitUser() (data.GitUser, error) {

	oneJson, err := db.GetOneJson()

	if err != nil {
		return data.GitUser{}, err
	}

	return data.GitUser{
		Username: oneJson.Git.Username,
		Token:    oneJson.Git.Token,
	}, nil
}

// EnsureOneDir creates a directory for storing app data.
//
// This function does not take any parameters.
// It does not return any values.
func (db *Database) EnsureOneDir() {
	userHome, err := utils.UserHome()

	if err != nil {
		log.Fatalln(err)
	}

	oneDir := path.Join(userHome, ".onedev")

	os.Mkdir(oneDir, 0755)

	oneJson := path.Join(oneDir, "one.json")

	_, err = os.Stat(oneJson)

	if err != nil {
		_, err := os.Create(oneJson)

		if err != nil {
			log.Fatalln(err)
		}

	}

}

// GetOneJson retrieves the OneJson file.
func (db *Database) GetOneJson() (data.OneJson, error) {

	oneJsonPath := utils.GetOneJsonPath()

	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	var oneJson data.OneJson

	file, err := os.ReadFile(oneJsonPath)

	if err != nil {
		return data.OneJson{}, err
	}

	json.Unmarshal(file, &oneJson)

	return oneJson, nil

}
