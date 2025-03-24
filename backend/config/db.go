package config

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// usuario: admin | senha: 12345678 | ip original | porta 3306
	dsn := "admin:12345678@tcp(192.168.100.8:3306)/simoldes_db?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}

	DB = database
	fmt.Println("Banco de dados conectado com sucesso!")
}
