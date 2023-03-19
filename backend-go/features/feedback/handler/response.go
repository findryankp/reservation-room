package handler

import (
	"errors"
	"groupproject3-airbnb-api/features/feedback"
)

type FeedbackResponse struct {
	ID                 uint    `json:"id,omitempty"`
	RoomID             uint    `json:"room_id,omitempty"`
	ReservationID      uint    `json:"reservation_id,omitempty"`
	Rating             float64 `json:"rating,omitempty"`
	Feedback           string  `json:"feedback,omitempty"`
	UserName           string  `json:"user_name,omitempty"`
	UserProfilePicture string  `json:"user_profile_picture,omitempty"`
}

func ToFeedbackResponse(data feedback.Core) FeedbackResponse {
	return FeedbackResponse{
		ID:                 data.ID,
		RoomID:             data.RoomID,
		Rating:             data.Rating,
		Feedback:           data.Feedback,
		ReservationID:      data.ReservationID,
		UserName:           data.UserName,
		UserProfilePicture: data.UserProfilePicture,
	}
}

func GetFeedbackResp(data []feedback.Core) []FeedbackResponse {
	res := []FeedbackResponse{}
	for _, v := range data {
		res = append(res, ToFeedbackResponse(v))
	}
	return res
}

func ConvertUpdateResponse(input feedback.Core) (interface{}, error) {
	ResponseFilter := feedback.Core{}
	ResponseFilter = input
	result := make(map[string]interface{})
	if ResponseFilter.ID != 0 {
		result["id"] = ResponseFilter.ID
	}
	if ResponseFilter.RoomID != 0 {
		result["room_id"] = ResponseFilter.RoomID
	}
	if ResponseFilter.Rating != 0 {
		result["rating"] = ResponseFilter.Rating
	}
	if ResponseFilter.Feedback != "" {
		result["feedback"] = ResponseFilter.Feedback
	}
	if len(result) <= 1 {
		return feedback.Core{}, errors.New("no data was change")
	}
	return result, nil
}
