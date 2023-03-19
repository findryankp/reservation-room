package data

import (
	"groupproject3-airbnb-api/features/reservations"
	room "groupproject3-airbnb-api/features/rooms"
	roomData "groupproject3-airbnb-api/features/rooms/data"
	user "groupproject3-airbnb-api/features/user"
	userData "groupproject3-airbnb-api/features/user/data"
	"reflect"

	"gorm.io/gorm"
)

type Reservation struct {
	gorm.Model
	UserId            uint
	User              userData.User `gorm:"foreignKey:UserId"`
	RoomId            uint
	Room              roomData.Room `gorm:"foreignKey:RoomId"`
	DateStart         string
	DateEnd           string
	Duration          int
	TotalPrice        int
	StatusReservation string
	PaymentLink       string
	FeedbackId        uint
	FeedbackRating    float64
}

func ReservationEntityToReservation(reservationEntity reservations.ReservationEntity) Reservation {
	return Reservation{
		UserId:            reservationEntity.UserId,
		RoomId:            reservationEntity.RoomId,
		DateStart:         reservationEntity.DateStart,
		DateEnd:           reservationEntity.DateEnd,
		Duration:          reservationEntity.Duration,
		TotalPrice:        reservationEntity.TotalPrice,
		StatusReservation: reservationEntity.StatusReservation,
		PaymentLink:       reservationEntity.PaymentLink,
		FeedbackRating:    reservationEntity.FeedbackRating,
		FeedbackId:        reservationEntity.FeedbackId,
	}
}

func ReservationToReservationEntity(reservation Reservation) reservations.ReservationEntity {
	result := reservations.ReservationEntity{
		Id:                reservation.ID,
		UserId:            reservation.UserId,
		RoomId:            reservation.RoomId,
		DateStart:         reservation.DateStart,
		DateEnd:           reservation.DateEnd,
		Duration:          reservation.Duration,
		TotalPrice:        reservation.TotalPrice,
		StatusReservation: reservation.StatusReservation,
		PaymentLink:       reservation.PaymentLink,
		FeedbackId:        reservation.FeedbackId,
		FeedbackRating:    reservation.FeedbackRating,
	}

	if !reflect.ValueOf(reservation.User).IsZero() {
		result.User = user.Core{
			Name: reservation.User.Name,
		}
	}

	if !reflect.ValueOf(reservation.Room).IsZero() {
		result.Room = room.RoomEntity{
			RoomName: reservation.Room.RoomName,
		}
	}
	return result
}

func ListReservationToReservationEntity(reservation []Reservation) []reservations.ReservationEntity {
	var reservationsEntity []reservations.ReservationEntity
	for _, v := range reservation {
		reservationsEntity = append(reservationsEntity, ReservationToReservationEntity(v))
	}
	return reservationsEntity
}
