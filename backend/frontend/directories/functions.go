package directories

import (
	"context"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/utils"
)

const (
	ErrPrefix = "DF"

	GetDirectoriesErr = iota
	OpenFileErr
)

// Returns a new instance of Directory Functions
func NewInstance() *DirectoriesFunctions {
	return &DirectoriesFunctions{}
}

type DirectoriesFunctions struct {
	Ctx context.Context
}

// GetDirectories retrieves a list of directories from the specified path.
func (df *DirectoriesFunctions) GetDirectories(path string, showHiddenFiles bool) ([]data.Directory, error) {
	defer utils.HandlePanic(df.Ctx, ErrPrefix, GetDirectoriesErr)

	log.Println("[+] Getting directories")

	directories := []data.Directory{}

	dir, err := os.Open(path)
	if err != nil {
		log.Println(err)
	}

	files, err := dir.ReadDir(0)
	if err != nil {
		log.Println(err)
	}

	for _, file := range files {
		isHidden := strings.HasPrefix(file.Name(), ".")

		if !showHiddenFiles && isHidden {
			continue // Skip hidden directories if showHiddenFiles is false
		}

		directories = append(directories, data.Directory{
			Name:  file.Name(),
			IsDir: file.IsDir(),
			Path:  filepath.Join(path, file.Name()),
		})
	}

	return directories, nil
}

// OpenFile opens a file using the appropriate command based on the operating system.
func (df *DirectoriesFunctions) OpenFile(path string) {
	defer utils.HandlePanic(df.Ctx, ErrPrefix, OpenFileErr)

	var cmd string
	var args []string

	if runtime.GOOS == "linux" {
		cmd = "xdg-open"
		args = []string{
			path,
		}
	} else if runtime.GOOS == "darwin" {
		cmd = "open"
		args = []string{
			path,
		}
	} else {
		cmd = "cmd"
		args = []string{
			"/c",
			"start",
			path,
		}
	}

	exec.Command(cmd, args...).Run()
}
