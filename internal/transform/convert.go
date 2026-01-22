package transform

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"strings"
)

func ConvertImage(r io.Reader, to string) ([]byte, string, error) {
	img, format, err := image.Decode(r)
	if err != nil {
		return nil, "", fmt.Errorf("decode failed: %w", err)
	}

	_ = format // keep for later (input format)

	to = strings.ToLower(strings.TrimPrefix(to, "."))

	var out bytes.Buffer

	switch to {
	case "png":
		if err := png.Encode(&out, img); err != nil {
			return nil, "", fmt.Errorf("png encode failed: %w", err)
		}
		return out.Bytes(), "image/png", nil

	case "jpg", "jpeg":
		opts := &jpeg.Options{Quality: 90}
		if err := jpeg.Encode(&out, img, opts); err != nil {
			return nil, "", fmt.Errorf("jpeg encode failed: %w", err)
		}
		return out.Bytes(), "image/jpeg", nil

	default:
		return nil, "", fmt.Errorf("unsupported target format: %q", to)
	}
}
