package data

import (
	"groupproject3-airbnb-api/features/reservations"

	"gorm.io/gorm"
)

type query struct {
	db *gorm.DB
}

func New(db *gorm.DB) reservations.ReservationDataInterface {
	return &query{
		db: db,
	}
}
func (q *query) SelectById(id uint) (reservations.ReservationEntity, error) {
	var reservation Reservation
	if err := q.db.Preload("User").Preload("Room").First(&reservation, id); err.Error != nil {
		return reservations.ReservationEntity{}, err.Error
	}
	return ReservationToReservationEntity(reservation), nil
}

func (q *query) Edit(reservationEntity reservations.ReservationEntity, id uint) error {
	class := ReservationEntityToReservation(reservationEntity)
	if err := q.db.Where("id", id).Updates(&class); err.Error != nil {
		return err.Error
	}
	return nil
}

func (q *query) SelectyReservation(userId uint) ([]reservations.ReservationEntity, error) {
	var reservations []Reservation
	err := q.db.Preload("User").Preload("Room").
		Select("reservations.*,feedbacks.rating as feedback_rating,feedbacks.id as feedback_id").
		Joins("left join feedbacks ON feedbacks.reservation_id = reservations.id").
		Where("reservations.user_id = ?", userId).
		Find(&reservations)
	if err.Error != nil {
		return nil, err.Error
	}
	return ListReservationToReservationEntity(reservations), nil
}

func (q *query) SelectyRoomAndDateRange(reservationEntity reservations.ReservationEntity) ([]reservations.ReservationEntity, error) {
	var reservations []Reservation
	err := q.db.Where("room_id = ? AND (date_start BETWEEN ? AND ? OR date_end BETWEEN ? AND ?)", reservationEntity.RoomId, reservationEntity.DateStart, reservationEntity.DateEnd, reservationEntity.DateStart, reservationEntity.DateEnd).
		Find(&reservations)
	if err.Error != nil {
		return nil, err.Error
	}
	return ListReservationToReservationEntity(reservations), nil
}

// Store implements reservations.ReservationDataInterface
func (q *query) Store(reservationEntity reservations.ReservationEntity) (uint, error) {
	reservation := ReservationEntityToReservation(reservationEntity)
	if err := q.db.Create(&reservation); err.Error != nil {
		return 0, err.Error
	}
	return reservation.ID, nil
}

func (q *query) SelectByRoomId(roomId uint) ([]reservations.ReservationEntity, error) {
	var reservations []Reservation
	err := q.db.Preload("Room").Where("room_id = ?", roomId).Find(&reservations)
	if err.Error != nil {
		return nil, err.Error
	}
	return ListReservationToReservationEntity(reservations), nil
}
