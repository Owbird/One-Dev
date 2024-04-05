package data

type AppState struct {
	OpenedTabLabels []string `json:"openedTabLabels"`
	ActiveIndex     int      `json:"activeIndex"`
}
