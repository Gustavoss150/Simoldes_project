package services

import (
	"fmt"
	"io"
	"regexp"
	"strconv"
	"strings"

	"github.com/xuri/excelize/v2"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
)

var moldSheetPattern = regexp.MustCompile(`^M\d+$`)

// ExcelImportService faz parsing de planilhas Excel de importação
type ExcelImportService struct{}

// NewExcelImportService cria nova instância do serviço de importação de Excel
func NewExcelImportService() *ExcelImportService {
	return &ExcelImportService{}
}

// em services/excel_import_service.go

// ParseMolds detecta todas as abas “M<codigo>” e cria um DTO mínimo
func (s *ExcelImportService) ParseMolds(r io.Reader) ([]contracts.ImportMoldDTO, error) {
	f, err := excelize.OpenReader(r)
	if err != nil {
		return nil, fmt.Errorf("erro abrindo excel: %w", err)
	}
	defer f.Close()

	var dtos []contracts.ImportMoldDTO
	for _, name := range f.GetSheetList() {
		if moldSheetPattern.MatchString(name) {
			code := strings.TrimPrefix(name, "M")
			dtos = append(dtos, contracts.ImportMoldDTO{
				Codigo: code,
				// todos os outros campos nil (opcional), serão defaultizados no usecase
			})
		}
	}
	return dtos, nil
}

// ParseComponents agrupa as abas de moldes específicos (MXXXX) em componentes
func (s *ExcelImportService) ParseComponents(r io.Reader) ([]contracts.ImportComponentDTO, error) {
	f, err := excelize.OpenReader(r)
	if err != nil {
		return nil, fmt.Errorf("erro abrindo excel: %w", err)
	}
	defer f.Close()

	var dtos []contracts.ImportComponentDTO
	sheets := f.GetSheetList()
	for _, name := range sheets {
		if !moldSheetPattern.MatchString(name) {
			continue
		}
		moldeCode := strings.TrimPrefix(name, "M")

		rows, err := f.GetRows(name)
		if err != nil {
			continue
		}
		idx := helpers.MapColIndex(rows[0])

		// Contabiliza quantidade por Item
		countByID := make(map[string]int)
		descByID := make(map[string]string)
		for _, row := range rows[1:] {
			itemID := helpers.GetCellValue(row, idx, "Item")
			desc := helpers.GetCellValue(row, idx, "Descrição")
			if itemID == "" {
				continue
			}
			countByID[itemID]++
			descByID[itemID] = desc
		}

		for rawID, qty := range countByID {
			// Criamos um ID único por molde+item
			compositeID := fmt.Sprintf("%s - %s", moldeCode, rawID)

			dtos = append(dtos, contracts.ImportComponentDTO{
				ID:          compositeID,
				MoldeCodigo: moldeCode,
				Name:        helpers.StringPointer(descByID[rawID]),
				Quantity:    helpers.IntPointer(qty),
			})
		}
	}
	return dtos, nil
}

func (s *ExcelImportService) ParseSteelArrivals(r io.Reader) ([]contracts.ImportSteelArrivalDTO, error) {
	f, err := excelize.OpenReader(r)
	if err != nil {
		return nil, fmt.Errorf("erro abrindo excel: %w", err)
	}
	defer f.Close()

	rows, err := f.GetRows("CHEGADA AÇOS")
	if err != nil {
		return nil, fmt.Errorf("aba CHEGADA AÇOS não encontrada")
	}
	idx := helpers.MapColIndex(rows[0])

	var dtos []contracts.ImportSteelArrivalDTO
	for _, row := range rows[1:] {
		molde := helpers.GetCellValue(row, idx, "MOLDE")
		if molde == "" {
			continue // pula linhas sem MOLDE
		}

		rawID := helpers.GetCellValue(row, idx, "REFERÊNCIA")
		if rawID == "" {
			continue // pula linhas sem REFERÊNCIA
		}

		// 1) ComponentesID = "<molde> - <rawID>"
		componentID := fmt.Sprintf("%s - %s", molde, rawID)

		// 2) prefix será usado no usecase para gerar o sufixo incremental,
		prefix := fmt.Sprintf("%s - %s - ", molde, rawID)
		// ex.: "1679 - 700 - "

		qty, _ := strconv.Atoi(helpers.GetCellValue(row, idx, "QUANTIDADE"))

		if _, err := f.GetSheetIndex("M" + molde); err != nil {
			continue
		}

		dtos = append(dtos, contracts.ImportSteelArrivalDTO{
			// ID = prefix; no usecase, faremos CountByIDPrefix(prefix) → "prefix + índice"
			ID:            &prefix,
			MoldeCodigo:   molde,
			ComponentesID: componentID,
			Type:          helpers.StringPointer(helpers.GetCellValue(row, idx, "TIPO")),
			Quantity:      helpers.IntPointer(qty),
			ArrivalDate:   nil,
			Supplier:      helpers.StringPointer(helpers.GetCellValue(row, idx, "FORNECEDOR")),
			IsArrived:     nil,
			IsActive:      nil,
		})
	}
	return dtos, nil
}

// ParseProgrammings importa a aba "PROGRAMAÇÃO"
func (s *ExcelImportService) ParseProgrammings(r io.Reader) ([]contracts.ImportProgrammingDTO, error) {
	f, err := excelize.OpenReader(r)
	if err != nil {
		return nil, fmt.Errorf("erro abrindo excel: %w", err)
	}
	defer f.Close()

	rows, err := f.GetRows("PROGRAMAÇÃO")
	if err != nil {
		return nil, fmt.Errorf("aba PROGRAMAÇÃO não encontrada")
	}
	idx := helpers.MapColIndex(rows[0])
	var dtos []contracts.ImportProgrammingDTO
	for _, row := range rows[1:] {
		molde := helpers.GetCellValue(row, idx, "MOLDE")
		if molde == "" {
			continue
		}
		if _, err := f.GetSheetIndex("M" + molde); err != nil {
			continue
		}

		rawID := helpers.GetCellValue(row, idx, "REFERENCIA")
		if rawID == "" {
			continue
		}

		// 1) ComponentesID = "<molde> - <rawID>"
		componentID := fmt.Sprintf("%s - %s", molde, rawID)

		// 2) prefix para programação (será completado no usecase com CountByIDPrefix)
		prefix := fmt.Sprintf("%s - %s - ", molde, rawID)
		// ex.: "1679 - 700 - "

		dtos = append(dtos, contracts.ImportProgrammingDTO{
			ID:           &prefix,
			MoldeCodigo:  molde,
			ComponenteID: &componentID,
			Programmer:   helpers.StringPointer(helpers.GetCellValue(row, idx, "PROGRAMADOR")),
			CreatedAt:    nil,
			MaquinaID:    nil,
			Script:       nil,
			IsActive:     nil,
			ProcessID:    nil,
		})
	}
	return dtos, nil
}
