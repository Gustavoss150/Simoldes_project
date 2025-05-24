package controllers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/gin-gonic/gin"
)

func Upload3DModel(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received"})
		return
	}
	defer file.Close()

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), header.Filename)
	outPath := path.Join("static", "models3d", filename)
	outFile, err := os.Create(outPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save file"})
		return
	}
	defer outFile.Close()
	io.Copy(outFile, file)

	// 3. Retorne a URL pública (supondo que /static/ esteja servindo arquivos)
	url := fmt.Sprintf("/static/models3d/%s", filename)
	c.JSON(http.StatusCreated, gin.H{"url": url})
}

func UploadNC(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file received"})
		return
	}
	defer file.Close()

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), header.Filename)
	outPath := path.Join("static", "scripts", filename)
	outFile, err := os.Create(outPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save file"})
		return
	}
	defer outFile.Close()
	io.Copy(outFile, file)

	url := fmt.Sprintf("/static/scripts/%s", filename)
	c.JSON(http.StatusCreated, gin.H{"url": url})
}
