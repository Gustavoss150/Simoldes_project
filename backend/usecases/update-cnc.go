package usecases

import (
	"errors"

	"github.com/Gustavoss150/simoldes-backend/contracts"
	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
)

func UpdateMach(cncRepo cncrepo.CNCRepository, req contracts.UpdateMach, machID string) error {
	mach, err := cncRepo.GetMachByID(machID)
	if err != nil || mach == nil {
		return errors.New("machine not found")
	}

	if req.Name != nil {
		mach.Name = *req.Name
	}
	if req.Description != nil {
		mach.Description = *req.Description
	}
	if req.Type != nil {
		mach.Type = *req.Type
	}
	if req.Department != nil {
		mach.Department = *req.Department
	}

	if err = cncRepo.SaveMach(mach); err != nil {
		return errors.New("error updating machine")
	}

	return nil
}

func UpdateProgramming(cncRepo cncrepo.CNCRepository, req contracts.UpdateCNCProgramming, scriptID string) error {
	prog, err := cncRepo.GetProgrammingByID(scriptID)
	if err != nil || prog == nil {
		return errors.New("programming id not found")
	}

	if req.MaquinaID != nil {
		prog.MaquinaID = *req.MaquinaID
	}
	if req.StepID != nil {
		prog.StepID = *req.StepID
	}
	if req.Description != nil {
		prog.Description = *req.Description
	}
	if req.Programmer != nil {
		prog.Programmer = *req.Programmer
	}
	if req.Script != nil {
		prog.Script = *req.Script
	}

	if err = cncRepo.SaveProgramming(prog); err != nil {
		return errors.New("error updating programming info")
	}

	return nil
}
