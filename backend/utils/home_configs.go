package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
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

	cliName := fmt.Sprintf("wakatime-cli-%s-%s", runtime.GOOS, runtime.GOARCH)

	if runtime.GOOS == "windows" {
		cliName = fmt.Sprintf("%s.exe", cliName)
	}

	return filepath.Join(dir, ".wakatime", cliName), nil

}
