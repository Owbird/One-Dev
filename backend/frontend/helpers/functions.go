package helpers

import (
	"context"
	"fmt"
	"os"
	"os/exec"

	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/database"
	"github.com/owbird/one-dev/backend/utils"
)

const (
	ErrPrefix = "HF"

	NotifyErr = iota
	GetWakaTodayErr
	KillProcessErr
)

// NewInstance returns a new instance of HelperFunctions.
//
// Returns a pointer to a HelperFunctions struct.
func NewInstance() *HelperFunctions {
	return &HelperFunctions{
		db: *database.NewInstance(),
	}
}

type HelperFunctions struct {
	db  database.Database
	Ctx context.Context
}

// Notify is a method of the HelperFunctions struct that displays a notification message using the beeep package.
//
// It takes in a string parameter called message that represents the message to be displayed.
func (sf *HelperFunctions) Notify(message string) {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, NotifyErr)

	utils.Notify(message)
}

// GetWakaToday returns the time spent coding today from WakaTime.
//
// It returns a string.
func (sf *HelperFunctions) GetWakaToday() string {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, GetWakaTodayErr)

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
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, KillProcessErr)

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

// Save the state to the database
func (sf *HelperFunctions) SaveAppState(state data.AppState) error {
	return sf.db.SaveAppState(state)
}

// Get the app state from the database
func (sf *HelperFunctions) GetAppState() data.AppState {
	return sf.db.GetAppState()
}
