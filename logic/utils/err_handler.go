package utils

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func HandleError(ctx context.Context, err error) {
	if err != nil {
		runtime.EventsEmit(ctx, "error", err)
	}

}
