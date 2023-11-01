package directories

import (
	"log"
	"os"
	"path/filepath"

	"github.com/owbird/one-dev/backend/data"
)

// Returns a new instance of Directory Functions
func NewInstance() *DirectoriesFunctions {
	return &DirectoriesFunctions{}
}

type DirectoriesFunctions struct{}

func (df *DirectoriesFunctions) GetDirectories(path string) ([]data.Directory, error) {
	log.Println("[+] Getting directories")

	directories := []data.Directory{}

	// Directory path to list its content

	dir, err := os.Open(path)

	if err != nil {
		log.Println(err)
	}

	files, err := dir.ReadDir(0)

	if err != nil {
		log.Println(err)
	}

	for _, file := range files {

		directories = append(directories, data.Directory{
			Name:  file.Name(),
			IsDir: file.IsDir(),
			Path:  filepath.Join(path, file.Name()),
		})
	}

	return directories, nil
}
