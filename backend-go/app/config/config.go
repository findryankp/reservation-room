package config

import (
	"log"
	"os"
	"strconv"

	"github.com/spf13/viper"
)

// Deklarasi Variable Global Untuk Memanggil file Secret Key di Env
var (
	JWTKey              = ""
	AWS_REGION          = ""
	ACCESS_KEY_ID       = ""
	ACCESS_KEY_SECRET   = ""
	SERVER_KEY_MIDTRANS = ""
)

type DBConfig struct {
	DBUser              string
	DBPass              string
	DBHost              string
	DBPort              int
	DBName              string
	jwtKey              string
	AWS_REGION          string
	ACCESS_KEY_ID       string
	ACCESS_KEY_SECRET   string
	SERVER_KEY_MIDTRANS string
}

// membuat fungsi global untuk pemanggilan config
func InitConfig() *DBConfig {
	return ReadEnv()
}

func ReadEnv() *DBConfig {
	app := DBConfig{}
	isRead := true

	if val, found := os.LookupEnv("JWT_KEY"); found {
		app.jwtKey = val
		isRead = false
	}
	if val, found := os.LookupEnv("DBUSER"); found {
		app.DBUser = val
		isRead = false
	}
	if val, found := os.LookupEnv("DBPASS"); found {
		app.DBPass = val
		isRead = false
	}
	if val, found := os.LookupEnv("DBHOST"); found {
		app.DBHost = val
		isRead = false
	}
	if val, found := os.LookupEnv("DBPORT"); found {
		cnv, _ := strconv.Atoi(val)
		app.DBPort = cnv
		isRead = false
	}
	if val, found := os.LookupEnv("DBNAME"); found {
		app.DBName = val
		isRead = false
	}
	// untuk mencari env gambar
	if val, found := os.LookupEnv("AWS_REGION"); found {
		app.AWS_REGION = val
		isRead = false
	}
	if val, found := os.LookupEnv("ACCESS_KEY_ID"); found {
		// cnv, _ := strconv.Atoi(val)
		app.ACCESS_KEY_ID = val
		isRead = false
	}
	if val, found := os.LookupEnv("ACCESS_KEY_SECRET"); found {
		app.ACCESS_KEY_SECRET = val
		isRead = false
	}

	if val, found := os.LookupEnv("SERVER_KEY_MIDTRANS"); found {
		app.SERVER_KEY_MIDTRANS = val
		isRead = false
	}

	if isRead {
		viper.AddConfigPath(".")
		viper.SetConfigName("local")
		viper.SetConfigType("env")
		err := viper.ReadInConfig()
		if err != nil {
			log.Println("error read config : ", err.Error())
			return nil
		}
		err = viper.Unmarshal(&app)
		if err != nil {
			log.Println("error parse config : ", err.Error())
			return nil
		}
	}
	JWTKey = app.jwtKey
	AWS_REGION = app.AWS_REGION
	ACCESS_KEY_ID = app.ACCESS_KEY_ID
	ACCESS_KEY_SECRET = app.ACCESS_KEY_SECRET
	SERVER_KEY_MIDTRANS = app.SERVER_KEY_MIDTRANS

	return &app
}
