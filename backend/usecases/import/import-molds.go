package usecases

import (
	"context"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
)

const defaultDeliveryDays = 30

func (uc *importUsecase) ImportMolds(ctx context.Context, dtos []contracts.ImportMoldDTO) error {
	for _, dto := range dtos {
		now := time.Now()

		m := &models.Moldes{
			Codigo:      dto.Codigo,
			Description: helpers.DerefString(dto.Description),
			Status:      helpers.DerefStatus(dto.Status, models.StatusNaoIniciado),
			Steps:       0,
			CurrentStep: 0,
			CreatedAt:   now,
			UpdatedAt:   now,
			IsActive:    helpers.DerefBool(dto.IsActive, true),
		}

		// Se a planilha trouxe BeginDate, use-a; senão, agora
		if dto.BeginDate != nil {
			m.BeginDate = *dto.BeginDate
		} else {
			m.BeginDate = now
		}

		// Se a planilha trouxe DeliveryDate, use-a; senão, Set default = BeginDate + 30
		if dto.DeliveryDate != nil {
			m.DeliveryDate = *dto.DeliveryDate
		} else {
			m.DeliveryDate = m.BeginDate.AddDate(0, 0, defaultDeliveryDays)
		}

		if err := uc.moldsRepo.Save(m); err != nil {
			return err
		}
	}
	return nil
}
