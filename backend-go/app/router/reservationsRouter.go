package router

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"groupproject3-airbnb-api/app/config"
	_reservationData "groupproject3-airbnb-api/features/reservations/data"
	_reservationHandler "groupproject3-airbnb-api/features/reservations/handler"
	_reservationService "groupproject3-airbnb-api/features/reservations/service"
)

func reservationRouter(db *gorm.DB, e *echo.Echo) {
	data := _reservationData.New(db)
	service := _reservationService.New(data)
	handler := _reservationHandler.New(service)

	g := e.Group("/reservations")
	g.Use(echojwt.JWT([]byte(config.JWTKey)))
	g.POST("/check", handler.CheckAvailability)
	g.GET("", handler.GetReservation)
	g.POST("", handler.CreateReservation)

	u := e.Group("")
	u.Use(echojwt.JWT([]byte(config.JWTKey)))
	u.GET("/rooms/:id/reservations", handler.GetByRoomId)

	e.POST("reservations/midtrans/callback", handler.CallBackMidtrans)
}
