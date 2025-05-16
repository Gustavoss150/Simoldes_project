package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/models"
	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
)

func CreateMach(cncRepo cncrepo.CNCRepository, mach models.Maquinas) error {
	exists, err := cncRepo.GetMachByID(mach.ID)
	if err == nil && exists != nil {
		return errors.New("machine with this ID already exists")
	}

	if err := cncRepo.SaveMach(&mach); err != nil {
		return errors.New("error registering machine " + err.Error())
	}
	return nil
}

func CreateProgramming(cncRepo cncrepo.CNCRepository, scriptCNC models.Programacoes, moldCode string) error {
	exists, err := cncRepo.GetProgrammingByID(scriptCNC.ID)
	if err == nil && exists != nil {
		return errors.New("CNC programming with this ID already exists")
	}

	isValid, err := cncRepo.ValidateProcessWithMold(scriptCNC.ProcessID, moldCode)
	if err != nil {
		return errors.New("error validating process association with mold: " + err.Error())
	}
	if !isValid {
		return errors.New("component is not associated with the specified mold")
	}

	isValidComp, err := cncRepo.ValidateProcessWithComponent(scriptCNC.ProcessID, scriptCNC.ComponenteID)
	if err != nil {
		return errors.New("error validating process association with component")
	}
	if !isValidComp {
		return errors.New("process is not associated with the specified component")
	}

	if err := cncRepo.SaveProgramming(&scriptCNC); err != nil {
		return errors.New("error registering CNC programming " + err.Error())
	}
	return nil
}
