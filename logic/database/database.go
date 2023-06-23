package database

import (
	"log"
	"sort"
	"strings"

	"sync"

	c "github.com/ostafen/clover"
	"github.com/owbird/one-dev/logic/data"
)

type Database struct {
	OpenState sync.Mutex
	Db        *c.DB
}

var database Database

// Close closes the database connection and acquires a lock on the OpenState.
func (d *Database) Close() {
	d.Db.Close()
	d.OpenState.Lock()
}

// Open opens a connection to the database stored in the ".onedev" file.
func (d *Database) Open() error {
	db, err := c.Open(".onedev")

	if err != nil {
		return err
	}

	d.Db = db

	return nil

}

// Init initializes the database by opening a connection.
func Init() {

	database = Database{}

	database.Open()

}

// IndexGitDir indexes a Git directory.
//
// dir is the directory to index.
func IndexGitDir(dir data.File) error {
	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	err := database.Db.CreateCollection("git_dirs")

	if err != c.ErrCollectionExist {
		return err
	}

	exists, err := database.Db.Query("git_dirs").Where((*c.Criteria)(c.Field("dir").Eq(dir.Dir))).FindFirst()

	if err != nil {
		return err
	}

	if exists == nil {
		doc := c.NewDocument()

		doc.Set("dir", dir.Dir)
		doc.Set("parentDir", dir.ParentDir)

		_, err = database.Db.InsertOne("git_dirs", doc)

		if err != nil {
			return err
		}
	}
	return nil
}

// GetGitDirs returns a slice of data File structs representing Git directories.
//
// This function returns a slice of data File structs.
func GetGitDirs() ([]data.File, error) {

	dirs := []data.File{}

	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	log.Println("[+] Getting Git dirs")

	docs, err := database.Db.Query("git_dirs").FindAll()

	if err != nil {
		return nil, err
	}

	for _, doc := range docs {
		dir := &data.File{}
		doc.Unmarshal(dir)

		dirs = append(dirs, *dir)
	}

	sort.Slice(dirs, func(i, j int) bool {

		return strings.Compare(dirs[i].Dir, dirs[j].Dir) < 0
	})

	return dirs, nil
}

// GetGitToken retrieves the Git token from the database.
//
// It returns a string.
func GetGitToken() string {
	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	doc, err := database.Db.Query("git_token").FindFirst()

	if err != nil || doc == nil {
		return ""
	}

	return doc.Get("git_token").(string)
}

// SaveGitToken saves a git token in the database.
//
// token: string representing the git token to be saved.
func SaveGitToken(token string) error {
	database.OpenState.Lock()

	defer database.OpenState.Unlock()

	doc := c.NewDocument()

	doc.Set("git_token", token)

	err := database.Db.CreateCollection("git_token")

	if err != c.ErrCollectionExist {
		return err
	}

	database.Db.InsertOne("git_token", doc)

	return nil

}
