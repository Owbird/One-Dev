package helpers

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/gen2brain/beeep"
	"github.com/owbird/one-dev/logic/utils"
)

// NewInstance returns a new instance of HelperFunctions.
//
// Returns a pointer to a HelperFunctions struct.
func NewInstance() *HelperFunctions {
	return &HelperFunctions{}
}

type HelperFunctions struct{}

// Notify is a method of the HelperFunctions struct that displays a notification message using the beeep package.
//
// It takes in a string parameter called message that represents the message to be displayed.
func (sf *HelperFunctions) Notify(message string) {
	beeep.Alert("One Dev", message, "")
}

// GetWakaToday returns the time spent coding today from WakaTime.
//
// It returns a string.
func (sf *HelperFunctions) GetWakaToday() string {

	wakaCli, err := utils.WakaTimeCli()

	if err != nil {
		return "0 seconds Today"
	}

	res, err := exec.Command(wakaCli, "--today").Output()

	if err != nil {
		return "0 seconds Today"
	}

	return fmt.Sprintf("%s Today", string(res))

}

// KillProcess kills a process with the specified PID.
//
// pid: An integer representing the process ID.
func (sf *HelperFunctions) KillProcess(pid int) error {

	process, err := os.FindProcess(pid)

	if err != nil {
		return err
	}

	err = process.Signal(os.Kill)

	if err != nil {
		return err
	}

	return nil
}
