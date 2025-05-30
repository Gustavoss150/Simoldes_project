package controllers

import (
	"bytes"
	"io"
	"net/http"

	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
	usecases "github.com/Gustavoss150/simoldes-backend/usecases/import"
	"github.com/Gustavoss150/simoldes-backend/usecases/import/services"
	"github.com/gin-gonic/gin"
)

func ImportAll(c *gin.Context) {
	// 1. Upload e buffer do arquivo
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}
	f, _ := file.Open()
	defer f.Close()

	// Carrega tudo num buffer para poder dar Seek
	buff := new(bytes.Buffer)
	if _, err := io.Copy(buff, f); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read file"})
		return
	}
	reader := bytes.NewReader(buff.Bytes())

	moldsRepo, err := moldsrepo.InitMoldsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing molds database: " + err.Error()})
		return
	}
	componentsRepo, err := componentsrepo.InitComponentsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing components database: " + err.Error()})
		return
	}
	processRepo, err := processrepo.InitProcessDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing processes database: " + err.Error()})
		return
	}
	materialsRepo, err := materialsrepo.InitMaterialsDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing materials database: " + err.Error()})
		return
	}
	cncRepo, err := cncrepo.InitCNCDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error initializing CNC database: " + err.Error()})
		return
	}

	// 2. Instanciar serviço e usecase (injete seus repositórios reais aqui)
	excelSvc := services.NewExcelImportService()
	importUC := usecases.NewImportUsecase(moldsRepo, componentsRepo, processRepo, materialsRepo, cncRepo)

	// 3. Parsers (sempre resetar o reader)
	molds, err := excelSvc.ParseMolds(reader)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parse molds failed"})
		return
	}
	reader.Seek(0, io.SeekStart)

	components, err := excelSvc.ParseComponents(reader)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parse components failed"})
		return
	}
	reader.Seek(0, io.SeekStart)

	steelArrivals, err := excelSvc.ParseSteelArrivals(reader)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parse steel arrivals failed"})
		return
	}
	reader.Seek(0, io.SeekStart)

	programmings, err := excelSvc.ParseProgrammings(reader)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parse programmings failed"})
		return
	}
	reader.Seek(0, io.SeekStart)

	// 4. Importação pelos usecases
	if err := importUC.ImportMolds(c.Request.Context(), molds); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "import molds failed"})
		return
	}
	if err := importUC.ImportComponents(c.Request.Context(), components); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "import components failed"})
		return
	}
	if err := importUC.ImportSteelArrivals(c.Request.Context(), steelArrivals); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "import steel arrivals failed"})
		return
	}
	if err := importUC.ImportProgrammings(c.Request.Context(), programmings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "import programmings failed"})
		return
	}

	// 5. Resposta ao cliente
	c.JSON(http.StatusOK, gin.H{
		"molds":          len(molds),
		"components":     len(components),
		"steel_arrivals": len(steelArrivals),
		"programmings":   len(programmings),
	})
}
