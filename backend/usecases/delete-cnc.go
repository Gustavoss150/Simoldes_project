package usecases

import (
	"errors"

	cncrepo "github.com/Gustavoss150/simoldes-backend/repositories/cnc_repository"
)

func SoftDeleteMach(cncRepo cncrepo.CNCRepository, machID string) error {
	mach, err := cncRepo.GetMachByID(machID)
	if err != nil || mach == nil {
		return errors.New("machine not found")
	}

	if !mach.IsActive {
		return errors.New("machine is already inactive")
	}

	mach.IsActive = false
	return cncRepo.SaveMach(mach)
}

func SoftDeleteCNCProgramming(cncRepo cncrepo.CNCRepository, scriptID string) error {
	prog, err := cncRepo.GetProgrammingByID(scriptID)
	if err != nil || prog == nil {
		return errors.New("CNC programming not found")
	}

	if !prog.IsActive {
		return errors.New("CNC programming is already inactive")
	}

	prog.IsActive = false
	return cncRepo.SaveProgramming(prog)
}
