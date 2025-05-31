package usecases

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
)

const defaultSteelDays = 30

func (uc *importUsecase) ImportSteelArrivals(
	ctx context.Context,
	dtos []contracts.ImportSteelArrivalDTO,
) error {
	for _, dto := range dtos {
		componentID := dto.ComponentesID
		existsComp, err := uc.componentsRepo.ExistsByID(componentID)
		if err != nil {
			return fmt.Errorf("erro ao verificar componente %q: %w", componentID, err)
		}
		if !existsComp {
			// Tenta sem o molde: pega a parte após " - "
			parts := strings.SplitN(componentID, "-", 2)
			var rawOnly string
			if len(parts) == 2 {
				rawOnly = strings.TrimSpace(parts[1]) // ex: "700"
			} else {
				rawOnly = componentID
			}
			existsComp, err = uc.componentsRepo.ExistsByID(rawOnly)
			if err != nil {
				return fmt.Errorf("erro ao verificar componente raw %q: %w", rawOnly, err)
			}
			if existsComp {
				dto.ComponentesID = rawOnly // passa a usar "700"
				componentID = rawOnly
			} else {
				continue
			}
		}

		prefix := helpers.DerefString(dto.ID)
		if prefix == "" {
			// Se não veio prefixo (algo inesperado), construímos manualmente:
			prefix = fmt.Sprintf("%s - %s - ", dto.MoldeCodigo, componentID)
		}

		// Contar quantos já existem com esse prefixo
		count, err := uc.materialsRepo.CountByIDPrefix(prefix)
		if err != nil {
			return fmt.Errorf("erro ao contar chegadas de aço com prefixo %q: %w", prefix, err)
		}
		nextIndex := count + 1

		// Montar ID final completo
		arrivalID := fmt.Sprintf("%s%d", prefix, nextIndex)

		var arrivalDate time.Time
		if dto.ArrivalDate != nil {
			arrivalDate = *dto.ArrivalDate
		} else {
			arrivalDate = time.Now().AddDate(0, 0, defaultSteelDays)
		}

		aco := &models.ChegadaAcos{
			ID:            arrivalID,
			MoldeCodigo:   dto.MoldeCodigo,
			ComponentesID: dto.ComponentesID,
			Type:          helpers.DerefString(dto.Type),
			Quantity:      helpers.DerefInt(dto.Quantity),
			ArrivalDate:   arrivalDate,
			Supplier:      helpers.DerefString(dto.Supplier),
			IsArrived:     dto.IsArrived != nil && *dto.IsArrived,
			IsActive:      helpers.DerefBool(dto.IsActive, true),
		}

		if err := uc.materialsRepo.Save(aco); err != nil {
			return fmt.Errorf("erro ao salvar chegada de aço %q: %w", aco.ID, err)
		}
	}
	return nil
}
