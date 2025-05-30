package helpers

import (
	"time"

	"github.com/Gustavoss150/simoldes-backend/models"
)

// helpers genéricos que lidam com ponteiros e valores padrão quando o ponteiro é nil

func DerefString(ptr *string) string {
	if ptr != nil {
		return *ptr
	}
	return ""
}

func DerefStringPtr(ptr *string, def string) string {
	if ptr != nil {
		return *ptr
	}
	return def
}

func DerefInt(ptr *int) int {
	if ptr != nil {
		return *ptr
	}
	return 0
}

func DerefBool(ptr *bool, def bool) bool {
	if ptr != nil {
		return *ptr
	}
	return def
}

func DerefStatus(ptr *models.ProcessStatus, def models.ProcessStatus) models.ProcessStatus {
	if ptr != nil {
		return *ptr
	}
	return def
}

func DerefTime(ptr *time.Time) time.Time {
	if ptr != nil {
		return *ptr
	}
	return time.Time{}
}
