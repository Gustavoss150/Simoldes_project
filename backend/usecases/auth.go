package usecases

import (
	"errors"
	"log"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	auth "github.com/Gustavoss150/simoldes-backend/utils"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(user models.User) error {
	if err := config.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

func Login(registration int, password string) (string, error) {
	var user models.User

	log.Printf("Tentando login com registration: %d e password: %s", registration, password)

	if err := config.DB.Where("registration = ?", registration).First(&user).Error; err != nil {
		return "", errors.New("user not found")
	}

	if !user.IsActive {
		return "", errors.New("user is not active")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("incorrect password")
	}

	token, err := auth.GenerateJWT(int(user.ID), user.Role)
	if err != nil {
		return "", err
	}
	return token, nil
}
