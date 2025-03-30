package usersrepo

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/config"
	"github.com/Gustavoss150/simoldes-backend/models"
	"gorm.io/gorm"
)

type usersRepository struct {
	DB *gorm.DB
}

func InitUsersDatabase() (UsersRepository, error) {
	db := config.DB
	if db == nil {
		return nil, errors.New("failed to connect to the database")
	}
	return &usersRepository{DB: db}, nil
}

func (r *usersRepository) GetUserByRegistration(registration int) (*models.User, error) {
	var user models.User

	if err := r.DB.Where("registration = ?", registration).First(&user).Error; err != nil {
		if err.Error() == "record not found" {
			return nil, errors.New("user not found")
		}
		return nil, errors.New("error retrieving user by registration: " + err.Error())
	}
	return &user, nil
}

func (r *usersRepository) GetUserByID(userID int) (*models.User, error) {
	var user models.User
	if err := r.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func (r *usersRepository) SaveUser(user *models.User) error {
	return r.DB.Save(user).Error
}
