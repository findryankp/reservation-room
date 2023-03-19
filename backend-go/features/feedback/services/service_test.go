package services

import (
	"errors"
	"groupproject3-airbnb-api/features/feedback"
	"groupproject3-airbnb-api/helper"
	"groupproject3-airbnb-api/mocks"
	"testing"

	"github.com/golang-jwt/jwt"
	"github.com/stretchr/testify/assert"
)

func TestCreate(t *testing.T) {
	repo := mocks.NewFeedbackData(t)

	inputData := feedback.Core{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}
	srv := New(repo)
	resData := feedback.Core{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}
	t.Run("success add feedback", func(t *testing.T) {
		repo.On("Create", uint(1), uint(1), inputData).Return(resData, nil).Once()

		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Create(pToken, uint(1), inputData)
		assert.Nil(t, err)
		assert.Equal(t, resData.ID, res.ID)
		repo.AssertExpectations(t)
	})
	t.Run("data not found", func(t *testing.T) {
		repo.On("Create", uint(1), uint(1), inputData).Return(feedback.Core{}, errors.New("data not found")).Once()
		// srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Create(pToken, uint(1), inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "not found")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

	t.Run("server problem", func(t *testing.T) {
		repo.On("Create", uint(1), uint(1), inputData).Return(feedback.Core{}, errors.New("server problem")).Once()
		// srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Create(pToken, uint(1), inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

}

func TestGetUserFeedback(t *testing.T) {
	repo := mocks.NewFeedbackData(t)

	resData := []feedback.Core{{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}}

	t.Run("success get user feedback", func(t *testing.T) {
		repo.On("GetUserFeedback", uint(1)).Return(resData, nil).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.GetUserFeedback(pToken)
		assert.Nil(t, err)
		assert.Equal(t, len(resData), len(res))
		repo.AssertExpectations(t)

	})

	t.Run("problem with server", func(t *testing.T) {
		repo.On("GetUserFeedback", uint(1)).Return([]feedback.Core{}, errors.New("query error, problem with server")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.GetUserFeedback(pToken)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.NotEqual(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

}

func TestGetByID(t *testing.T) {
	repo := mocks.NewFeedbackData(t)

	resData := feedback.Core{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}

	t.Run("success get feedback details", func(t *testing.T) {
		repo.On("GetByID", uint(1), uint(1)).Return(resData, nil).Once()

		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.GetByID(pToken, uint(1))
		assert.Nil(t, err)
		assert.Equal(t, resData.ID, res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("data not found", func(t *testing.T) {
		repo.On("GetByID", uint(1), uint(1)).Return(feedback.Core{}, errors.New("data not found")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.GetByID(pToken, uint(1))
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "not found")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

	t.Run("server problem", func(t *testing.T) {
		repo.On("GetByID", uint(1), uint(1)).Return(feedback.Core{}, errors.New("server problem")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.GetByID(pToken, uint(1))
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

}

func TestUpdate(t *testing.T) {
	repo := mocks.NewFeedbackData(t)

	inputData := feedback.Core{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}
	resData := feedback.Core{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}

	t.Run("success update feedback", func(t *testing.T) {
		repo.On("Update", uint(1), uint(1), inputData).Return(resData, nil).Once()

		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, uint(1), inputData)
		assert.Nil(t, err)
		assert.Equal(t, resData.ID, res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("data not found", func(t *testing.T) {
		repo.On("Update", uint(1), uint(1), inputData).Return(feedback.Core{}, errors.New("data not found")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, uint(1), inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "not found")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})
	//s
	t.Run("server problem", func(t *testing.T) {
		repo.On("Update", uint(1), uint(1), inputData).Return(feedback.Core{}, errors.New("server problem")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, uint(1), inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Equal(t, feedback.Core{}, res)
		repo.AssertExpectations(t)
	})
}

func TestGetFeedbackByRoomId(t *testing.T) {
	repo := mocks.NewFeedbackData(t)
	srv := New(repo)
	resData := []feedback.Core{{ID: 1, RoomID: 1, Rating: 3, Feedback: "nyaman"}}

	t.Run("success get feedback by room id", func(t *testing.T) {
		repo.On("SelectFeedbackByRoomId", uint(1)).Return(resData, nil).Once()

		res, err := srv.GetFeedbackByRoomId(uint(1))
		assert.Nil(t, err)
		assert.Equal(t, len(resData), len(res))
		repo.AssertExpectations(t)

	})

	t.Run("server problem", func(t *testing.T) {
		repo.On("SelectFeedbackByRoomId", uint(1)).Return([]feedback.Core{}, errors.New("server problem")).Once()
		res, err := srv.GetFeedbackByRoomId(uint(1))
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Equal(t, []feedback.Core{}, res)
		repo.AssertExpectations(t)
	})

}
