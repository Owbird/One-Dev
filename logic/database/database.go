package database

import (
	"log"
	"sort"
	"strings"

	c "github.com/ostafen/clover"
	"github.com/owbird/one-dev/logic/data"
)

type Database struct {
	OpenState chan bool
	Db        *c.DB
}

var database Database

func (d *Database) Close() {
	d.Db.Close()
	d.ToggleState()
}

func (d *Database) Open() {
	db, err := c.Open(".onedev")

	if err != nil {
		log.Println(err)
	}

	d.Db = db

	d.ToggleState()

}

func (d *Database) ToggleState() {

	if d.OpenState == nil {
		d.OpenState = make(chan bool, 1)
		d.OpenState <- true

		return
	}

	d.OpenState <- !<-d.OpenState

}

func (d *Database) IsOpen() bool {

	current_state := <-d.OpenState

	// Replace state buffer so its not empty!
	d.OpenState <- current_state

	return current_state

}

func Init() {

	database = Database{}

	database.Open()

}

func IndexGitDir(dir data.File) {

	if database.IsOpen() {

		database.ToggleState()

		defer database.ToggleState()

		err := database.Db.CreateCollection("git_dirs")

		if err != c.ErrCollectionExist {
			log.Println(err)
		}

		exists, err := database.Db.Query("git_dirs").Where((*c.Criteria)(c.Field("dir").Eq(dir.Dir))).FindFirst()

		if err != nil {
			log.Println(err)
		}

		if exists == nil {
			doc := c.NewDocument()

			doc.Set("dir", dir.Dir)
			doc.Set("parentDir", dir.ParentDir)

			_, err = database.Db.InsertOne("git_dirs", doc)

			if err != nil {
				log.Println(err)
			}
		}

	}

}

func GetGitDirs() []data.File {

	dirs := []data.File{}

	if database.IsOpen() {

		database.ToggleState()

		defer database.ToggleState()

		log.Println("[+] Getting Git dirs")

		docs, err := database.Db.Query("git_dirs").FindAll()

		if err != nil {
			log.Println(err)
		}

		for _, doc := range docs {
			dir := &data.File{}
			doc.Unmarshal(dir)

			dirs = append(dirs, *dir)
		}

		sort.Slice(dirs, func(i, j int) bool {

			return strings.Compare(dirs[i].Dir, dirs[j].Dir) < 0
		})

	}

	return dirs
}
