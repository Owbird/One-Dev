package utils

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"time"
)

func MakeAuthorizedRequest(method, url, token string, body []byte) ([]byte, error) {
	log.Println("[+] Making auth req")

	client := &http.Client{
		Timeout: 45 * time.Second,
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(req)
	if err != nil {
		// Retry request on timeout
		if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
			log.Println("[!] Retrying request")
			return MakeAuthorizedRequest(method, url, token, body)
		}

		return nil, err
	}
	defer res.Body.Close()

	body, err = io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	log.Println("[+] Auth req done")

	return body, nil
}
