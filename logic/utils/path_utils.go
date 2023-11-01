package utils

import "path"

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
