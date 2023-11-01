package settings

import (
	"github.com/owbird/one-dev/backend/data"
	"github.com/owbird/one-dev/backend/database"
)

func NewInstance() *SettingsFunctions {
	return &SettingsFunctions{
		db: *database.NewInstance(),
	}
}

type SettingsFunctions struct {
	db database.Database
}

// GetSettings retrieves the settings from one.json.
//
// It returns a data.OneJson and an error.
func (sf *SettingsFunctions) GetSettings() (data.OneJson, error) {

	return sf.db.GetOneJson()
}

// SaveSettings saves the settings to the one.json file.
//
// It takes a parameter `settings` of type `data.OneJson` which represents the settings to be saved.
// It returns an error if there was any issue while saving the settings.
func (sf *SettingsFunctions) SaveSettings(settings data.OneJson) error {
	return sf.db.SaveSettings(settings)
}
