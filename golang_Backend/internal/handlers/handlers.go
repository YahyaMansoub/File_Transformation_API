package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"file-api/internal/transform"
)

const maxUploadSize = 20 << 20 // 20MB

func Transform(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// query: ?to=jpg|png
	to := r.URL.Query().Get("to")
	if to == "" {
		to = "png"
	}

	// limit upload size
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	// parse multipart
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		http.Error(w, "invalid multipart/form-data", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "missing form field: file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// convert
	outBytes, outMime, err := transform.ConvertImage(file, to)
	if err != nil {
		http.Error(w, fmt.Sprintf("convert failed: %v", err), http.StatusBadRequest)
		return
	}

	// response headers
	w.Header().Set("Content-Type", outMime)
	outExt := strings.TrimPrefix(strings.ToLower(to), ".")
	outName := strings.TrimSuffix(header.Filename, ".png")
	outName = strings.TrimSuffix(outName, ".jpg")
	outName = strings.TrimSuffix(outName, ".jpeg")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s.%s"`, outName, outExt))

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(outBytes)
}
  