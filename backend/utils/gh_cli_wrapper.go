package utils

import (
	"fmt"
	"os/exec"
)


// RunGhCliCmd executes a GitHub CLI command with the given arguments and returns its output.
// Returns an error if the command fails.
func RunGhCliCmd(cmds ...string) (string, error) {
	res, err := exec.Command("gh", cmds...).Output()
	data := string(res)
	if err != nil {
		return "", fmt.Errorf("Error: %s", data)
	}
	return data, nil
}
