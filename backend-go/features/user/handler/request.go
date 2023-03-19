package handler

import (
	"groupproject3-airbnb-api/features/user"
	"mime/multipart"
)

type RegisterRequest struct {
	Name       string `json:"name" form:"name"`
	Email      string `json:"email" form:"email"`
	Password   string `json:"password" form:"password"`
	Phone      string `json:"phone" form:"phone"`
	Address    string `json:"address" form:"address"`
	FileHeader multipart.FileHeader
}

type LoginRequest struct {
	Email    string `json:"email" form:"email"`
	Password string `json:"password" form:"password"`
}

type ApproveRequest struct {
	Approvement string `json:"approvement" form:"approvement"`
	Role        string `json:"role" form:"role"`
}

func ReqToCore(data interface{}) *user.Core {
	res := user.Core{}

	switch data.(type) {
	case RegisterRequest:
		cnv := data.(RegisterRequest)
		res.Name = cnv.Name
		res.Email = cnv.Email
		res.Password = cnv.Password
		res.Phone = cnv.Phone
		res.Address = cnv.Address
	case LoginRequest:
		cnv := data.(LoginRequest)
		res.Email = cnv.Email
		res.Password = cnv.Password
	case ApproveRequest:
		cnv := data.(ApproveRequest)
		res.Approvement = cnv.Approvement
		res.Role = cnv.Role
	default:
		return nil
	}

	return &res
}
