package usecases

import (
	"context"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
	"github.com/google/uuid"
)

// ImportSteelArrivals importa chegada de aços
func (uc *importUsecase) ImportSteelArrivals(ctx context.Context, dtos []contracts.ImportSteelArrivalDTO) error {
	for _, dto := range dtos {
		a := &models.ChegadaAcos{
			ID:            helpers.DerefStringPtr(dto.ID, uuid.NewString()),
			MoldeCodigo:   dto.MoldeCodigo,
			ComponentesID: dto.ComponentesID,
			Type:          helpers.DerefString(dto.Type),
			Quantity:      helpers.DerefInt(dto.Quantity),
			ArrivalDate:   helpers.DerefTime(dto.ArrivalDate),
			Supplier:      helpers.DerefString(dto.Supplier),
			IsArrived:     dto.IsArrived != nil && *dto.IsArrived,
			IsActive:      helpers.DerefBool(dto.IsActive, true),
		}
		if err := uc.materialsRepo.Save(a); err != nil {
			return err
		}
	}
	return nil
}
