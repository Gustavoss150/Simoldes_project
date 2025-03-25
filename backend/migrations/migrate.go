package migrations

import (
	"log"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models/entities"
)

func Migrate() {
	err := config.DB.AutoMigrate(&entities.User{})
	if err != nil {
		log.Fatal("error migrating: " + err.Error())
	}
	log.Println("migrations executed successfully")
}
