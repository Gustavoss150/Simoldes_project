package contracts

import "time"

type UpdateMaterialRequest struct {
	Type        *string    `json:"type"`
	Quantity    *int       `json:"quantity"`
	ArrivalDate *time.Time `json:"arrival_date"`
	IsArrived   *bool      `json:"is_arrived"`
	Supplier    *string    `json:"supplier"`
}
