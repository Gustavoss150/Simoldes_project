package controllers

import (
	"net/http"
	"strconv"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	usersrepo "github.com/Gustavoss150/simoldes-backend/repositories/users_repository"
	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
)

func UpdateUser(c *gin.Context) {
	// Recupera o valor de "userID" do contexto, que já é um int
	tokenUserIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userID not found in token"})
		return
	}

	tokenUserID, ok := tokenUserIDInterface.(int)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token userID"})
		return
	}

	// ID do usuário a ser atualizado (da URL)
	targetUserID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid target userID"})
		return
	}

	userRole := c.GetString("role") // role obtido do middleware

	var updateRequest contracts.UpdateUserRequest
	if err := c.ShouldBindJSON(&updateRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	usersRepo, err := usersrepo.InitUsersDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize repository"})
		return
	}

	err = usecases.UpdateUser(usersRepo, updateRequest, targetUserID, tokenUserID, userRole)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}
