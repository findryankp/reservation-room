package data

import (
	"groupproject3-airbnb-api/features/user"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name           string
	ProfilePicture string
	Email          string
	Password       string
	Phone          string
	Address        string
	Role           string
	Approvement    string
}

func ToCore(data User) user.Core {
	return user.Core{
		ID:             data.ID,
		ProfilePicture: data.ProfilePicture,
		Name:           data.Name,
		Email:          data.Email,
		Phone:          data.Phone,
		Address:        data.Address,
		Password:       data.Password,
		Role:           data.Role,
		Approvement:    data.Approvement,
	}
}

func CoreToData(data user.Core) User {
	return User{
		Model:          gorm.Model{ID: data.ID},
		ProfilePicture: data.ProfilePicture,
		Name:           data.Name,
		Email:          data.Email,
		Phone:          data.Phone,
		Address:        data.Address,
		Password:       data.Password,
		Role:           data.Role,
		Approvement:    data.Approvement,
	}
}
