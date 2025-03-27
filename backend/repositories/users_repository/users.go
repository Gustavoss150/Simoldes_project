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

func (r *usersRepository) GetUserByID(userID int) (*models.User, error) {
	var user models.User
	if err := r.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

func (r *usersRepository) UpdateUser(user *models.User) error {
	return r.DB.Save(user).Error
}
