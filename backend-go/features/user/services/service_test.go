package services

import (
	"errors"
	"groupproject3-airbnb-api/features/user"
	"groupproject3-airbnb-api/helper"
	"groupproject3-airbnb-api/mocks"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"testing"

	"github.com/golang-jwt/jwt"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestRegister(t *testing.T) {
	repo := mocks.NewUserData(t)
	inputData := user.Core{Name: "Alif", Email: "alif@gmail.com", Phone: "081234"}
	t.Run("Success register", func(t *testing.T) {
		repo.On("Register", mock.Anything).Return(nil).Once()
		srv := New(repo)
		err := srv.Register(inputData)
		assert.Nil(t, err)
		repo.AssertExpectations(t)
	})

	t.Run("invalid validation", func(t *testing.T) {
		wrongInput := user.Core{Name: "Alif%&*", Password: "123a#$%"}
		// repo.On("Register", uint(1), mock.Anything).Return(user.Core{}, errors.New("email duplicated")).Once()
		srv := New(repo)
		err := srv.Register(wrongInput)
		assert.ErrorContains(t, err, "validate")
		repo.AssertExpectations(t)

	})

	t.Run("Duplicated", func(t *testing.T) {
		repo.On("Register", mock.Anything).Return(errors.New("duplicated")).Once()
		srv := New(repo)
		err := srv.Register(inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "email already registered")
		repo.AssertExpectations(t)
	})

	t.Run("internal server error", func(t *testing.T) {
		repo.On("Register", mock.Anything).Return(errors.New("There is a problem with the server")).Once()
		srv := New(repo)
		err := srv.Register(inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		repo.AssertExpectations(t)
	})
}

func TestLogin(t *testing.T) {
	repo := mocks.NewUserData(t)
	inputEmail := "alif@gmail.com"
	passwordHashed := helper.GeneratePassword("123")
	resData := user.Core{ID: uint(1), Name: "Alif", Email: "alif@gmail.com", Password: passwordHashed}

	t.Run("login success", func(t *testing.T) {
		repo.On("Login", inputEmail).Return(resData, nil).Once()
		srv := New(repo)
		token, res, err := srv.Login(inputEmail, "123")
		assert.Nil(t, err)
		assert.NotEmpty(t, token)
		assert.Equal(t, resData.Name, res.Name)
		repo.AssertExpectations(t)
	})

	t.Run("account not found", func(t *testing.T) {
		repo.On("Login", inputEmail).Return(user.Core{}, errors.New("data not found")).Once()
		srv := New(repo)
		token, res, err := srv.Login(inputEmail, "123")
		assert.NotNil(t, token)
		assert.ErrorContains(t, err, "not")
		assert.Empty(t, token)
		assert.Equal(t, uint(0), res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("password not matched", func(t *testing.T) {
		inputEmail := "alif@gmail.com"
		repo.On("Login", inputEmail).Return(resData, nil).Once()
		srv := New(repo)
		_, res, err := srv.Login(inputEmail, "342")
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "password")
		assert.Empty(t, nil)
		assert.Equal(t, uint(0), res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("server problem", func(t *testing.T) {
		inputEmail := "alif@gmail.com"
		repo.On("Login", inputEmail).Return(user.Core{}, errors.New("There is a problem with the server")).Once()

		srv := New(repo)
		token, res, err := srv.Login(inputEmail, "342")
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Empty(t, token)
		assert.Equal(t, user.Core{}, res)
		repo.AssertExpectations(t)
	})
}

func TestProfile(t *testing.T) {
	repo := mocks.NewUserData(t)
	resData := user.Core{ID: uint(1), Name: "Alif", Email: "alif@gmail.com", Phone: "081234"}

	t.Run("success show profile", func(t *testing.T) {
		repo.On("Profile", uint(1)).Return(resData, nil).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Profile(pToken)
		assert.Nil(t, err)
		assert.Equal(t, resData.ID, res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("account not found", func(t *testing.T) {
		repo.On("Profile", uint(1)).Return(user.Core{}, errors.New("query error, problem with server")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Profile(pToken)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "server")
		assert.Equal(t, user.Core{}, res)
		repo.AssertExpectations(t)
	})
}

func TestUpdate(t *testing.T) {
	repo := mocks.NewUserData(t)
	filePath := filepath.Join("..", "..", "..", "Group2_ERD.jpg")
	imageTrue, err := os.Open(filePath)
	if err != nil {
		log.Println(err.Error())
	}
	imageTrueCnv := &multipart.FileHeader{
		Filename: imageTrue.Name(),
	}

	inputData := user.Core{ID: 1, Name: "Alif", Phone: "08123"}
	resData := user.Core{ID: 1, Name: "Alif", Phone: "08123"}

	t.Run("success updating account", func(t *testing.T) {
		repo.On("Update", uint(1), mock.Anything).Return(resData, nil).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, *imageTrueCnv, inputData)
		assert.Nil(t, err)
		assert.Equal(t, resData.ID, res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("fail updating account", func(t *testing.T) {
		repo.On("Update", uint(1), mock.Anything).Return(user.Core{}, errors.New("user not found")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, *imageTrueCnv, inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "not registered")
		assert.Equal(t, user.Core{}, res)
		repo.AssertExpectations(t)
	})
	t.Run("email duplicated", func(t *testing.T) {
		repo.On("Update", uint(1), mock.Anything).Return(user.Core{}, errors.New("email duplicated")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, *imageTrueCnv, inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "email duplicated")
		assert.Equal(t, user.Core{}, res)
		repo.AssertExpectations(t)
	})
	t.Run("access denied", func(t *testing.T) {
		repo.On("Update", uint(1), mock.Anything).Return(user.Core{}, errors.New("access denied")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, *imageTrueCnv, inputData)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "access denied")
		assert.Equal(t, user.Core{}, res)
		repo.AssertExpectations(t)
	})

	t.Run("invalid file validation", func(t *testing.T) {
		filePathFake := filepath.Join("..", "..", "..", "test.csv")
		headerFake, err := helper.UnitTestingUploadFileMock(filePathFake)
		if err != nil {
			log.Panic("from file header", err.Error())
		}
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.Update(pToken, *headerFake, inputData)
		assert.ErrorContains(t, err, "validate")
		assert.Equal(t, uint(0), res.ID)
		repo.AssertExpectations(t)

	})
}

func TestDeactivate(t *testing.T) {
	repo := mocks.NewUserData(t)
	t.Run("deleting account successful", func(t *testing.T) {
		repo.On("Deactivate", uint(1)).Return(nil).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true

		err := srv.Deactivate(pToken)
		assert.Nil(t, err)
		repo.AssertExpectations(t)
	})
	t.Run("internal server error, account fail to delete", func(t *testing.T) {
		repo.On("Deactivate", uint(1)).Return(errors.New("no user has delete")).Once()
		srv := New(repo)

		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		err := srv.Deactivate(pToken)
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "error")
		repo.AssertExpectations(t)
	})
}

// s
func TestUpgradeHost(t *testing.T) {
	repo := mocks.NewUserData(t)
	inputApprovement := user.Core{ID: 1, Approvement: "yes"}
	t.Run("success update to host", func(t *testing.T) {
		repo.On("UpgradeHost", uint(1), inputApprovement).Return(inputApprovement, nil).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.UpgradeHost(pToken, inputApprovement)
		assert.Nil(t, err)
		assert.NotEqual(t, uint(0), res.ID)
		repo.AssertExpectations(t)
	})

	t.Run("email duplicated", func(t *testing.T) {
		repo.On("UpgradeHost", uint(1), inputApprovement).Return(user.Core{}, errors.New("email duplicated")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.UpgradeHost(pToken, inputApprovement)
		assert.NotNil(t, err)
		assert.Equal(t, uint(0), res.ID)
		assert.ErrorContains(t, err, "email duplicated")
		repo.AssertExpectations(t)
	})

	t.Run("access denied", func(t *testing.T) {
		repo.On("UpgradeHost", uint(1), inputApprovement).Return(user.Core{}, errors.New("access denied")).Once()
		srv := New(repo)
		_, token := helper.GenerateJWT(1)
		pToken := token.(*jwt.Token)
		pToken.Valid = true
		res, err := srv.UpgradeHost(pToken, inputApprovement)
		assert.NotNil(t, err)
		assert.Equal(t, uint(0), res.ID)
		assert.ErrorContains(t, err, "access denied")
		repo.AssertExpectations(t)
	})

}
