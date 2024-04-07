package data

type OpenedTabs struct {
	Label  string                 `json:"label"`
	Source string                 `json:"source"`
	Meta   map[string]interface{} `json:"meta"`
}

type AppState struct {
	OpenedTabs  []OpenedTabs `json:"openedTabs"`
	ActiveIndex int          `json:"activeIndex"`
}
