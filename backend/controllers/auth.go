package controllers

import (
	"fmt"
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
	usersrepo "github.com/Gustavoss150/simoldes-backend/repositories/users_repository"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating password hash"})
		return
	}
	user.Password = string(hashedPassword)

	usersRepo, err := usersrepo.InitUsersDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing user database"})
		return
	}

	if err := usecases.CreateUser(usersRepo, user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func LoginUser(c *gin.Context) {
	var req contracts.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("Erro ao vincular dados JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	registration := req.Registration
	if registration == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Registration number is required"})
		return
	}

	usersRepo, err := usersrepo.InitUsersDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing user database"})
		return
	}

	token, err := usecases.Login(usersRepo, req.Registration, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("jwt_token", token, 7200, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"token": token})
}
