package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	usersrepo "github.com/Gustavoss150/simoldes-backend/repositories/users_repository"
	"golang.org/x/crypto/bcrypt"
)

func UpdateUser(
	usersRepo usersrepo.UsersRepository,
	updateRequest contracts.UpdateUserRequest,
	targetUserID int,
	tokenUserID int,
	userRole string,
) error {
	if userRole != "admin" && targetUserID != tokenUserID {
		return errors.New("permission denied: users can only update their own profile")
	}

	user, err := usersRepo.GetUserByID(targetUserID)
	if err != nil {
		return errors.New("user not found")
	}

	if !user.IsActive {
		return errors.New("user is not active")
	}

	if updateRequest.Name != nil {
		user.Name = *updateRequest.Name
	}
	if updateRequest.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*updateRequest.Password), bcrypt.DefaultCost)
		if err != nil {
			return errors.New("error hashing password")
		}
		user.Password = string(hashedPassword)
	}
	if updateRequest.Department != nil {
		user.Department = *updateRequest.Department
	}

	if err = usersRepo.UpdateUser(user); err != nil {
		return errors.New("error updating user")
	}

	return nil
}
