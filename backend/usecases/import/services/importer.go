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

		for id, qty := range countByID {
			dtos = append(dtos, contracts.ImportComponentDTO{
				ID:          id,
				MoldeCodigo: moldeCode,
				Name:        helpers.StringPointer(descByID[id]),
				Quantity:    helpers.IntPointer(qty),
			})
		}
	}
	return dtos, nil
}

// ParseSteelArrivals importa a planilha "CHEGADA AÇOS"
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
			continue
		}
		comp := helpers.GetCellValue(row, idx, "REFERÊNCIA")
		qty, _ := strconv.Atoi(helpers.GetCellValue(row, idx, "QUANTIDADE"))
		// Ignora moldes sem aba específica
		if _, err := f.GetSheetIndex("M" + molde); err != nil {
			continue
		}
		dtos = append(dtos, contracts.ImportSteelArrivalDTO{
			MoldeCodigo:   molde,
			ComponentesID: comp,
			Quantity:      helpers.IntPointer(qty),
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
		sheetIdx, err := f.GetSheetIndex("M" + molde)
		if molde == "" || err != nil || sheetIdx == 0 {
			continue
		}
		comp := helpers.GetCellValue(row, idx, "REFERÊNCIA")
		dtos = append(dtos, contracts.ImportProgrammingDTO{
			MoldeCodigo:  molde,
			ComponenteID: helpers.StringPointer(comp),
			Programmer:   helpers.StringPointer(helpers.GetCellValue(row, idx, "PROGRAMADOR")),
		})
	}
	return dtos, nil
}
