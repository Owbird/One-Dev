package utils

import (
	"os"
	"path"
)

func UserHome() (string, error) {
	dir, err := os.UserHomeDir()

	if err != nil {
		return "", err
	}

	return dir, nil

}

func WakaTimeCli() (string, error) {
	dir, err := UserHome()

	if err != nil {
		return "", err
	}
	return path.Join(dir, ".wakatime", "wakatime-cli"), nil

}
