package utils

import (
	"math/rand"
	"time"
)

var characters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

func GenerateID(length int) string {
	rand.Seed(time.Now().UnixNano())
	id := make([]rune, length)
	for i := range id {
		id[i] = characters[rand.Intn(len(characters))]
	}
	return string(id)
}
