package background

import (
	"github.com/owbird/one-dev/logic/database"
)

func RunTasks() {
	database.Init()

	go ReadGitDirs()
}
