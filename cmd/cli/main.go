package main

import (
	"bytes"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"file-api/internal/transform"
)

func main() {
	inPath := flag.String("in", "", "Path to the input image file")
	outPath := flag.String("out", "", "Path to the output image file (optional)")
	toFormat := flag.String("to", "png", "Target image format (png, jpg)")
	flag.Parse()

	if *inPath == "" {
		fmt.Fprintln(os.Stderr, "usage: go run ./cmd/cli -in input.png -to jpg")
		os.Exit(1)
	}

	data, err := os.ReadFile(*inPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "failed to read input file:", err)
		os.Exit(1)
	}

	mime, ext := transform.DetectFileType(data, filepath.Base(*inPath))
	fmt.Println("Detected MIME:", mime, "Ext:", ext)

	outBytes, outMime, err := transform.ConvertImage(bytes.NewReader(data), *toFormat)
	if err != nil {
		fmt.Fprintln(os.Stderr, "convert error:", err)
		os.Exit(1)
	}
	fmt.Println("Output MIME:", outMime)

	if *outPath == "" {
		base := strings.TrimSuffix(*inPath, filepath.Ext(*inPath))
		*outPath = base + "." + strings.TrimPrefix(*toFormat, ".")
	}

	if err := os.WriteFile(*outPath, outBytes, 0644); err != nil {
		fmt.Fprintln(os.Stderr, "write error:", err)
		os.Exit(1)
	}

	fmt.Println("Saved:", *outPath)
}
