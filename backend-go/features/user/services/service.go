package services

import (
	"errors"
	"groupproject3-airbnb-api/app/config"
	"groupproject3-airbnb-api/features/user"
	"groupproject3-airbnb-api/helper"
	"log"
	"mime/multipart"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
)

type userUseCase struct {
	qry user.UserData
}

func New(ud user.UserData) user.UserService {
	return &userUseCase{
		qry: ud,
	}
}

func (uuc *userUseCase) Register(newUser user.Core) error {
	if len(newUser.Password) != 0 {
		//validation
		err := helper.RegistrationValidate(newUser)
		if err != nil {
			return errors.New("validate: " + err.Error())
		}
	}
	hashed := helper.GeneratePassword(newUser.Password)
	newUser.Password = string(hashed)

	err := uuc.qry.Register(newUser)
	if err != nil {
		msg := ""
		if strings.Contains(err.Error(), "duplicated") {
			msg = "email already registered"
		} else {
			msg = "server error"
		}
		return errors.New(msg)
	}

	return nil
}

func (uuc *userUseCase) Login(email, password string) (string, user.Core, error) {
	res, err := uuc.qry.Login(email)
	if err != nil {
		msg := ""
		if strings.Contains(err.Error(), "not found") {
			msg = "data not found"
		} else {
			msg = "there is a problem with the server"
		}
		return "", user.Core{}, errors.New(msg)
	}

	if err := helper.ComparePassword(res.Password, password); err != nil {
		log.Println("login compare", err.Error())
		return "", user.Core{}, errors.New("password not matched")
	}

	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["userID"] = res.ID
	claims["exp"] = time.Now().Add(time.Hour * 48).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	useToken, _ := token.SignedString([]byte(config.JWTKey))

	return useToken, res, nil
}

func (uuc *userUseCase) Profile(token interface{}) (user.Core, error) {
	userID := helper.ExtractToken(token)
	res, err := uuc.qry.Profile(uint(userID))
	if err != nil {
		log.Println("data not found")
		return user.Core{}, errors.New("query error, problem with server")
	}
	return res, nil
}

func (uuc *userUseCase) Update(token interface{}, fileData multipart.FileHeader, updateData user.Core) (user.Core, error) {
	userID := helper.ExtractToken(token)

	hashed := helper.GeneratePassword(updateData.Password)
	updateData.Password = string(hashed)
	log.Println("size:", fileData.Size)

	url, err := helper.GetUrlImagesFromAWS(fileData)
	if err != nil {
		return user.Core{}, errors.New("validate: " + err.Error())
	}
	updateData.ProfilePicture = url
	res, err := uuc.qry.Update(uint(userID), updateData)
	if err != nil {
		msg := ""
		if strings.Contains(err.Error(), "not found") {
			msg = "account not registered"
		} else if strings.Contains(err.Error(), "email") {
			msg = "email duplicated"
		} else if strings.Contains(err.Error(), "access denied") {
			msg = "access denied"
		}
		return user.Core{}, errors.New(msg)
	}
	return res, nil
}

func (uuc *userUseCase) Deactivate(token interface{}) error {
	id := helper.ExtractToken(token)
	err := uuc.qry.Deactivate(uint(id))
	if err != nil {
		log.Println("query error", err.Error())
		return errors.New("query error, delete account fail")
	}
	return nil
}

func (uuc *userUseCase) UpgradeHost(token interface{}, approvement user.Core) (user.Core, error) {
	id := helper.ExtractToken(token)
	res, err := uuc.qry.UpgradeHost(uint(id), approvement)
	if err != nil {
		msg := ""
		if strings.Contains(err.Error(), "not found") {
			msg = "account not registered"
		} else if strings.Contains(err.Error(), "email") {
			msg = "email duplicated"
		} else if strings.Contains(err.Error(), "access denied") {
			msg = "access denied"
		}
		return user.Core{}, errors.New(msg)
	}
	return res, nil
}
