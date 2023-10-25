package database

import (
	"encoding/json"
	"io/fs"
	"log"
	"os"
	"path"
	"path/filepath"

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

// GetGitDirs returns a slice of data File structs representing Git directories.
//
// This function returns a slice of data File structs.
func (db *Database) GetGitDirs() ([]data.File, error) {

	dirs := []data.File{}

	log.Println("[+] Reading Git dirs")
	home, err := utils.UserHome()

	if err != nil {
		log.Fatalln(err)
	}

	filepath.WalkDir(home, func(path string, d fs.DirEntry, err error) error {

		if d.IsDir() {

			dirName := d.Name()

			if string(dirName[0]) == "." && dirName != ".git" {
				return filepath.SkipDir
			}

			if dirName == ".git" {
				dir := data.File{
					ParentDir: filepath.Dir(path),
					Dir:       filepath.Base(filepath.Dir(path)),
				}

				dirs = append(dirs, dir)

				// database.IndexGitDir(dir)
			}
		}

		return nil
	})

	return dirs, nil
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
