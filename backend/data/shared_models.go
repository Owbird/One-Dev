package data

import "time"

type File struct {
	User      string    `json:"user"`
	ParentDir string    `json:"parentDir"`
	Dir       string    `json:"dir"`
	ModTime   time.Time `json:"modTime"`
}
