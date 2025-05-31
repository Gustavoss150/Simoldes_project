package usecases

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	"github.com/Gustavoss150/simoldes-backend/helpers"
	"github.com/Gustavoss150/simoldes-backend/models"
)

func (uc *importUsecase) ImportProgrammings(
	ctx context.Context,
	dtos []contracts.ImportProgrammingDTO,
) error {
	for _, dto := range dtos {
		rawIDPtr := helpers.DerefString(dto.ComponenteID)
		if rawIDPtr == "" {
			log.Printf("ComponenteID vazio para molde %q\n", dto.MoldeCodigo)
			continue
		}

		existsComp, err := uc.componentsRepo.ExistsByID(rawIDPtr)
		if err != nil {
			return fmt.Errorf("erro ao verificar componente (original): %w", err)
		}

		if !existsComp {
			// Tenta reconstruir a partir do molde + sufixo
			parts := strings.Split(rawIDPtr, " - ")
			if len(parts) == 2 {
				rawOnly := strings.TrimSpace(parts[1])
				rawWithMolde := fmt.Sprintf("%s - %s", dto.MoldeCodigo, rawOnly)

				existsComp, err = uc.componentsRepo.ExistsByID(rawWithMolde)
				if err != nil {
					return fmt.Errorf("erro ao verificar componente (reconstruído): %w", err)
				}
				if existsComp {
					dto.ComponenteID = &rawWithMolde
				} else {
					existsComp, err = uc.componentsRepo.ExistsByID(rawOnly)
					if err != nil {
						return fmt.Errorf("erro ao verificar componente (só sufixo): %w", err)
					}
					if existsComp {
						dto.ComponenteID = &rawOnly
					} else {
						log.Printf("Componente não encontrado: %q, %q ou %q\n", rawIDPtr, rawWithMolde, rawOnly)
						continue
					}
				}
			} else {
				log.Printf("Formato inesperado de ID: %q\n", rawIDPtr)
				continue
			}
		}

		prefix := helpers.DerefString(dto.ID)
		if prefix == "" {
			prefix = fmt.Sprintf("%s - %s - ", dto.MoldeCodigo, strings.TrimPrefix(rawIDPtr, fmt.Sprintf("%s - ", dto.MoldeCodigo)))
		}

		// Conta quantas programações já existem com esse prefixo
		count, err := uc.cncRepo.CountByIDPrefix(prefix)
		if err != nil {
			return fmt.Errorf("erro ao contar programações com prefixo %q: %w", prefix, err)
		}
		nextIndex := count + 1
		programmingID := fmt.Sprintf("%s%d", prefix, nextIndex)

		p := &models.Programacoes{
			ID:           programmingID,
			MoldeCodigo:  dto.MoldeCodigo,
			ProcessID:    helpers.DerefString(dto.ProcessID),
			ComponenteID: helpers.DerefString(dto.ComponenteID),
			MaquinaID:    helpers.DerefString(dto.MaquinaID),
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
			return fmt.Errorf("erro ao salvar programação %q: %w", p.ID, err)
		}
	}
	return nil
}
