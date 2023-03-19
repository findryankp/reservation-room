package handler

import "groupproject3-airbnb-api/features/reservations"

type ReservationRequest struct {
	UserId     uint   `json:"user_id" form:"user_id"`
	RoomId     uint   `json:"room_id" form:"room_id"`
	DateStart  string `json:"date_start" form:"date_start"`
	DateEnd    string `json:"date_end" form:"date_end"`
	TotalPrice int    `json:"total_price" form:"total_price"`
}

func ReservationRequestToReservationEntity(reservationRequest *ReservationRequest) reservations.ReservationEntity {
	return reservations.ReservationEntity{
		UserId:     reservationRequest.UserId,
		RoomId:     reservationRequest.RoomId,
		DateStart:  reservationRequest.DateStart,
		DateEnd:    reservationRequest.DateEnd,
		TotalPrice: reservationRequest.TotalPrice,
	}
}
