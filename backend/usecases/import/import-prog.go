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

// import-prog.go

func (uc *importUsecase) ImportProgrammings(
	ctx context.Context,
	dtos []contracts.ImportProgrammingDTO,
) error {
	for _, dto := range dtos {
		// 1) Verifica ComponenteID em ambas as formas:
		rawIDPtr := helpers.DerefString(dto.ComponenteID) // ex: "1679 - 700" ou "700"
		if rawIDPtr == "" {
			log.Printf("ComponenteID vazio para molde %q\n", dto.MoldeCodigo)
			continue
		}

		existsComp, err := uc.componentsRepo.ExistsByID(rawIDPtr)
		if err != nil {
			return fmt.Errorf("erro ao verificar componente (original) %q: %w", rawIDPtr, err)
		}
		if !existsComp {
			// Tenta reconstruir a partir do molde + sufixo:
			parts := strings.Split(rawIDPtr, " - ")
			if len(parts) == 2 {
				rawOnly := strings.TrimSpace(parts[1])
				rawWithMolde := fmt.Sprintf("%s - %s", dto.MoldeCodigo, rawOnly)

				existsComp, err = uc.componentsRepo.ExistsByID(rawWithMolde)
				if err != nil {
					return fmt.Errorf("erro ao verificar componente (reconstruído) %q: %w", rawWithMolde, err)
				}
				if existsComp {
					dto.ComponenteID = &rawWithMolde
				} else {
					// 1.2) Tenta apenas o raw puro “700”
					existsComp, err = uc.componentsRepo.ExistsByID(rawOnly)
					if err != nil {
						return fmt.Errorf("erro ao verificar componente (só sufixo) %q: %w", rawOnly, err)
					}
					if existsComp {
						dto.ComponenteID = &rawOnly
					} else {
						log.Printf("Componente não encontrado: %q, %q ou %q\n", rawIDPtr, rawWithMolde, rawOnly)
						continue
					}
				}
			} else {
				log.Printf("Formato inesperado de ComponenteID: %q\n", rawIDPtr)
				continue
			}
		}

		// 2) Gera o prefixo (por exemplo, "1679 - 700 - ")
		prefix := helpers.DerefString(dto.ID)
		if prefix == "" {
			prefix = fmt.Sprintf("%s - %s - ",
				dto.MoldeCodigo,
				strings.TrimPrefix(helpers.DerefString(dto.ComponenteID), fmt.Sprintf("%s - ", dto.MoldeCodigo)),
			)
		}

		// 3) Conta quantas já existem com esse prefixo
		count, err := uc.cncRepo.CountByIDPrefix(prefix)
		if err != nil {
			return fmt.Errorf("erro ao contar programações com prefixo %q: %w", prefix, err)
		}
		nextIndex := count + 1

		// Monta o ID final completo
		programmingID := fmt.Sprintf("%s%d", prefix, nextIndex)
		p := &models.Programacoes{
			ID:           programmingID,
			MoldeCodigo:  dto.MoldeCodigo,
			ProcessID:    dto.ProcessID,
			ComponenteID: helpers.DerefString(dto.ComponenteID),
			MaquinaID:    dto.MaquinaID,
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
