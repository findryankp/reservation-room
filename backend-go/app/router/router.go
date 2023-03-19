package router

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func InitRouter(db *gorm.DB, e *echo.Echo) {
	userRouter(db, e)
	roomRouter(db, e)
	reservationRouter(db, e)
	feedbackRouter(db, e)
}
