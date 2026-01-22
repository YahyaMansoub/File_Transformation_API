package handlers


import (
	"net/http"
	"encoding/json"
)



func Health(w http.ResponseWriter, r *http.Request) {
	w.Header ().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func Version(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"version": "0.1"})
}


