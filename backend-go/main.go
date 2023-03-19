package main

import (
	config "groupproject3-airbnb-api/app/config"
	database "groupproject3-airbnb-api/app/database"
	router "groupproject3-airbnb-api/app/router"
	"groupproject3-airbnb-api/helper"
	"log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	cfg := config.InitConfig()
	db := database.InitDB(*cfg)
	helper.ServerKey = cfg.SERVER_KEY_MIDTRANS
	database.Migrate(db)

	e := echo.New()
	e.Pre(middleware.RemoveTrailingSlash())
	e.Use(middleware.CORS())
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))

	router.InitRouter(db, e)

	if err := e.Start(":8000"); err != nil {
		log.Println(err.Error())
	}
}
