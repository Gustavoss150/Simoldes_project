package controllers

import (
	"net/http"

	"github.com/Gustavoss150/simoldes-backend/usecases"
	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {
	var req struct {
		Registration int    `json:"registration"`
		Password     string `json:"password"`
	}

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
