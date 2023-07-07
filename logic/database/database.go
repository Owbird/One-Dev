package database

import (
	"encoding/json"
	"io/fs"
	"log"
	"os"
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

// GetGitDirs returns a slice of data File structs representing Git directories.
//
// This function returns a slice of data File structs.
func GetGitDirs() ([]data.File, error) {

	dirs := []data.File{}

	log.Println("[+] Reading Git dirs")
	home, err := utils.UserHome()

	if err != nil {
		log.Fatalln(err)
	}

	filepath.WalkDir(home, func(path string, d fs.DirEntry, err error) error {

		if d.IsDir() {

			dir_name := d.Name()

			if string(dir_name[0]) == "." && dir_name != ".git" {
				return filepath.SkipDir
			}

			if dir_name == ".git" {
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
func GetGitUser() (data.GitUser, error) {
	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	var oneJson data.OneJson

	file, err := os.ReadFile("one.json")

	if err != nil {
		return data.GitUser{}, nil
	}

	json.Unmarshal(file, &oneJson)

	return data.GitUser{
		Username: oneJson.Git.Username,
		Token:    oneJson.Git.Token,
	}, nil
}
