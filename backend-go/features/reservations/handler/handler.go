package handler

import (
	"groupproject3-airbnb-api/features/reservations"
	"groupproject3-airbnb-api/helper"
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

type ReservationHandler struct {
	Service reservations.ReservationServiceInterface
}

func New(srv reservations.ReservationServiceInterface) *ReservationHandler {
	return &ReservationHandler{
		Service: srv,
	}
}

func (t *ReservationHandler) CheckAvailability(c echo.Context) error {
	var formInput ReservationRequest
	if err := c.Bind(&formInput); err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail("error bind data"))
	}

	teamResponse := ReservationRequestToReservationEntity(&formInput)
	flag, err := t.Service.CheckAvailability(teamResponse)
	if !flag {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail(err.Error()))
	}

	return c.JSON(http.StatusOK, helper.ResponseSuccess("available", nil))
}

func (t *ReservationHandler) GetReservation(c echo.Context) error {
	userId := helper.ClaimToken(c.Get("user"))
	reservations, err := t.Service.GetReservation(uint(userId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail(err.Error()))
	}

	return c.JSON(http.StatusOK, helper.ResponseSuccess("-", ListReservationEntityToReservationResponse(reservations)))
}

func (t *ReservationHandler) CreateReservation(c echo.Context) error {
	var formInput ReservationRequest
	if err := c.Bind(&formInput); err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail("error bind data"))
	}
	userIdToken := helper.ClaimToken(c.Get("user"))
	formInput.UserId = uint(userIdToken)
	reservations, err := t.Service.Create(ReservationRequestToReservationEntity(&formInput))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, helper.ResponseFail(err.Error()))
	}

	return c.JSON(http.StatusOK, helper.ResponseSuccess("-", ReservationEntityToReservationResponse(reservations)))
}

func (t *ReservationHandler) GetByRoomId(c echo.Context) error {
	roomId, _ := strconv.Atoi(c.Param("id"))
	reservations, err := t.Service.GetByRoomId(uint(roomId))
	if err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail(err.Error()))
	}

	return c.JSON(http.StatusOK, helper.ResponseSuccess("-", ListReservationEntityToReservationResponse(reservations)))
}

func (t *ReservationHandler) CallBackMidtrans(c echo.Context) error {
	var form helper.ResponseFromCallbackMidtrans

	if err := c.Bind(&form); err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail("error bind data"))
	}

	idString := strings.Split(form.OrderId, "-")
	orderId, _ := strconv.Atoi(idString[1])

	err := t.Service.CallBackMidtrans(uint(orderId), form.TransactionStatus)
	if err != nil {
		return c.JSON(http.StatusBadRequest, helper.ResponseFail(err.Error()))
	}

	return c.JSON(http.StatusOK, helper.ResponseSuccess("-", ListReservationEntityToReservationResponse(nil)))
}
