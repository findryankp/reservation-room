package service

// import (
// 	"errors"
// 	"groupproject3-airbnb-api/features/rooms"
// 	"groupproject3-airbnb-api/mocks"
// 	"log"
// 	"mime/multipart"
// 	"os"
// 	"path/filepath"
// 	"testing"

// 	"github.com/stretchr/testify/assert"
// 	"github.com/stretchr/testify/mock"
// )

// func TestCreate(t *testing.T) {
// 	repo := mocks.NewRoomDataInterface(t)
// 	// srv := New(repo)
// 	filePath := filepath.Join("..", "..", "..", "Group2_ERD.jpg")
// 	imageTrue, err := os.Open(filePath)
// 	if err != nil {
// 		log.Println(err.Error())
// 	}
// 	imageTrueCnv := &multipart.FileHeader{
// 		Filename: imageTrue.Name(),
// 	}
// 	roomID := uint(1)

// 	inputData := rooms.RoomEntity{Id: 0, RoomName: "Villa", Price: 20000, Description: "kamar adem"}
// 	t.Run("success ceate room", func(t *testing.T) {
// 		repo.On("Store", inputData, uint(1)).Return(roomID, nil).Once()
// 		srv := New(repo)
// 		res, err := srv.Create(inputData, uint(1), *imageTrueCnv)
// 		repo.AssertExpectations(t)
// 		assert.NotNil(t, err)
// 		assert.NotEqual(t, roomID, res.Id)

// 	})

// 	// t.Run("invalid validation", func(t *testing.T) {
// 	// 	wrongInput := user.Core{Name: "Alif%&*", Password: "123a#$%"}
// 	// 	// repo.On("Register", uint(1), mock.Anything).Return(user.Core{}, errors.New("email duplicated")).Once()
// 	// 	srv := New(repo)
// 	// 	err := srv.Register(wrongInput)
// 	// 	assert.ErrorContains(t, err, "validate")
// 	// 	repo.AssertExpectations(t)

// 	// })

// 	// t.Run("Duplicated", func(t *testing.T) {
// 	// 	repo.On("Register", mock.Anything).Return(errors.New("duplicated")).Once()
// 	// 	srv := New(repo)
// 	// 	err := srv.Register(inputData)
// 	// 	assert.NotNil(t, err)
// 	// 	assert.ErrorContains(t, err, "email already registered")
// 	// 	repo.AssertExpectations(t)
// 	// })

// 	// t.Run("internal server error", func(t *testing.T) {
// 	// 	repo.On("Register", mock.Anything).Return(errors.New("There is a problem with the server")).Once()
// 	// 	srv := New(repo)
// 	// 	err := srv.Register(inputData)
// 	// 	assert.NotNil(t, err)
// 	// 	assert.ErrorContains(t, err, "server")
// 	// 	repo.AssertExpectations(t)
// 	// })
// }

// func TestGetAll(t *testing.T) {
// 	repo := mocks.NewRoomDataInterface(t)

// 	resData := []rooms.RoomEntity{{Id: 0, RoomName: "Villa", Price: 20000, Description: "kamar adem"}}
// 	t.Run("success get all room", func(t *testing.T) {
// 		repo.On("SelectAll").Return(resData, nil).Once()
// 		srv := New(repo)
// 		res, err := srv.GetAll()
// 		assert.Nil(t, err)
// 		assert.Equal(t, len(resData), len(res))
// 		repo.AssertExpectations(t)

// 	})
// }

// func TestGetById(t *testing.T) {
// 	repo := mocks.NewRoomDataInterface(t)

// 	resData := rooms.RoomEntity{Id: 0, RoomName: "Villa", Price: 20000, Description: "kamar adem"}
// 	t.Run("success get all room", func(t *testing.T) {
// 		repo.On("SelectById", uint(1)).Return(resData, nil).Once()
// 		srv := New(repo)
// 		res, err := srv.GetById(uint(1))
// 		assert.Nil(t, err)
// 		assert.Equal(t, resData.Id, res.Id)
// 		repo.AssertExpectations(t)

// 	})
// }

// func TestGetByUserId(t *testing.T) {
// 	repo := mocks.NewRoomDataInterface(t)

// 	resData := []rooms.RoomEntity{{Id: 0, RoomName: "Villa", Price: 20000, Description: "kamar adem"}}
// 	t.Run("success get all room", func(t *testing.T) {
// 		repo.On("SelectByUserId", uint(1)).Return(resData, nil).Once()
// 		srv := New(repo)
// 		res, err := srv.GetByUserId(uint(1), uint(1))
// 		assert.Nil(t, err)
// 		assert.Equal(t, len(resData), len(res))
// 		repo.AssertExpectations(t)

// 	})

// 	t.Run("not allowed to access this user id", func(t *testing.T) {
// 		repo.On("SelectByUserId", uint(1)).Return([]rooms.RoomEntity{}, errors.New("not allowed to access this user id")).Once()
// 		srv := New(repo)
// 		res, err := srv.GetByUserId(uint(1), uint(1))
// 		assert.NotNil(t, err)
// 		assert.ErrorContains(t, err, "not allowed")
// 		assert.Equal(t, 0, len(res))
// 		repo.AssertExpectations(t)

// 	})
// }

// func TestDelete(t *testing.T) {
// 	repo := mocks.NewRoomDataInterface(t)

// 	t.Run("success delete rooms", func(t *testing.T) {
// 		repo.On("Destroy", mock.Anything).Return(nil).Once()
// 		srv := New(repo)
// 		err := srv.Delete(uint(1), uint(1))
// 		assert.Nil(t, err)
// 		repo.AssertExpectations(t)

// 	})

// 	t.Run("not allowed to access this Id", func(t *testing.T) {
// 		repo.On("Destroy", mock.Anything).Return(errors.New("not allowed to access this Id")).Once()

// 		srv := New(repo)
// 		err := srv.Delete(uint(1), uint(1))
// 		assert.NotNil(t, err)
// 		assert.ErrorContains(t, err, "not allowed")
// 		repo.AssertExpectations(t)
// 	})
// }
