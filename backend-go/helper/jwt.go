package helper

import (
	"groupproject3-airbnb-api/app/config"

	"github.com/golang-jwt/jwt"
	jwtv4 "github.com/golang-jwt/jwt/v4"
)

func ExtractToken(t interface{}) int {
	user := t.(*jwt.Token)
	userId := -1
	if user.Valid {
		claims := user.Claims.(jwt.MapClaims)
		switch claims["userID"].(type) {
		case float64:
			userId = int(claims["userID"].(float64))
		case int:
			userId = claims["userID"].(int)
		}
	}
	return userId
}

func GenerateJWT(id int) (string, interface{}) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["userID"] = id
	// claims["exp"] = time.Now().Add(time.Hour * 1).Unix() //Token expires after 1 hour
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	useToken, _ := token.SignedString([]byte(config.JWTKey))
	return useToken, token
}

func ClaimToken(t interface{}) int {
	user := t.(*jwtv4.Token)
	userId := -1
	if user.Valid {
		claims := user.Claims.(jwtv4.MapClaims)
		switch claims["userID"].(type) {
		case float64:
			userId = int(claims["userID"].(float64))
		case int:
			userId = claims["userID"].(int)
		}
	}
	return userId
}
