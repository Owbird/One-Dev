package utils

import (
	"log"
	"time"

	"github.com/owbird/one-dev/logic/data"
	"github.com/shirou/gopsutil/host"
)

func GetUptime() data.UpTime {

	uptime, err := host.Uptime()

	if err != nil {
		log.Println(err)
	}

	duration := time.Duration(uptime) * time.Second

	return data.UpTime{
		Days:    int(duration.Hours() / 24),
		Hours:   int(duration.Hours()) % 24,
		Minutes: int(duration.Minutes()) % 60,
	}
}
