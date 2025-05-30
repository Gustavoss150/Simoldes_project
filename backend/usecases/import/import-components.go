package usecases

import (
	"context"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
)

func (uc *importUsecase) ImportComponents(ctx context.Context, dtos []contracts.ImportComponentDTO) error {
	var list []*models.Componentes
	for _, dto := range dtos {
		c := &models.Componentes{
			ID:             dto.ID,
			MoldeCodigo:    dto.MoldeCodigo,
			Name:           helpers.DerefString(dto.Name),
			Material:       helpers.DerefString(dto.Material),
			Quantity:       helpers.DerefInt(dto.Quantity),
			Status:         false,
			Archive3DModel: helpers.DerefString(dto.Archive3DModel),
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
			IsActive:       helpers.DerefBool(dto.IsActive, true),
		}
		list = append(list, c)
	}
	return uc.componentsRepo.SaveMany(list)
}
