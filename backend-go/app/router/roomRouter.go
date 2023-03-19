package router

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"groupproject3-airbnb-api/app/config"
	_roomData "groupproject3-airbnb-api/features/rooms/data"
	_roomHandler "groupproject3-airbnb-api/features/rooms/handler"
	_roomService "groupproject3-airbnb-api/features/rooms/service"
)

func roomRouter(db *gorm.DB, e *echo.Echo) {
	data := _roomData.New(db)
	service := _roomService.New(data)
	handler := _roomHandler.New(service)

	g := e.Group("/rooms")
	g.Use(echojwt.JWT([]byte(config.JWTKey)))
	g.GET("", handler.GetAll)
	g.GET("/:id", handler.GetById)
	g.POST("", handler.Create)
	g.PUT("/:id", handler.Update)
	g.DELETE("/:id", handler.Delete)

	g.GET("/filter/data", handler.GetAllFilter)

	u := e.Group("")
	u.Use(echojwt.JWT([]byte(config.JWTKey)))
	u.GET("/users/:id/rooms", handler.GetByUserId)
}
