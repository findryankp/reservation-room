package helper

import (
	"net/http"
	"strings"
)

func PrintSuccessResponse(code int, message string, data ...interface{}) (int, interface{}) {
	resp := map[string]interface{}{}
	if len(data) < 2 {
		resp["data"] = data[0]
	} else {
		resp["data"] = data[0]
		resp["token"] = data[1].(string)
	}

	if message != "" {
		resp["message"] = message
	}

	return code, resp
}

func PrintErrorResponse(msg string) (int, interface{}) {
	resp := map[string]interface{}{}
	code := -1
	if msg != "" {
		resp["message"] = msg
	}

	if strings.Contains(msg, "server") {
		code = http.StatusInternalServerError
	} else if strings.Contains(msg, "format") {
		code = http.StatusBadRequest
	} else if strings.Contains(msg, "Unauthorized") {
		code = http.StatusUnauthorized
	} else if strings.Contains(msg, "not found") {
		code = http.StatusNotFound
	}

	return code, resp
}

func ResponseSuccess(message string, data any) map[string]any {
	return map[string]any{
		"status":  true,
		"message": message,
		"data":    data,
	}
}

func ResponseFail(message string) map[string]any {
	return map[string]any{
		"status":  false,
		"message": message,
	}
}
