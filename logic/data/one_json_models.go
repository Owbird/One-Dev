package data

type OneJson struct {
	Git OneJsonGit `json:"git"`
}

type OneJsonGit struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}
