package helper

import (
	"bytes"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
)

func UnitTestingUploadFileMock(filePath string) (*multipart.FileHeader, error) {
	f, err := os.Open(filePath)
	if err != nil {
		log.Println(err.Error())
	}
	body := &bytes.Buffer{}
	writter := multipart.NewWriter(body)
	part, err := writter.CreateFormFile("file", filePath)
	if err != nil {
		log.Panic("create form file", err.Error())
	}
	_, err = io.Copy(part, f)
	if err != nil {
		log.Panic("io copy error", err.Error())
	}
	writter.Close()
	req, err := http.NewRequest("POST", "/upload", body)
	if err != nil {
		log.Panic("post", err.Error())
	}
	req.Header.Set("Content-Type", writter.FormDataContentType())
	// req.Header.Set("Content-Type")
	_, header, err := req.FormFile("file")
	if err != nil {
		log.Panic("content type", err.Error())
	}
	return header, nil
}
