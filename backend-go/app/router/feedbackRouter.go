package router

import (
	"groupproject3-airbnb-api/app/config"
	feedData "groupproject3-airbnb-api/features/feedback/data"
	feedHdl "groupproject3-airbnb-api/features/feedback/handler"
	feedSrv "groupproject3-airbnb-api/features/feedback/services"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"
)

func feedbackRouter(db *gorm.DB, e *echo.Echo) {
	fData := feedData.New(db)
	fService := feedSrv.New(fData)
	fHandler := feedHdl.New(fService)

	//Feedback
	e.POST("/feedbacks", fHandler.Create(), middleware.JWT([]byte(config.JWTKey)))
	e.GET("/feedbacks", fHandler.GetUserFeedback(), middleware.JWT([]byte(config.JWTKey)))
	e.GET("/feedbacks/:id", fHandler.GetByID(), middleware.JWT([]byte(config.JWTKey)))
	e.PUT("/feedbacks/:id", fHandler.Update(), middleware.JWT([]byte(config.JWTKey)))

	e.GET("/rooms/:id/feedbacks", fHandler.GetByRoomId(), middleware.JWT([]byte(config.JWTKey)))
}
