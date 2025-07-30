import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractContextFromPDF } from './pdfUtils.js';
import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();  
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


async function extractPageText(pdfPath, pageNum) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(pageNum);
  const content = await page.getTextContent();
  const strings = content.items.map((item) => item.str);
  return strings.join(' ');
}

app.post('/api/query', async (req, res) => {
  const { text, prompt, filename, pageNumber } = req.body;

  if (!text || !prompt || !filename || !pageNumber) {
    return res.status(400).json({ error: 'Missing text, prompt, filename, or pageNumber' });
  }

  try {
    console.log('\n--- AI Query Incoming ---');
    console.log('Prompt:', prompt);
    console.log('Page:', pageNumber);
    console.log('File:', filename);

    const context = await extractContextFromPDF(filename, parseInt(pageNumber));
    const fullPrompt = `${prompt}\n\nContext:\n${context}\n\nSelected Text:\n${text}`;

    console.log('Full prompt sent to Gemini:\n', fullPrompt);

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': '',
        },
      }
    );

    const geminiReply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';

    res.json({ response: geminiReply });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to query Gemini API' });
  }
});
const PORT = 5000;
app.listen(PORT  , '0.0.0.0' , () => console.log(`Server running on port ${PORT}`));

