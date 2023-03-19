package data

import (
	"groupproject3-airbnb-api/features/feedback"

	"gorm.io/gorm"
)

type Feedback struct {
	gorm.Model
	UserID             uint
	ReservationID      uint
	RoomID             uint
	Rating             float64
	Feedback           string
	User               User
	UserName           string
	UserProfilePicture string
}

type Room struct {
	gorm.Model
	RoomName string
	UserID   uint
	Rating   float64
	Feedback string
}

type User struct {
	gorm.Model
	Name    string
	Email   string
	Phone   string
	Address string
}

// func DataToCore(data Feedback) feedback.Core {
// 	return feedback.Core{
// 		ID:            data.ID,
// 		UserID:        data.UserID,
// 		ReservationID: data.ReservationID,
// 		RoomID:        data.RoomID,
// 		Rating:        data.Rating,
// 		Feedback:      data.Feedback,
// 	}
// }

func DataToCore(data Feedback) feedback.Core {
	return feedback.Core{
		ID:                 data.ID,
		ReservationID:      data.ReservationID,
		RoomID:             data.RoomID,
		Rating:             data.Rating,
		Feedback:           data.Feedback,
		UserName:           data.UserName,
		UserProfilePicture: data.UserProfilePicture,
		User: feedback.User{
			ID:      data.User.ID,
			Name:    data.User.Name,
			Email:   data.User.Email,
			Phone:   data.User.Phone,
			Address: data.User.Address,
		},
	}
}

func ListDataToDataCore(feedback []Feedback) (feedbackCore []feedback.Core) {
	for _, v := range feedback {
		feedbackCore = append(feedbackCore, DataToCore(v))
	}
	return feedbackCore
}

func CoreToData(data feedback.Core) Feedback {
	return Feedback{
		Model:         gorm.Model{ID: data.ID},
		ReservationID: data.ReservationID,
		RoomID:        data.RoomID,
		Rating:        data.Rating,
		Feedback:      data.Feedback,
	}
}
