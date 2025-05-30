package usecases

import (
	"context"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
)

func (uc *importUsecase) ImportMolds(ctx context.Context, dtos []contracts.ImportMoldDTO) error {
	for _, dto := range dtos {
		m := &models.Moldes{
			Codigo:       dto.Codigo,
			Description:  helpers.DerefString(dto.Description),
			Status:       helpers.DerefStatus(dto.Status, models.StatusNaoIniciado),
			Steps:        0,
			CurrentStep:  0,
			BeginDate:    helpers.DerefTime(dto.BeginDate),
			DeliveryDate: helpers.DerefTime(dto.DeliveryDate),
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
			IsActive:     helpers.DerefBool(dto.IsActive, true),
		}
		if err := uc.moldsRepo.Save(m); err != nil {
			return err
		}
	}
	return nil
}
