package background

import (
	"github.com/owbird/one-dev/logic/database"
)

// RunTasks initializes the database and starts a goroutine to read Git directories.
func RunTasks() {
	database.Init()

	go ReadGitDirs()
}
