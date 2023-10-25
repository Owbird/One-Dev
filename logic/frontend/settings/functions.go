package settings

import (
	"encoding/json"
	"os"

	"github.com/owbird/one-dev/logic/data"
	"github.com/owbird/one-dev/logic/database"
	"github.com/owbird/one-dev/logic/utils"
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
	oneJson, err := json.MarshalIndent(settings, "", "\t")

	oneJsonPath := utils.GetOneJsonPath()

	if err != nil {
		return err
	}

	err = os.WriteFile(oneJsonPath, oneJson, 0644)

	if err != nil {
		return err
	}

	return nil
}
