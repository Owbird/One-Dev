package utils

import (
	"os"
	"path"
)

func GetOneJsonPath() string {
	oneDir := GetOneDirPath()

	oneJsonPath := path.Join(oneDir, "one.json")

	return oneJsonPath
}

func GetOneDirPath() string {
	userHome, _ := UserHome()

	oneDir := path.Join(userHome, ".onedev")

	return oneDir
}

func GetIndexedReposFilePath() string {
	reposFilePath := path.Join(GetOneDirPath(), "repos.json")

	if _, err := os.Stat(reposFilePath); err != nil {
		os.Create(reposFilePath)
	}

	return reposFilePath

}

func GetAppStateFilePath() string {
	oneDirPath := GetOneDirPath()

	return path.Join(oneDirPath, "state.json")
}
