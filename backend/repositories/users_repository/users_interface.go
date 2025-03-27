package usersrepo

import (
	"github.com/Gustavoss150/simoldes-backend/models"
)

type UsersRepository interface {
	GetUserByID(userID int) (*models.User, error)
	UpdateUser(user *models.User) error
}
