package helpers

import (
	"strings"
	"time"
)

func MapColIndex(header []string) map[string]int {
	idx := make(map[string]int)
	for i, h := range header {
		idx[strings.ToUpper(strings.TrimSpace(h))] = i
	}
	return idx
}

func GetCellValue(row []string, idx map[string]int, colHeader string) string {
	if position, exists := idx[strings.ToUpper(colHeader)]; exists && position < len(row) {
		return strings.TrimSpace(row[position])
	}
	return ""
}

// StringPointer retorna um ponteiro para a string fornecida
func StringPointer(s string) *string {
	return &s
}

func IntPointer(i int) *int {
	return &i
}

func BoolPointer(b bool) *bool {
	return &b
}

func TimePointer(t time.Time) *time.Time {
	return &t
}
