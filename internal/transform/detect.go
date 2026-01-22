package transform



import (
	"net/http"
	"path/filepath"
	"strings"
)



func DetectFileType(data []byte, filename string) (mime string, ext string) {
	// Okaaay  Let's do a  MIME detection using magic bytes (first 512 bytes)
	mime = http.DetectContentType(data)
	
	// Now  let's try to get a better extension from the filename
	ext = strings.ToLower(filepath.Ext(filename))


	// If the extension is missing we will guess using the mime type

	if ext == "" {
		switch mime {
		case "image/png":
			ext = ".png"
		case "image/jpeg":
			ext = ".jpg"
		case "image/gif":
			ext = ".gif"
		default:
			ext = ""
		}
	}

	return mime, ext

}