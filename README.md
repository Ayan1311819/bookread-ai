# BookRead AI 📚✨

*पुस्तक पढ़ने का नया तरीका* - A beautiful Indian-themed AI-powered reading assistant

## 🌟 Features

- **Beautiful Indian-themed UI** with saffron, white, and green color scheme
- **PDF Upload & Viewing** with seamless integration
- **AI-powered Text Analysis** using Google Gemini
- **Interactive Chat Interface** for asking questions about selected text
- **Bilingual Support** (English & Hindi)
- **Responsive Design** with glass morphism effects
- **Indian Typography** using Noto Sans Devanagari and Playfair Display fonts

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite for fast development
- **Tailwind CSS** for styling with custom Indian color palette
- **Lucide React** for beautiful icons
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **Multer** for file uploads
- **PDF-lib** for PDF processing
- **Google Gemini AI** for intelligent text analysis

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookread-ai
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   ```

4. **Configure Environment**
   - Create `.env` file in the `server` directory
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     PORT=5000
     NODE_ENV=development
     ```

5. **Run the Application**
   
   **Option 1: Using the batch script (Windows)**
   ```bash
   start.bat
   ```
   
   **Option 2: Manual start**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm start
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎨 Design Philosophy

The interface is inspired by Indian culture and aesthetics:

- **Colors**: Saffron (भगवा), White (सफेद), and Green (हरा) representing the Indian flag
- **Typography**: Combination of Devanagari script and elegant English fonts
- **Patterns**: Subtle mandala-inspired background patterns
- **Animations**: Gentle floating animations reminiscent of traditional Indian art
- **UI Elements**: Glass morphism with warm gradients

## 📱 Usage

1. **Upload PDF**: Click on the upload area and select a PDF file
2. **Select Text**: In the PDF viewer, highlight any text you want to ask about
3. **Ask Questions**: Use the AI chat interface to ask questions about the selected text
4. **Get Answers**: Receive contextual answers from Google Gemini AI

## 🔮 Features in Development

- **Multi-language PDF support** (Hindi, Sanskrit, etc.)
- **Voice commands** in Hindi and English
- **Bookmark and annotation** system
- **Reading progress tracking**
- **Traditional Indian document templates**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent text processing
- Tailwind CSS for beautiful styling capabilities
- The React community for excellent tooling
- Indian design principles for aesthetic inspiration

---

*Made with ❤️ for better reading experiences*  
*ज्ञान की शक्ति से जीवन को बेहतर बनाएं*