package shared

import (
	"context"
	"fmt"
	"os"
	"os/exec"

	"github.com/gen2brain/beeep"
	"github.com/owbird/one-dev/logic/utils"
)

func Notify(ctx context.Context, message string) {
	beeep.Alert("One Dev", message, "")
}

func GetWakaToday(ctx context.Context) string {

	// utils.HandleError(conte "TEST")

	waka_cli := utils.WakaTimeCli()

	res, err := exec.Command(waka_cli, "--today").Output()

	if err != nil {
		utils.HandleError(ctx, err)
		return "0 seconds Today"
	}

	return fmt.Sprintf("%s Today", string(res))

}

func KillProcess(ctx context.Context, pid int) {

	process, err := os.FindProcess(pid)

	utils.HandleError(ctx, err)

	err = process.Signal(os.Kill)

	utils.HandleError(ctx, err)

}
