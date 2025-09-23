package network

import (
	"context"
	"net"
	"time"

	"github.com/go-ping/ping"
	"github.com/owbird/one-dev/backend/data"
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
func (sf *NetworkFunctions) FetchLocalIps() ([]data.Ip, error) {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, FetchLocalIpErr)

	localIps := []data.Ip{}

	ifs, err := net.Interfaces()
	if err != nil {
		return localIps, err
	}

	for _, iface := range ifs {
		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		for _, addr := range addrs {
			ip, ok := addr.(*net.IPNet)
			if ok && !ip.IP.IsLoopback() {
				v4 := ip.IP.To4()
				if v4 != nil {
					ipData := data.Ip{
						Ip:        v4.String(),
						Interface: iface.Name,
					}

					localIps = append(localIps, ipData)
				}
			}
		}
	}
	return localIps, nil
}

// IsHostAlive returns a boolean if the host is alive
// or not
func (sf *NetworkFunctions) IsHostAlive(ip string) bool {
	defer utils.HandlePanic(sf.Ctx, ErrPrefix, HostAliveErr)

	pinger, err := ping.NewPinger(ip)
	if err != nil {
		// log.Println(err)
		return false
	}
	pinger.Count = 3
	pinger.Timeout = 2 * time.Second
	pinger.SetPrivileged(false)
	err = pinger.Run()
	if err != nil {
		// log.Println(err)
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
		// log.Println(err)
		return ""
	}

	return names[0]
}
