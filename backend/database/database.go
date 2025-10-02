package database

import (
	"encoding/json"
	"log"
	"os"
	"path"
	"sync"

	c "github.com/ostafen/clover"
	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/utils"
)

type Database struct {
	OpenState sync.Mutex
	Db        *c.DB
}

var database Database

func NewInstance() *Database {
	return &Database{}
}


// EnsureOneDir creates a directory for storing app data.
//
// This function does not take any parameters.
// It does not return any values.
func (db *Database) EnsureOneDir() {
	oneDir := utils.GetOneDirPath()

	os.Mkdir(oneDir, 0755)

	oneJson := path.Join(oneDir, "one.json")

	_, err := os.Stat(oneJson)
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

// IndexLocalRepos indexes local repositories.
func (db *Database) IndexLocalRepos(repos []data.File) error {
	log.Println("[+] Indexing local repos")

	reposJson, err := json.MarshalIndent(repos, "", "\t")
	if err != nil {
		return err
	}

	reposFilePath := utils.GetIndexedReposFilePath()

	os.WriteFile(reposFilePath, reposJson, 0644)

	return nil
}

func (db *Database) GetIndexedRepos() ([]data.File, error) {
	log.Println("[+] Getting Indexed local repos")

	reposFilePath := utils.GetIndexedReposFilePath()

	repos, err := os.ReadFile(reposFilePath)
	if err != nil {
		return []data.File{}, err
	}

	var reposJson []data.File

	json.Unmarshal(repos, &reposJson)

	return reposJson, nil
}

// SaveSettings saves the settings to the one.json file.
func (db *Database) SaveSettings(settings data.OneJson) error {
	oneJson, err := json.MarshalIndent(settings, "", "\t")

	oneJsonPath := utils.GetOneJsonPath()

	if err != nil {
		return err
	}

	err = os.WriteFile(oneJsonPath, oneJson, 0644)
	if err != nil {
		return err
	}

	return nil
}

// Save app state to the state.json file
func (db *Database) SaveAppState(state data.AppState) error {
	log.Println("[+] Saving app state")

	stateJson, err := json.MarshalIndent(state, "", "\t")
	if err != nil {
		return err
	}

	db.OpenState.Lock()

	stateFilePath := utils.GetAppStateFilePath()

	err = os.WriteFile(stateFilePath, stateJson, 0644)

	db.OpenState.Unlock()

	if err != nil {
		return err
	}

	return nil
}

// Load the state from the state.json file
func (db *Database) GetAppState() data.AppState {
	log.Println("[+] Fetching app state")

	stateFilePath := utils.GetAppStateFilePath()

	state, err := os.ReadFile(stateFilePath)
	if err != nil {
		return data.AppState{
			OpenedTabs: []data.OpenedTabs{
				{
					Label:  "Home",
					Source: "nav",
				},
			},
			ActiveIndex: 0,
		}
	}

	var stateJson data.AppState

	json.Unmarshal(state, &stateJson)

	return stateJson
}
