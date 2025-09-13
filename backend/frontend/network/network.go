package network

import (
	"context"
	"log"
	"net"
	"time"

	"github.com/go-ping/ping"
	"github.com/owbird/one-dev/backend/database"
	"github.com/owbird/one-dev/backend/utils"
)

const (
	ErrPrefix = "NF"

	FetchLocalIpErr = iota
	HostAliveErr
	ResolveHostNameErr
)

// NewInstance returns a new instance of HelperFunctions.
//
// Returns a pointer to a HelperFunctions struct.
func NewInstance() *NetworkFunctions {
	return &NetworkFunctions{
		db: *database.NewInstance(),
	}
}

type NetworkFunctions struct {
	db  database.Database
	Ctx context.Context
}

// FetchLocalIp returns the local ip
// on the network
//
// It returns a string.
func (sf *NetworkFunctions) FetchLocalIp() (string, error) {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, FetchLocalIpErr)

	return utils.GetLocalIp()
}

// IsHostAlive returns a boolean if the host is alive
// or not
func (sf *NetworkFunctions) IsHostAlive(ip string) bool {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, HostAliveErr)

	pinger, err := ping.NewPinger(ip)
	if err != nil {
		log.Println(err)
		return false
	}
	pinger.Count = 3
	pinger.Timeout = 2 * time.Second
	pinger.SetPrivileged(false)
	err = pinger.Run()
	if err != nil {
		log.Println(err)
		return false
	}
	stats := pinger.Statistics()
	return stats.PacketsRecv > 0
}

// ResolveHostname returns the hostname of the ip
func (sf *NetworkFunctions) ResolveHostname(ip string) string {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, ResolveHostNameErr)
	names, err := net.LookupAddr(ip)
	if err != nil {
		log.Println(err)
		return ""
	}

	return names[0]
}
