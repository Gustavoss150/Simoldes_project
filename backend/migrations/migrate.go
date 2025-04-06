package migrations

import (
	"log"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
)

func Migrate() {
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Moldes{},
		&models.Componentes{},
		&models.Processos{},
		&models.Maquinas{},
		&models.Programacoes{},
		&models.ChegadaAcos{},
	)
	if err != nil {
		log.Fatal("error migrating: " + err.Error())
	}
	log.Println("migrations executed successfully")
}
