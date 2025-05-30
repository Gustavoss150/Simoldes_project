package usecases

import (
	"context"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
	"github.com/google/uuid"
)

// ImportProgrammings importa programações CNC
func (uc *importUsecase) ImportProgrammings(ctx context.Context, dtos []contracts.ImportProgrammingDTO) error {
	for _, dto := range dtos {
		p := &models.Programacoes{
			ID:           helpers.DerefStringPtr(dto.ID, uuid.NewString()),
			MoldeCodigo:  dto.MoldeCodigo,
			ProcessID:    helpers.DerefString(dto.ProcessID),
			ComponenteID: helpers.DerefString(dto.ComponenteID),
			MaquinaID:    helpers.DerefString(dto.MaquinaID),
			Description:  "",
			Programmer:   helpers.DerefString(dto.Programmer),
			Script:       helpers.DerefString(dto.Script),
			CreatedAt: func() time.Time {
				if dto.CreatedAt != nil {
					return *dto.CreatedAt
				}
				return time.Now()
			}(),
			UpdatedAt: time.Now(),
			IsActive:  helpers.DerefBool(dto.IsActive, true),
		}
		if err := uc.cncRepo.SaveProgramming(p); err != nil {
			return err
		}
	}
	return nil
}
