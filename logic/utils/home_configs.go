package utils

import (
	"log"
	"os"
	"path"
)

func UserHome() string {
	dir, err := os.UserHomeDir()

	if err != nil {
		log.Println(err)
	}

	return dir

}

func WakaTimeCli() string {
	dir := UserHome()
	return path.Join(dir, ".wakatime", "wakatime-cli")

}
