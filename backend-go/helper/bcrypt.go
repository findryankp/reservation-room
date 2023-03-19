package helper

import (
	"errors"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func GeneratePassword(password string) string {
	hashed := ""
	if password != "" {
		hashedByte, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Println("==== BCRYPT ERROR ==== ", err.Error())
		}
		hashed = string(hashedByte)
	}
	return hashed
}

func ComparePassword(hashed, password string) error {
	if err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)); err != nil {
		log.Println("login compare", err.Error())
		return errors.New("password not match")
	}
	return nil
}
