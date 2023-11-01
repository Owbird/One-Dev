package utils

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"time"
)

func MakeAuthorizedRequest(method, url, token string) ([]byte, error) {
	log.Println("[+] Making auth req")

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(req)
	if err != nil {
		//Retry request on timeout
		if netErr, ok := err.(net.Error); ok && netErr.Timeout() {
			log.Println("[!] Retrying request")
			MakeAuthorizedRequest(method, url, token)
		}

		return nil, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	log.Println("[+] Auth req done")

	return body, nil
}
