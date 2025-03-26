package middleware

import (
	"net/http"

	auth "github.com/Gustavoss150/simoldes-backend/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		if tokenString == "" {
			tokenString, _ = c.Cookie("jwt_token")
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token not found"})
			c.Abort()
			return
		}

		claims, err := auth.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}
