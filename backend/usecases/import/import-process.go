package usecases

import (
	"context"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
	"github.com/google/uuid"
)

func (uc *importUsecase) ImportProcesses(ctx context.Context, dtos []contracts.ImportProcessDTO) error {
	for _, dto := range dtos {
		pr := &models.Processos{
			ID:            helpers.DerefStringPtr(dto.ID, uuid.NewString()),
			MoldeCodigo:   dto.MoldeCodigo,
			ComponentesID: helpers.DerefString(dto.ComponentesID),
			Description:   helpers.DerefString(dto.Notes),
			StepID:        helpers.DerefString(dto.StepID),
			Status:        helpers.DerefStatus(dto.Status, models.StatusNaoIniciado),
			MaquinaID:     helpers.DerefString(dto.MaquinaID),
			BeginDate:     helpers.DerefTime(dto.BeginDate),
			DeliveryDate:  helpers.DerefTime(dto.DeliveryDate),
			Notes:         helpers.DerefString(dto.Notes),
			Order:         helpers.DerefInt(dto.Order),
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
			IsActive:      helpers.DerefBool(dto.IsActive, true),
		}
		if err := uc.processRepo.SaveProcess(pr); err != nil {
			return err
		}
	}
	return nil
}
