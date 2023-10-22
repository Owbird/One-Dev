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

func (sf *SettingsFunctions) GetSettings() (data.OneJson, error) {

	return sf.db.GetOneJson()
}

func (sf *SettingsFunctions) SaveSettings(settings data.OneJson) error {
	one_json, err := json.MarshalIndent(settings, "", "\t")

	one_json_path := utils.GetOneJsonPath()

	if err != nil {
		return err
	}

	err = os.WriteFile(one_json_path, one_json, 0644)

	if err != nil {
		return err
	}

	return nil
}
