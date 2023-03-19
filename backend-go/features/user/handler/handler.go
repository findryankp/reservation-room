package handler

import (
	"groupproject3-airbnb-api/features/user"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

type userControll struct {
	srv user.UserService
}

func New(srv user.UserService) user.UserHandler {
	return &userControll{
		srv: srv,
	}
}

func (uc *userControll) Register() echo.HandlerFunc {
	return func(c echo.Context) error {
		input := RegisterRequest{}
		err := c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "input format incorrect"})
		}

		err = uc.srv.Register(*ReqToCore(input))
		if err != nil {
			if strings.Contains(err.Error(), "already") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "email already registered"})
			} else if strings.Contains(err.Error(), "is not min") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "validate: password length minimum 3 character"})
			} else if strings.Contains(err.Error(), "validate") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": err.Error()})
			} else {
				return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "internal server error"})
			}
		}
		return c.JSON(http.StatusCreated, map[string]interface{}{"message": "success create account"})
	}
}

func (uc *userControll) Login() echo.HandlerFunc {
	return func(c echo.Context) error {
		input := LoginRequest{}
		err := c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "input format incorrect"})
		}

		if input.Email == "" {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "email not allowed empty"})
		} else if input.Password == "" {
			return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "password not allowed empty"})
		}

		token, res, err := uc.srv.Login(input.Email, input.Password)
		if err != nil {
			if strings.Contains(err.Error(), "password") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "password not match"})
			} else {
				return c.JSON(http.StatusNotFound, map[string]interface{}{"message": "account not registered"})
			}
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"data":    ToResponse(res),
			"token":   token,
			"message": "success login",
		})
	}
}

func (uc *userControll) Profile() echo.HandlerFunc {
	return func(c echo.Context) error {
		res, err := uc.srv.Profile(c.Get("user"))
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "internal server error"})
		}

		return c.JSON(http.StatusOK, map[string]interface{}{
			"data":    ToProfileResponse(res),
			"message": "success show profile",
		})
	}
}

func (uc *userControll) Update() echo.HandlerFunc {
	return func(c echo.Context) error {
		input := RegisterRequest{}
		err := c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "input format incorrect")
		}
		//proses cek apakah user input foto ?
		checkFile, _, _ := c.Request().FormFile("profile_picture")
		if checkFile != nil {
			formHeader, err := c.FormFile("profile_picture")
			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "Select a file to upload"})
			}
			input.FileHeader = *formHeader
		}
		// log.Println((input.FileHeader))
		res, err := uc.srv.Update(c.Get("user"), input.FileHeader, *ReqToCore(input))
		if err != nil {
			if strings.Contains(err.Error(), "email") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "email already used"})
			} else if strings.Contains(err.Error(), "is not min") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "validate: password length minimum 3 character"})
			} else if strings.Contains(err.Error(), "type") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": err.Error()})
			} else if strings.Contains(err.Error(), "access denied") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "access denied"})
			} else if strings.Contains(err.Error(), "size") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "file size max 500kb"})
			} else if strings.Contains(err.Error(), "validate") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": err.Error()})
			} else if strings.Contains(err.Error(), "not registered") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": err.Error()})
			} else {
				return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "unable to process data"})
			}
		}

		result, err := ConvertUpdateResponse(res)
		if err != nil {
			return c.JSON(http.StatusOK, map[string]interface{}{
				"message": err.Error(),
			})
		} else {
			// log.Println(res)
			return c.JSON(http.StatusOK, map[string]interface{}{
				"data":    result,
				"message": "success update user profile",
			})
		}
	}
}

func (uc *userControll) Deactivate() echo.HandlerFunc {
	return func(c echo.Context) error {
		err := uc.srv.Deactivate(c.Get("user"))
		if err != nil {
			return c.JSON(http.StatusNotFound, map[string]interface{}{
				"message": "data not found",
			})
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"message": "success deactivate",
		})
	}
}

func (uc *userControll) UpgradeHost() echo.HandlerFunc {
	return func(c echo.Context) error {
		input := ApproveRequest{}

		err := c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "input format incorrect")
		}

		if input.Approvement == "yes" {
			input.Role = "Host"
		} else {
			input.Role = "User"
		}

		res, err := uc.srv.UpgradeHost(c.Get("user"), *ReqToCore(input))

		if err != nil {
			if strings.Contains(err.Error(), "password") {
				return c.JSON(http.StatusBadRequest, map[string]interface{}{"message": "password not match"})
			} else {
				return c.JSON(http.StatusNotFound, map[string]interface{}{"message": "account not registered"})
			}
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"data":    ToApproveResponse(res),
			"message": "success upgrade user to host",
		})
	}
}
