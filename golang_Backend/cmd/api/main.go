package main 



import (
	"log"
	"net/http"
	"file-api/internal/handlers"
)



func main()  {

	mux := http.NewServeMux()

	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/transform", handlers.Transform)


	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

