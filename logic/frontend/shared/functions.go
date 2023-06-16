package shared

import (
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/gen2brain/beeep"
	"github.com/owbird/one-dev/logic/utils"
)

func NewInstance() *SharedFunctions {
	return &SharedFunctions{}
}

type SharedFunctions struct{}

func (sf SharedFunctions) Notify(message string) {
	beeep.Alert("One Dev", message, "")
}

func (sf SharedFunctions) GetWakaToday() string {

	waka_cli := utils.WakaTimeCli()

	res, err := exec.Command(waka_cli, "--today").Output()

	if err != nil {
		return "0 seconds Today"
	}

	return fmt.Sprintf("%s Today", string(res))

}

func (sf SharedFunctions) KillProcess(pid int) {

	process, err := os.FindProcess(pid)

	log.Println(err)

	err = process.Signal(os.Kill)

}
