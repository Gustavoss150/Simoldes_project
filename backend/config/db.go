package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Erro ao carregar o arquivo .env")
	}
}

func ConnectDatabase() {
	LoadEnv()

	dsn := os.Getenv("DATABASE_URL")
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}

	DB = database
	log.Println("Banco de dados conectado com sucesso!")
}
