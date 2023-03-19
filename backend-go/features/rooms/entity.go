package rooms

import (
	"groupproject3-airbnb-api/features/user"
	"mime/multipart"
)

type RoomEntity struct {
	Id          uint
	UserId      uint
	User        user.Core
	RoomName    string  `validate:"required"`
	RoomPicture string  `json:"room_picture"`
	Price       int     `validate:"required"`
	Description string  `validate:"required"`
	Latitude    float64 `validate:"required"`
	Longitude   float64 `validate:"required"`
	Address     string  `validate:"required"`
	Rating      float64
}

type RoomFilter struct {
	PriceMin  int
	PriceMax  int
	DateStart string
	DateEnd   string
	Rating    float64
}

type RoomServiceInterface interface {
	GetAll() ([]RoomEntity, error)
	GetById(id uint) (RoomEntity, error)
	GetByUserId(userId, userIdLogin uint) ([]RoomEntity, error)
	Create(roomEntity RoomEntity, userId uint, fileData multipart.FileHeader) (RoomEntity, error)
	Update(roomEntity RoomEntity, id, userId uint, fileData multipart.FileHeader) (RoomEntity, error)
	Delete(id, userId uint) error
	GetAllFilter(roomFilter RoomFilter) ([]RoomEntity, error)
}

type RoomDataInterface interface {
	SelectAll() ([]RoomEntity, error)
	SelectById(id uint) (RoomEntity, error)
	SelectByUserId(user_id uint) ([]RoomEntity, error)
	Store(roomEntity RoomEntity, userId uint) (uint, error)
	Edit(roomEntity RoomEntity, id uint) error
	Destroy(id uint) error
	SelectAllFilter(roomFilter RoomFilter) ([]RoomEntity, error)
}
