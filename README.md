# MedAI Lite

A standalone, full-stack web application that demonstrates six core AI-powered medical tools on a single dashboard. Built with React.js frontend and Flask backend, powered by Google Gemini AI.

## Features

### 🏠 Dashboard
- Clean and modular interface with a grid of six cards
- Each card represents a different medical AI tool
- Click to expand or navigate to dedicated tool views

### 🔧 AI-Powered Medical Tools

1. **💊 Prescription Detector**
   - Upload prescription images (handwritten or typed)
   - AI extracts and parses medicine names, dosages, timings, and precautions
   - Structured JSON output with download capability

2. **🔍 Medicine Analyzer**
   - Text input or image upload for medicine analysis
   - Returns uses, side effects, alternatives, and safety information
   - Comprehensive medicine information database

3. **🩺 Disease Predictor**
   - Text area for symptom input
   - AI predicts possible conditions and recommendations
   - Includes medical disclaimers and professional advice reminders

4. **🥗 Diet Planner**
   - Generate personalized diet plans based on conditions or medicines
   - Structured daily meal plans and foods to avoid
   - Nutritional guidelines and timing recommendations

5. **💬 Medical ChatBot**
   - Interactive chat interface for general health queries
   - Context-aware conversations with chat history
   - Always advises consulting doctors for serious concerns

6. **📋 Medical Report Analysis**
   - Upload medical reports for AI-powered analysis
   - Key findings interpretation and next steps
   - Blood tests, X-rays, lab results analysis

## Technology Stack

### Frontend
- **React.js** - Component-based UI framework
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with gradients and animations
- **Responsive Design** - Mobile and desktop friendly

### Backend
- **Flask** - Lightweight Python web framework
- **Google Gemini AI** - LLM and Vision AI capabilities
- **Flask-CORS** - Cross-origin resource sharing
- **PIL (Pillow)** - Image processing

## Project Structure

```
medai-lite/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── PrescriptionDetector.js
│   │   │   ├── MedicineAnalyzer.js
│   │   │   ├── DiseasePredictor.js
│   │   │   ├── DietPlanner.js
│   │   │   ├── MedicalChatBot.js
│   │   │   └── MedicalReportAnalysis.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file and add your Google Gemini API key
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Usage

1. **Start the Backend**: Run `python app.py` in the backend directory
2. **Start the Frontend**: Run `npm start` in the frontend directory
3. **Access the Application**: Open `http://localhost:3000` in your browser
4. **Use the Tools**: Click on any tool card to access its functionality

## API Endpoints

- `POST /api/prescription-detector` - Analyze prescription images
- `POST /api/medicine-analyzer` - Analyze medicines by name or image
- `POST /api/disease-predictor` - Predict conditions from symptoms
- `POST /api/diet-planner` - Generate personalized diet plans
- `POST /api/medical-chatbot` - Interactive medical chat
- `POST /api/medical-report-analysis` - Analyze medical reports

## Features & Capabilities

### File Upload Support
- PNG, JPG, JPEG image formats
- PDF support for medical reports
- Secure file handling with validation

### AI Integration
- Google Gemini Pro for text generation
- Google Gemini Pro Vision for image analysis
- Context-aware responses
- Structured data output

### User Experience
- No authentication required
- Instant tool access
- Download results as text files
- Responsive mobile design
- Loading states and error handling
- **Enhanced Output Formatting**: Clean, readable AI responses with proper highlighting and structure

### Safety & Disclaimers
- Medical disclaimers on all tools
- Professional consultation reminders
- Educational purpose notifications
- Privacy considerations for uploads

## Important Notes

### Medical Disclaimers
- All tools provide information for educational purposes only
- Not a substitute for professional medical advice
- Always consult qualified healthcare providers
- Emergency situations require immediate medical attention

### Privacy & Security
- No user data persistence
- No authentication or user accounts
- Files processed temporarily
- API key securely configured

### Limitations
- AI responses are for general guidance only
- Accuracy depends on input quality
- Not suitable for emergency medical situations
- Regional medical practices may vary

## Development

### Adding New Tools
1. Create a new component in `frontend/src/components/`
2. Add the component to `App.js`
3. Create corresponding API endpoint in `backend/app.py`
4. Update the Dashboard with the new tool card

### Customization
- Modify `App.css` for styling changes
- Update Gemini prompts in `app.py` for different AI behaviors
- Add new file format support by updating validation

### Deployment
- Frontend: Build with `npm run build` and deploy static files
- Backend: Deploy Flask app to cloud platform
- Environment: Configure API key as environment variable for production

### Git Setup
1. Initialize repository (if not already done):
   ```bash
   git init
   ```

2. Add remote repository:
   ```bash
   git remote add origin https://github.com/Sujalkarale45/Smackathon-Team_VibeCoder.git
   ```

3. Add and commit files:
   ```bash
   git add .
   git commit -m "Initial commit: MedAI Lite application"
   ```

4. Push to repository:
   ```bash
   git push -u origin main
   ```

### Environment Variables
- Copy `backend/.env.example` to `backend/.env`
- Add your actual Google Gemini API key
- Never commit `.env` files to version control

## License

This project is for educational and demonstration purposes.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API key configuration
3. Ensure all dependencies are installed
4. Check network connectivity for API calls
