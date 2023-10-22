package utils

import "path"

func GetOneJsonPath() string {
	user_home, _ := UserHome()

	one_json_path := path.Join(user_home, ".onedev", "one.json")

	return one_json_path
}
