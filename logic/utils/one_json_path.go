package utils

import "path"

func GetOneJsonPath() string {
	userHome, _ := UserHome()

	oneJsonPath := path.Join(userHome, ".onedev", "one.json")

	return oneJsonPath
}
