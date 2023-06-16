package background

import (
	"io/fs"
	"log"
	"path/filepath"

	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/utils"
)

// ReadGitDirs reads all Git directories in the user's home directory and indexes them in a database.
func ReadGitDirs() {

	log.Println("[+] Reading Git dirs")

	filepath.WalkDir(utils.UserHome(), func(path string, d fs.DirEntry, err error) error {

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

				database.IndexGitDir(dir)
			}
		}

		return nil
	})

}
