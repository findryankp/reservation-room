package service

import (
	"errors"
	"groupproject3-airbnb-api/features/reservations"
	"groupproject3-airbnb-api/helper"
	"strconv"

	"github.com/go-playground/validator/v10"
)

type ReservationService struct {
	Data     reservations.ReservationDataInterface
	validate *validator.Validate
}

func New(data reservations.ReservationDataInterface) reservations.ReservationServiceInterface {
	return &ReservationService{
		Data:     data,
		validate: validator.New(),
	}
}

func (s *ReservationService) GetById(id uint) (reservations.ReservationEntity, error) {
	return s.Data.SelectById(id)
}

func (s *ReservationService) Update(reservationEntity reservations.ReservationEntity, id uint) (reservations.ReservationEntity, error) {
	if checkDataExist, err := s.Data.SelectById(id); err != nil {
		return checkDataExist, err
	}

	err := s.Data.Edit(reservationEntity, id)
	if err != nil {
		return reservations.ReservationEntity{}, err
	}
	return s.Data.SelectById(id)
}

func (s *ReservationService) CheckAvailability(reservationEntity reservations.ReservationEntity) (bool, error) {
	s.validate = validator.New()
	errValidate := s.validate.StructExcept(reservationEntity, "User", "Room")
	if errValidate != nil {
		return false, errValidate
	}

	dateStart, checkDateStart := helper.IsDate(reservationEntity.DateStart)
	if !checkDateStart {
		return false, errors.New("not valid date start. format date, ex : 2006-02-25")
	}

	dateEnd, checkDateEnd := helper.IsDate(reservationEntity.DateEnd)
	if !checkDateEnd {
		return false, errors.New("not valid date end. format date, ex : 2006-02-25")
	}

	if helper.FormatDate(dateEnd).Before(helper.FormatDate(dateStart)) {
		return false, errors.New("error range of date, date end must be after date start")
	}

	data, err := s.Data.SelectyRoomAndDateRange(reservationEntity)
	if err != nil {
		return false, err
	}

	if len(data) > 0 {
		return false, errors.New("date not available")
	}

	return true, nil
}

func (s *ReservationService) Create(reservationEntity reservations.ReservationEntity) (reservations.ReservationEntity, error) {
	s.validate = validator.New()
	errValidate := s.validate.StructExcept(reservationEntity, "User", "Room")
	if errValidate != nil {
		return reservations.ReservationEntity{}, errValidate
	}

	dateStart, checkDateStart := helper.IsDate(reservationEntity.DateStart)
	if !checkDateStart {
		return reservations.ReservationEntity{}, errors.New("not valid date start format date, ex : 2006-02-25")
	}

	dateEnd, checkDateEnd := helper.IsDate(reservationEntity.DateEnd)
	if !checkDateEnd {
		return reservations.ReservationEntity{}, errors.New("not valid date graduate format date, ex : 2006-02-25")
	}

	if helper.FormatDate(dateEnd).Before(helper.FormatDate(dateStart)) {
		return reservations.ReservationEntity{}, errors.New("error range of date, date end must be after date start")
	}

	reservationId, err := s.Data.Store(reservationEntity)
	if err != nil {
		return reservations.ReservationEntity{}, err
	}

	duration := helper.CountRangeDate(dateStart, dateEnd)
	totalPrice := reservationEntity.TotalPrice

	//call midtrans
	postData := map[string]any{
		"order_id":  "alta-" + strconv.Itoa(int(reservationId)),
		"nominal":   totalPrice,
		"firstname": "Alta",
		"lastname":  "Room",
		"email":     "email" + strconv.Itoa(int(reservationId)) + "@gmail.com",
		"phone":     "000",
	}

	paymentLink, err1 := helper.PostMidtrans(postData)
	if err1 != nil {
		return reservations.ReservationEntity{}, err
	} else {
		//midtrans
		update := reservations.ReservationEntity{
			Duration:          duration,
			TotalPrice:        totalPrice,
			StatusReservation: "pending",
			PaymentLink:       paymentLink,
		}
		//if ok
		s.Data.Edit(update, reservationId)
	}

	return s.Data.SelectById(reservationId)
}

func (s *ReservationService) GetReservation(userId uint) ([]reservations.ReservationEntity, error) {
	return s.Data.SelectyReservation(uint(userId))
}

func (s *ReservationService) GetByRoomId(roomId uint) ([]reservations.ReservationEntity, error) {
	return s.Data.SelectByRoomId(uint(roomId))
}

func (s *ReservationService) CallBackMidtrans(id uint, status string) error {
	reservations := reservations.ReservationEntity{
		StatusReservation: status,
	}
	err := s.Data.Edit(reservations, id)
	if err != nil {
		return err
	}
	return nil
}
