package reservations

import (
	"groupproject3-airbnb-api/features/rooms"
	"groupproject3-airbnb-api/features/user"
)

type ReservationEntity struct {
	Id                uint
	UserId            uint
	User              user.Core
	RoomId            uint `validate:"required"`
	Room              rooms.RoomEntity
	DateStart         string `validate:"required"`
	DateEnd           string `validate:"required"`
	Duration          int
	TotalPrice        int
	StatusReservation string
	PaymentLink       string
	FeedbackId        uint
	FeedbackRating    float64
}

type ReservationServiceInterface interface {
	GetReservation(userId uint) ([]ReservationEntity, error)
	CheckAvailability(reservationEntity ReservationEntity) (bool, error)
	Create(reservationEntity ReservationEntity) (ReservationEntity, error)

	GetById(id uint) (ReservationEntity, error)
	GetByRoomId(roomId uint) ([]ReservationEntity, error)
	Update(reservationEntity ReservationEntity, id uint) (ReservationEntity, error)
	CallBackMidtrans(id uint, status string) error
}

type ReservationDataInterface interface {
	SelectyReservation(userId uint) ([]ReservationEntity, error)
	SelectyRoomAndDateRange(reservationEntity ReservationEntity) ([]ReservationEntity, error)
	Store(reservationEntity ReservationEntity) (uint, error)

	SelectById(id uint) (ReservationEntity, error)
	SelectByRoomId(roomId uint) ([]ReservationEntity, error)
	Edit(reservationEntity ReservationEntity, id uint) error
}
