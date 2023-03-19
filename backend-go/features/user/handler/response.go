package handler

import (
	"errors"
	"groupproject3-airbnb-api/features/user"
)

type UserResponse struct {
	ID    uint   `json:"id,omitempty"`
	Name  string `json:"name,omitempty"`
	Email string `json:"email,omitempty"`
	Role  string `json:"role,omitempty"`
}

func ToResponse(data user.Core) UserResponse {
	return UserResponse{
		ID:    data.ID,
		Name:  data.Name,
		Email: data.Email,
		Role:  data.Role,
	}
}

type ApproveResponse struct {
	Role string `json:"role"`
}

func ToApproveResponse(data user.Core) ApproveResponse {
	return ApproveResponse{
		Role: data.Role,
	}
}

type ProfileResponse struct {
	ID             uint   `json:"id"`
	ProfilePicture string `json:"profile_picture"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	Phone          string `json:"phone"`
	Address        string `json:"address"`
	Role           string `json:"role"`
}

func ToProfileResponse(data user.Core) ProfileResponse {
	return ProfileResponse{
		ID:             data.ID,
		ProfilePicture: data.ProfilePicture,
		Name:           data.Name,
		Email:          data.Email,
		Phone:          data.Phone,
		Address:        data.Address,
		Role:           data.Role,
	}
}

func ConvertUpdateResponse(input user.Core) (interface{}, error) {
	ResponseFilter := user.Core{}
	ResponseFilter = input
	result := make(map[string]interface{})
	if ResponseFilter.ID != 0 {
		result["id"] = ResponseFilter.ID
	}
	if ResponseFilter.ProfilePicture != "" {
		result["profile_picture"] = ResponseFilter.ProfilePicture
	}
	if ResponseFilter.Name != "" {
		result["name"] = ResponseFilter.Name
	}
	if ResponseFilter.Email != "" {
		result["email"] = ResponseFilter.Email
	}
	if ResponseFilter.Phone != "" {
		result["phone"] = ResponseFilter.Phone
	}
	if ResponseFilter.Address != "" {
		result["address"] = ResponseFilter.Address
	}
	if ResponseFilter.Password != "" {
		result["password"] = ResponseFilter.Password
	}

	if len(result) <= 1 {
		return user.Core{}, errors.New("no data was change")
	}
	return result, nil
}
