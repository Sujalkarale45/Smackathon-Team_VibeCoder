from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from werkzeug.utils import secure_filename
import tempfile
from PIL import Image
import io
import base64
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini models
text_model = genai.GenerativeModel('gemini-2.0-flash-lite')
vision_model = genai.GenerativeModel('gemini-2.0-flash-lite')

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_llm_output(text):
    """Format LLM output to be more user-readable"""
    if not text:
        return "No response generated"
    
    try:
        # Convert to string if it's not already
        formatted_text = str(text)
        
        # Remove markdown-style formatting
        formatted_text = formatted_text.replace('**', '').replace('*', '').replace('`', '')
        
        # Remove extra quotes and escape characters
        formatted_text = formatted_text.replace('""', '"').replace('\\"', '"')
        
        # Remove common markdown artifacts
        formatted_text = formatted_text.replace('###', '').replace('##', '').replace('#', '')
        
        # Clean up multiple newlines but preserve structure
        lines = formatted_text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            stripped_line = line.strip()
            if stripped_line:  # Only keep non-empty lines
                cleaned_lines.append(stripped_line)
            elif cleaned_lines and cleaned_lines[-1]:  # Add one empty line for spacing
                cleaned_lines.append('')
        
        # Join lines and remove extra spaces
        formatted_text = '\n'.join(cleaned_lines)
        
        # Remove leading/trailing whitespace
        formatted_text = formatted_text.strip()
        
        # Ensure we have content
        if not formatted_text:
            return "Response was empty after formatting"
            
        return formatted_text
        
    except Exception as e:
        return f"Error formatting response: {str(e)}"

def process_text_with_gemini(prompt):
    """Process text with Gemini API"""
    try:
        response = text_model.generate_content(prompt)
        
        # Check if response has text
        if hasattr(response, 'text') and response.text:
            return format_llm_output(response.text)
        else:
            return "I apologize, but I couldn't generate a response for your query. Please try rephrasing your question."
            
    except Exception as e:
        return f"I encountered an error while processing your request. Please try again. Error details: {str(e)}"

def process_image_with_gemini(image_data, prompt):
    """Process image with Gemini Vision API"""
    try:
        # Convert image data to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Generate content with vision model
        response = vision_model.generate_content([prompt, image])
        
        # Check if response has text
        if hasattr(response, 'text') and response.text:
            return format_llm_output(response.text)
        else:
            return "I apologize, but I couldn't analyze this image. Please try uploading a clear image and try again."
            
    except Exception as e:
        return f"I encountered an error while analyzing the image. Please try again with a different image. Error details: {str(e)}"

@app.route('/')
def hello():
    return jsonify({"message": "MedAI Lite Backend API is running!"})

@app.route('/api/prescription-detector', methods=['POST'])
def prescription_detector():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format"}), 400
        
        # Read image data
        image_data = file.read()
        
        # First, extract text from prescription image
        extract_prompt = """
        Extract all text from this prescription image. 
        Focus on medicine names, dosages, timings, and any special instructions.
        Return the extracted text as clearly as possible.
        """
        
        extracted_text = process_image_with_gemini(image_data, extract_prompt)
        
        # Then parse the extracted text into structured format
        parse_prompt = f"""
        Parse the following prescription text into a structured JSON format:
        
        Text: {extracted_text}
        
        Return a JSON object with the following structure:
        {{
            "medicines": [
                {{
                    "name": "medicine name",
                    "dosage": "dosage amount",
                    "timing": "when to take (morning, evening, etc.)",
                    "duration": "how long to take",
                    "instructions": "special instructions"
                }}
            ],
            "doctor_name": "doctor name if visible",
            "patient_name": "patient name if visible",
            "date": "prescription date if visible",
            "precautions": ["list of precautions mentioned"]
        }}
        
        If any information is not available, use "Not specified" as the value.
        """
        
        structured_response = text_model.generate_content(parse_prompt)
        
        # Try to parse as JSON, fallback to text if parsing fails
        try:
            result = json.loads(structured_response.text.strip())
        except json.JSONDecodeError:
            result = {
                "extracted_text": extracted_text,
                "structured_data": structured_response.text,
                "note": "Could not parse into perfect JSON format"
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/medicine-analyzer', methods=['POST'])
def medicine_analyzer():
    try:
        medicine_input = None
        
        # Check if it's text input or file upload
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if not allowed_file(file.filename):
                return jsonify({"error": "Invalid file format"}), 400
            
            image_data = file.read()
            prompt = """
            Analyze this medicine image and provide detailed information about:
            1. Medicine name and composition
            2. Uses and indications
            3. Common side effects
            4. Dosage recommendations
            5. Precautions and contraindications
            6. Alternative medicines with similar effects
            
            Format the response clearly with proper sections.
            and give response just little short
            """
            
            medicine_input = process_image_with_gemini(image_data, prompt)
        
        elif 'medicine_name' in request.form:
            medicine_name = request.form['medicine_name']
            prompt = f"""
            Provide detailed information about the medicine: {medicine_name}
            
            Include:
            1. Uses and indications
            2. Common side effects
            3. Typical dosage (mention this is for reference only, actual dosage should be as prescribed)
            4. Precautions and contraindications
            5. Alternative medicines with similar effects
            6. Drug interactions to be aware of
            
            Always include a disclaimer that this information is for educational purposes only and patients should consult healthcare professionals.
            and give response just little short.
            """
            
            response = process_text_with_gemini(prompt)
            medicine_input = response
        
        else:
            return jsonify({"error": "No medicine name or image provided"}), 400
        
        return jsonify({"analysis": medicine_input})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/disease-predictor', methods=['POST'])
def disease_predictor():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', '')
        
        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400
        
        prompt = f"""
        IMPORTANT DISCLAIMER: This is an AI-generated response for informational purposes only and should NOT replace professional medical diagnosis or treatment.
        
        Based on the following symptoms, provide possible conditions and recommendations:
        
        Symptoms: {symptoms}
        
        Please provide:
        1. Possible conditions (ranked by likelihood) {"tell only 3 most ranked possible conditions"}
        2. General recommendations for each condition
        3. When to seek immediate medical attention
        4. Home care suggestions (if applicable)
        5. Which medical specialist to consult
        
        Always emphasize that proper medical diagnosis requires professional evaluation.
        Start your response with: "⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers."
        """
        
        response = process_text_with_gemini(prompt)
        
        return jsonify({"prediction": response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/diet-planner', methods=['POST'])
def diet_planner():
    try:
        data = request.get_json()
        condition = data.get('condition', '')
        medicines = data.get('medicines', '')
        dietary_restrictions = data.get('dietary_restrictions', '')
        
        if not condition and not medicines:
            return jsonify({"error": "Please provide either a medical condition or medicines"}), 400
        
        prompt = f"""
        Create a detailed diet plan based on the following information:
        
        Medical Condition: {condition}
        Current Medicines: {medicines}
        Dietary Restrictions: {dietary_restrictions}
        
        Please provide:
        1. Daily meal plan (Breakfast, Lunch, Dinner, Snacks)
        2. Foods to include (beneficial foods)
        3. Foods to avoid (harmful or interfering foods)
        4. Nutritional guidelines
        5. Meal timing recommendations
        6. Hydration guidelines
        7. Special considerations if taking medicines
        
        Format the response in a clear, structured manner with practical meal suggestions.
        Include a note that this is general guidance and individual dietary needs may vary.
        """
        
        response = process_text_with_gemini(prompt)
        
        return jsonify({"diet_plan": response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/medical-chatbot', methods=['POST'])
def medical_chatbot():
    try:
        data = request.get_json()
        question = data.get('question', '')
        chat_history = data.get('chat_history', [])
        
        if not question:
            return jsonify({"error": "No question provided"}), 400
        
        # Build context from chat history
        context = ""
        if chat_history:
            context = "Previous conversation:\n"
            for msg in chat_history[-5:]:  # Include last 5 messages for context
                context += f"User: {msg.get('user', '')}\nBot: {msg.get('bot', '')}\n"
            context += "\n"
        
        prompt = f"""
        You are a helpful medical AI assistant. Provide informative and helpful responses about health-related questions.
        
        {context}
        Current question: {question}
        
        Guidelines:
        1. Provide helpful, accurate medical information
        2. Always remind users to consult healthcare professionals for serious concerns
        3. For emergency symptoms, advise immediate medical attention
        4. Be empathetic and supportive
        5. Admit when you don't know something
        6. Don't provide specific dosage recommendations
        
        If the question involves serious symptoms or emergencies, start with: "🚨 If this is an emergency, please seek immediate medical attention or call emergency services."
        
        For general questions, provide helpful information while encouraging professional consultation when appropriate.
        if user will write any query not related to medical field then you should inform them to give query related to medical field
        """
        
        response = process_text_with_gemini(prompt)
        
        return jsonify({"response": response})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/medical-report-analysis', methods=['POST'])
def medical_report_analysis():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({"error": "Invalid file format"}), 400
        
        image_data = file.read()
        
        prompt = """
        Analyze this medical report and provide a comprehensive analysis including:
        
        1. Key Findings: List all important test results, measurements, and observations
        2. Normal vs Abnormal Values: Identify which values are within normal range and which are not
        3. Clinical Interpretation: Explain what these findings might indicate
        4. Areas of Concern: Highlight any values that require attention
        5. Recommended Next Steps: Suggest follow-up actions or additional tests
        6. Questions to Ask Doctor: List important questions the patient should discuss with their healthcare provider
        
        Important: 
        - This analysis is for informational purposes only
        - All interpretations should be verified with a qualified healthcare professional
        - Do not provide definitive diagnoses
        - Focus on explaining what the values mean in layman's terms
        
        Start with: "📋 MEDICAL REPORT ANALYSIS - For Educational Purposes Only"
        End with: "⚠️ Please discuss these findings with your healthcare provider for proper medical interpretation and next steps."
        """
        
        analysis = process_image_with_gemini(image_data, prompt)
        
        return jsonify({"analysis": analysis})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('BACKEND_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)
