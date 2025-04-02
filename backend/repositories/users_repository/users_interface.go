package usersrepo

import (
	"github.com/Gustavoss150/simoldes-backend/models"
)

type UsersRepository interface {
	GetUserByRegistration(registration int) (*models.User, error)
	GetUserByID(userID int) (*models.User, error)
	GetAllUsers() ([]*models.User, error)
	SaveUser(user *models.User) error
}
