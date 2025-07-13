# BookRead AI - Development Guide 🚀

## Quick Start

### 1. Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Configure Backend
1. Open `server/.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Application

**Option A: Using the Windows batch script**
```bash
# Double-click start.bat or run in terminal:
start.bat
```

**Option B: Manual start (recommended for development)**

Terminal 1 - Backend:
```bash
cd server
npm start
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
bookread-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Toast.jsx   # Notification system
│   │   │   └── Loading.jsx # Loading components
│   │   ├── App.jsx         # Main application
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── server/                 # Node.js backend
│   ├── uploads/           # Uploaded PDF files
│   ├── server.js          # Express server
│   ├── pdfUtils.js        # PDF processing utilities
│   ├── extract_context.py # Python PDF context extraction
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── start.bat             # Windows startup script
└── README.md            # Main documentation
```

## Features Implemented

### Frontend (React + Tailwind)
- ✅ Indian-themed UI with saffron, white, and green colors
- ✅ Responsive design with glass morphism effects
- ✅ PDF file upload with drag-and-drop
- ✅ Text selection from PDF
- ✅ AI chat interface
- ✅ Toast notifications
- ✅ Loading states and animations
- ✅ Bilingual support (English + Hindi)
- ✅ Custom fonts (Noto Sans Devanagari + Playfair Display)

### Backend (Node.js + Express)
- ✅ PDF file upload handling
- ✅ Google Gemini AI integration
- ✅ CORS enabled for frontend communication
- ✅ Environment variable configuration
- ✅ Error handling and logging

## API Endpoints

### POST /api/upload
Upload a PDF file
- **Body**: FormData with 'file' field
- **Response**: `{ filePath: string }`

### POST /api/query
Query AI about selected text
- **Body**: 
  ```json
  {
    "text": "selected text",
    "prompt": "user question",
    "filename": "file.pdf",
    "pageNumber": 1
  }
  ```
- **Response**: `{ response: string }`

### GET /uploads/:filename
Serve uploaded PDF files

## Indian Theme Elements

### Colors
- **Saffron** (#f97316): Primary color representing energy and courage
- **White** (#ffffff): Representing peace and truth
- **Green** (#10b981): Representing fertility and valor

### Typography
- **Noto Sans Devanagari**: For Hindi text and primary UI
- **Playfair Display**: For elegant headings and accent text

### Design Patterns
- Mandala-inspired background patterns
- Lotus-like ornamental elements
- Gentle floating animations
- Glass morphism with warm gradients

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY not found"**
   - Make sure you've created the `.env` file in the `server` directory
   - Verify the API key is correctly set without quotes

2. **"Cannot connect to backend"**
   - Ensure the backend server is running on port 5000
   - Check if there are any error messages in the backend terminal

3. **"PDF not loading"**
   - Make sure the uploaded file is a valid PDF
   - Check browser console for any CORS errors

4. **"AI query not working"**
   - Verify your Gemini API key is valid and has quota remaining
   - Check the backend logs for API errors

### Development Tips

1. **Hot Reload**: Frontend has hot reload enabled with Vite
2. **API Testing**: Use tools like Postman to test backend endpoints
3. **Debugging**: Check browser console and backend terminal for errors
4. **Styling**: Tailwind classes are configured with Indian theme colors

## Next Steps

To enhance the application further:

1. **Add PDF.js for better PDF handling**
2. **Implement user authentication**
3. **Add bookmark and annotation features**
4. **Support for multiple languages**
5. **Voice commands in Hindi/English**
6. **Reading progress tracking**

---

Happy coding! 🎉  
*कोडिंग का आनंद लें!*
