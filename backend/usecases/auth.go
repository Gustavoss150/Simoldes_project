package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	usersrepo "github.com/Gustavoss150/simoldes-backend/repositories/users_repository"
	auth "github.com/Gustavoss150/simoldes-backend/utils"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(usersRepo usersrepo.UsersRepository, user models.User) error {
	if _, err := usersRepo.GetUserByRegistration(user.Registration); err == nil {
		return errors.New("user with this registration already exists")
	}

	if err := usersRepo.SaveUser(&user); err != nil {
		return errors.New("error registering user " + err.Error())
	}
	return nil
}

func Login(usersRepo usersrepo.UsersRepository, registration int, password string) (string, error) {
	user, err := usersRepo.GetUserByRegistration(registration)
	if err != nil {
		return "", errors.New("error getting user by registration " + err.Error())
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
