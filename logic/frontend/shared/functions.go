package shared

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/gen2brain/beeep"
	"github.com/owbird/one-dev/logic/utils"
)

func Notify(message string) {
	beeep.Alert("One Dev", message, "")
}

func GetWakaToday() string {

	waka_cli := utils.WakaTimeCli()

	res, err := exec.Command(waka_cli, "--today").Output()

	if err != nil {
		log.Println(err)
		return "0 seconds Today"
	}

	return fmt.Sprintf("%s Today", string(res))

}

func KillProcess(pid int) {

	process, err := os.FindProcess(pid)

	if err != nil {
		log.Println(err)
	}

	err = process.Signal(os.Kill)

	if err != nil {
		log.Println(err)
	}

}
