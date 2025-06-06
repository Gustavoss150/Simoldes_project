package usecases

import (
	"github.com/Gustavoss150/simoldes-backend/models"
	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
)

func ListMach(cncRepo cncrepo.CNCRepository, mach string) ([]*models.Maquinas, error) {
	return cncRepo.GetAllMachs()
}

func ListProgrammingByMold(cncRepo cncrepo.CNCRepository, moldCode string) ([]*models.Programacoes, error) {
	return cncRepo.GetProgrammingByMold(moldCode)
}

func ListProgrammingByComponent(cncRepo cncrepo.CNCRepository, comp string) ([]*models.Programacoes, error) {
	return cncRepo.GetProgrammingByComponent(comp)
}
