package data

import (
	"errors"
	"groupproject3-airbnb-api/features/feedback"
	"log"

	"gorm.io/gorm"
)

type feedbackQuery struct {
	db *gorm.DB
}

func New(db *gorm.DB) feedback.FeedbackData {
	return &feedbackQuery{
		db: db,
	}
}

func (fq *feedbackQuery) Create(userID uint, roomID uint, newFeedback feedback.Core) (feedback.Core, error) {
	room := Room{}

	err := fq.db.Where("id=?", roomID).First(&room).Error
	if err != nil {
		log.Println("query error", err.Error())
		return feedback.Core{}, errors.New("server error")
	}

	cnv := CoreToData(newFeedback)
	cnv.RoomID = room.ID
	cnv.UserID = userID
	err = fq.db.Create(&cnv).Error
	if err != nil {
		log.Println("query error", err.Error())
		return feedback.Core{}, errors.New("server error")
	}
	result := DataToCore(cnv)
	return result, nil
}

func (fq *feedbackQuery) GetUserFeedback(userID uint) ([]feedback.Core, error) {
	res := []Feedback{}
	err := fq.db.Where("user_id = ?", userID).Find(&res).Error

	if err != nil {
		log.Println("query error", err.Error())
		return []feedback.Core{}, errors.New("server error")
	}

	result := []feedback.Core{}
	for i := 0; i < len(res); i++ {
		result = append(result, DataToCore(res[i]))
		room := Room{}
		err = fq.db.Where("id = ?", res[i].RoomID).First(&room).Error
		if err != nil {
			log.Println("query error", err.Error())
			return []feedback.Core{}, errors.New("server error")
		}
		user := User{}
		err = fq.db.Where("id = ?", room.UserID).First(&user).Error
		if err != nil {
			log.Println("query error", err.Error())
			return []feedback.Core{}, errors.New("server error")
		}
	}
	return result, nil

}

func (fq *feedbackQuery) GetByID(userID uint, feedbackID uint) (feedback.Core, error) {
	res := Feedback{}
	if err := fq.db.Where("id = ?", feedbackID).First(&res).Error; err != nil {
		log.Println("get feedback detail query error : ", err.Error())
		return feedback.Core{}, errors.New("get feedback detail query error")
	}
	result := DataToCore(res)
	user := User{}
	if err := fq.db.Where("id = ?", res.UserID).First(&user).Error; err != nil {
		log.Println("get user by id query error : ", err.Error())
		return feedback.Core{}, errors.New("get user by id error")
	}

	return result, nil
}

func (fq *feedbackQuery) Update(userID uint, feedBackID uint, updatedFeedback feedback.Core) (feedback.Core, error) {
	cnv := CoreToData(updatedFeedback)
	cnv.ID = uint(feedBackID)

	qry := fq.db.Where("id = ?", feedBackID).Updates(&cnv)
	affrows := qry.RowsAffected
	if affrows == 0 {
		log.Println("no rows affected")
		return feedback.Core{}, errors.New("no data updated")
	}
	err := qry.Error
	if err != nil {
		log.Println("update feedback query error", err.Error())
		return feedback.Core{}, errors.New("user not found")
	}
	return updatedFeedback, nil
}

func (fq *feedbackQuery) SelectFeedbackByRoomId(roomId uint) ([]feedback.Core, error) {
	var feedbacks []Feedback
	err := fq.db.Where("room_id = ?", roomId).
		Select("feedbacks.*,users.name as user_name,users.profile_picture as user_profile_picture").
		Joins("inner join users ON users.id = feedbacks.user_id").
		Find(&feedbacks).Error

	if err != nil {
		log.Println("query error", err.Error())
		return []feedback.Core{}, errors.New("server error")
	}
	return ListDataToDataCore(feedbacks), nil

}
