# File Transformation API - Version 1

A full-stack application for converting images between PNG and JPG formats, built with Go backend and React frontend.

## 🚀 Features

- **Image Conversion**: Convert images between PNG and JPG/JPEG formats
- **Drag & Drop**: Easy file upload with drag and drop support
- **Live Preview**: See your image before conversion
- **Health Check**: Real-time backend connection status
- **Responsive Design**: Beautiful UI that works on all devices
- **Download**: Instantly download converted files

## 🛠️ Tech Stack

### Backend
- **Go** - High-performance API server
- **Standard Library** - No external dependencies for core functionality

### Frontend
- **React 19** with TypeScript
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📋 Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

## 🏃 Running the Application

### 1. Start the Backend

```bash
cd golang_Backend
go run cmd/api/main.go
```

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

In a new terminal:

```bash
cd React_Frontend
npm install  # if not already done
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns: `200 OK`

### Transform Image
```
POST /transform?to={format}
```
- **Query Parameters**: 
  - `to`: Target format (`png` or `jpg`)
- **Body**: `multipart/form-data` with file field named `file`
- **Returns**: Converted image file

## 🎨 Features Breakdown

### Frontend Components
- **File Upload**: Drag & drop or click to browse
- **Format Selection**: Toggle between PNG and JPG
- **Image Preview**: View original image before conversion
- **File Info**: Display filename, size, and type
- **Status Indicators**: Visual feedback for conversion status
- **Backend Health**: Real-time connection indicator

### Backend Capabilities
- **Format Detection**: Automatic input format detection
- **Quality Control**: 90% JPEG quality for optimal results
- **File Size Limit**: 20MB maximum upload size
- **CORS Enabled**: Cross-origin requests supported

## 🔧 Development

### Backend Structure
```
golang_Backend/
├── cmd/api/main.go          # Entry point with CORS
├── internal/
│   ├── handlers/
│   │   ├── handlers.go      # Transform endpoint
│   │   └── health.go        # Health check
│   └── transform/
│       ├── convert.go       # Image conversion logic
│       └── detect.go        # File type detection
```

### Frontend Structure
```
React_Frontend/
├── src/
│   ├── api/fileApi.ts       # Backend API integration
│   ├── App.tsx              # Main component
│   ├── App.css              # Styling
│   └── main.tsx             # Entry point
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure Go backend is running on port 8080
- Check if port 8080 is not already in use

### Frontend errors
- Run `npm install` to ensure dependencies are installed
- Clear browser cache and restart dev server

### CORS issues
- The backend includes CORS middleware for cross-origin requests
- Ensure the backend is restarted after any changes

## 🎯 Supported Formats

**Input**: PNG, JPG, JPEG
**Output**: PNG, JPG

## 📝 TODO for Future Versions

- [ ] Add more image formats (GIF, WebP, BMP)
- [ ] Image compression options
- [ ] Batch conversion
- [ ] Image editing (resize, crop, rotate)
- [ ] User authentication
- [ ] Conversion history
- [ ] Dark mode

## 📄 License

MIT License - Feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Made with ❤️ using React + Go
