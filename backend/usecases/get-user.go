package usecases

import (
	"github.com/Gustavoss150/simoldes-backend/models"
	usersrepo "github.com/Gustavoss150/simoldes-backend/repositories/users_repository"
)

func GetUserProfile(usersRepo usersrepo.UsersRepository, userID int) (*models.User, error) {
	return usersRepo.GetUserByID(userID)
}
