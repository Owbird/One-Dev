package utils

import (
	"github.com/owbird/one-dev/logic/data"
	"log"
	"syscall"
	"time"
)

func GetUptime() data.UpTime {
	sysinfo := syscall.Sysinfo_t{}

	err := syscall.Sysinfo(&sysinfo)

	if err != nil {
		log.Println("Error:", err)
	}
	uptime := time.Duration(sysinfo.Uptime) * time.Second
	days := uptime / (24 * time.Hour)

	uptime -= days * 24 * time.Hour
	hours := uptime / time.Hour
	uptime -= hours * time.Hour
	minutes := uptime / time.Minute

	return data.UpTime{
		Days:    int(days),
		Hours:   int(hours),
		Minutes: int(minutes),
	}
}
