package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/models"
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

	if err := usecases.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error saving user"})
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

	log.Printf("Tentando login com registration: %d e password: %s", req.Registration, req.Password)

	token, err := usecases.Login(req.Registration, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("jwt_token", token, 7200, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"token": token})
}
