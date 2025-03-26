package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/models/contracts"
	"github.com/Gustavoss150/simoldes-backend/models/entities"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(c *gin.Context) {
	var user entities.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}

	user.Password = string(hashedPassword)

	if err := usecases.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func LoginUser(c *gin.Context) {
	var req contracts.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	token, err := usecases.Login(req.Registration, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("jwt_token", token, 7200, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"token": token})
}
