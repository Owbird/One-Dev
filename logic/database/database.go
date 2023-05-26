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

func (d *Database) Close() {
	d.Db.Close()
	d.OpenState.Lock()
}

func (d *Database) Open() {
	db, err := c.Open(".onedev")

	if err != nil {
		log.Println(err)
	}

	d.Db = db

}

func Init() {

	database = Database{}

	database.Open()

}

func IndexGitDir(dir data.File) {
	database.OpenState.Lock()

	defer database.OpenState.Unlock()

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

func GetGitDirs() []data.File {

	dirs := []data.File{}

	database.OpenState.Lock()

	defer database.OpenState.Unlock()

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

	return dirs
}
