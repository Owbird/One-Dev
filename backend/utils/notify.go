package utils

import "github.com/gen2brain/beeep"

// Notify sends a system notification
func Notify(message string) {
	beeep.Alert("One Dev", message, "")
}
