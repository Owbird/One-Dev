package data

import "time"

type File struct {
	ParentDir string    `json:"parentDir"`
	Dir       string    `json:"dir"`
	ModTime   time.Time `json:"modTime"`
}
