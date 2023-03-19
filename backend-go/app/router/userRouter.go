package router

import (
	"groupproject3-airbnb-api/app/config"
	usrData "groupproject3-airbnb-api/features/user/data"
	usrHdl "groupproject3-airbnb-api/features/user/handler"
	usrSrv "groupproject3-airbnb-api/features/user/services"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

func userRouter(db *gorm.DB, e *echo.Echo) {
	uData := usrData.New(db)
	uService := usrSrv.New(uData)
	uHandler := usrHdl.New(uService)

	// AUTH
	e.POST("/register", uHandler.Register())
	e.POST("/login", uHandler.Login())

	// USER
	e.GET("/users", uHandler.Profile(), middleware.JWT([]byte(config.JWTKey)))
	e.PUT("/users", uHandler.Update(), middleware.JWT([]byte(config.JWTKey)))
	e.DELETE("/users", uHandler.Deactivate(), middleware.JWT([]byte(config.JWTKey)))
	e.POST("/users/upgrade", uHandler.UpgradeHost(), middleware.JWT([]byte(config.JWTKey)))
}
