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
	existsProg, err := cncRepo.GetProgrammingByID(scriptCNC.ID)
	if err == nil && existsProg != nil {
		return errors.New("CNC programming with this ID already exists")
	}

	//  Se o usuário especificou um ProcessID, valide a associação ao molde
	if scriptCNC.ProcessID != nil {
		isValid, err := cncRepo.ValidateProcessWithMold(*scriptCNC.ProcessID, moldCode)
		if err != nil {
			return errors.New("error validating process association with mold: " + err.Error())
		}
		if !isValid {
			return errors.New("process is not associated with the specified mold")
		}

		// 3) Ainda que ProcessID seja válido para o molde, verifique componente x processo
		isValidComp, err := cncRepo.ValidateProcessWithComponent(*scriptCNC.ProcessID, scriptCNC.ComponenteID)
		if err != nil {
			return errors.New("error validating process association with component: " + err.Error())
		}
		if !isValidComp {
			return errors.New("process is not associated with the specified component")
		}
	}

	// Salva no repositório (GORM inspecciona todos os campos e insere NULL onde os ponteiros forem nil)
	if err := cncRepo.SaveProgramming(&scriptCNC); err != nil {
		return errors.New("error registering CNC programming: " + err.Error())
	}
	return nil
}
