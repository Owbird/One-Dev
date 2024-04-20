package data

type OneJson struct {
	Git     OneJsonGit `json:"git"`
	Modules []string   `json:"modules"`
}

type OneJsonGit struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}
