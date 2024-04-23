package utils

import (
	"context"
	"fmt"
	"log"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func HandlePanic(ctx context.Context, prefix string, code int) {
	if err := recover(); err != nil {
		log.Println("PANIC: ", err)

		runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
			Type:    runtime.ErrorDialog,
			Title:   "An error has occurred",
			Message: fmt.Sprintf("Encountered error code %v00%v", prefix, code),
		})
	}
}
