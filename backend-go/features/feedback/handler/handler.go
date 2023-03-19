package handler

import (
	"fmt"
	"groupproject3-airbnb-api/features/feedback"
	"groupproject3-airbnb-api/helper"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

type feedbackControll struct {
	srv feedback.FeedbackService
}

func New(srv feedback.FeedbackService) feedback.FeedbackHandler {
	return &feedbackControll{
		srv: srv,
	}
}

func (fc *feedbackControll) Create() echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Get("user")
		input := CreateFeedbackRequest{}

		err := c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "input format incorrect")
		}

		res, err := fc.srv.Create(token, input.RoomID, *ReqToCore(input))
		if err != nil {
			log.Println("error running create feedback service: ", err.Error())
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "server problem"})
		}
		return c.JSON(http.StatusCreated, map[string]interface{}{
			"data":    ToFeedbackResponse(res),
			"message": "success add feedback",
		})

	}
}

// GetAll implements feedback.FeedbackHandler
func (fc *feedbackControll) GetUserFeedback() echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Get("user")
		res, err := fc.srv.GetUserFeedback(token)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "internal server error"})
		}
		return c.JSON(http.StatusOK, map[string]interface{}{
			"data":    GetFeedbackResp(res),
			"message": "success show user feedback",
		})
	}
}

func (fc *feedbackControll) GetByID() echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Get("user")
		paramID := c.Param("id")
		feedbackID, err := strconv.Atoi(paramID)
		if err != nil {
			log.Println("convert id error", err.Error())
			return c.JSON(http.StatusBadGateway, "Invalid input")
		}

		res, err := fc.srv.GetByID(token, uint(feedbackID))

		if err != nil {
			if strings.Contains(err.Error(), "feedback") {
				return c.JSON(http.StatusNotFound, map[string]interface{}{
					"message": "feedback not found",
				})
			}
		}
		return c.JSON(helper.PrintSuccessResponse(http.StatusOK, "success get feedback detail", ToFeedbackResponse(res)))
	}
}

func (fc *feedbackControll) Update() echo.HandlerFunc {
	return func(c echo.Context) error {
		token := c.Get("user")
		paramID := c.Param("id")
		feedbackID, err := strconv.Atoi(paramID)

		if err != nil {
			log.Println("convert id error", err.Error())
			return c.JSON(http.StatusBadGateway, "Invalid input")
		}

		input := CreateFeedbackRequest{}

		err = c.Bind(&input)
		if err != nil {
			return c.JSON(http.StatusBadRequest, "input format incorrect")
		}
		res, err := fc.srv.Update(token, uint(feedbackID), *ReqToCore(input))

		if err != nil {
			log.Println("error running update feedback service: ", err.Error())
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{"message": "server problem"})
		}

		return c.JSON(http.StatusCreated, map[string]interface{}{
			"data":    ToFeedbackResponse(res),
			"message": "success update feedback",
		})

	}
}

func (fc *feedbackControll) GetByRoomId() echo.HandlerFunc {
	return func(c echo.Context) error {
		roomId, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			log.Println("convert id error", err.Error())
			return c.JSON(http.StatusBadGateway, "Invalid input")
		}

		fmt.Println("ROOM ID", roomId)

		res, err := fc.srv.GetFeedbackByRoomId(uint(roomId))

		if err != nil {
			if strings.Contains(err.Error(), "feedback") {
				return c.JSON(http.StatusNotFound, map[string]interface{}{
					"message": "feedback not found",
				})
			}
		}
		return c.JSON(helper.PrintSuccessResponse(http.StatusOK, "success get feedback detail", GetFeedbackResp(res)))
	}
}
