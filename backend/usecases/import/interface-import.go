package usecases

import (
	"context"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
	componentsrepo "github.com/Gustavoss150/simoldes-backend/repositories/components_repository"
	materialsrepo "github.com/Gustavoss150/simoldes-backend/repositories/materials_repository"
	moldsrepo "github.com/Gustavoss150/simoldes-backend/repositories/moldes_repository"
	processrepo "github.com/Gustavoss150/simoldes-backend/repositories/processes_repository"
)

// ImportUsecase define operações de importação em lote para diferentes recursos.
type ImportUsecase interface {
	ImportMolds(ctx context.Context, dtos []contracts.ImportMoldDTO) error
	ImportComponents(ctx context.Context, dtos []contracts.ImportComponentDTO) error
	ImportProcesses(ctx context.Context, dtos []contracts.ImportProcessDTO) error
	ImportSteelArrivals(ctx context.Context, dtos []contracts.ImportSteelArrivalDTO) error
	ImportProgrammings(ctx context.Context, dtos []contracts.ImportProgrammingDTO) error
}

// importUsecase implementa ImportUsecase
type importUsecase struct {
	moldsRepo      moldsrepo.MoldsRepository
	componentsRepo componentsrepo.ComponentsRepository
	processRepo    processrepo.ProcessRepository
	materialsRepo  materialsrepo.MaterialsRepository
	cncRepo        cncrepo.CNCRepository
}

// NewImportUsecase cria uma instância de ImportUsecase com as dependências injetadas
func NewImportUsecase(
	mRepo moldsrepo.MoldsRepository,
	cRepo componentsrepo.ComponentsRepository,
	pRepo processrepo.ProcessRepository,
	matsRepo materialsrepo.MaterialsRepository,
	cncRepo cncrepo.CNCRepository,
) ImportUsecase {
	return &importUsecase{
		moldsRepo:      mRepo,
		componentsRepo: cRepo,
		processRepo:    pRepo,
		materialsRepo:  matsRepo,
		cncRepo:        cncRepo,
	}
}
