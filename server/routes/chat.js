const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Artwork = require('../models/Artwork');

const router = express.Router();

const SYSTEM_PROMPT = `
You are a helpful, elegant, and professional art curator assistant for the M-Art marketplace.
M-Art is India's premier online art gallery connecting buyers with talented independent artists.
You help buyers discover artworks, explain art concepts, and guide them through the gallery.

Tone: Minimalist, professional, knowledgeable, and polite. Keep responses relatively concise but informative.

Rules:
1. Do not use excessive emojis. One or two at most.
2. If asked about purchasing, let them know they can browse the gallery and checkout securely via Razorpay.
3. If they ask about selling, let them know they can register as an "Artist" to start selling.
4. If you don't know the answer, politely let them know to use the Contact Us page.
`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'put_your_gemini_api_key_here') {
      return res.status(400).json({ 
        error: 'The AI is currently taking a break. (API Key not configured in the server).',
        botMessage: 'I am currently offline. Please have the administrator configure my API key in the server settings.'
      });
    }

    const recentArtworks = await Artwork.find({ status: 'Available' }).limit(5).select('title price category');
    const galleryContext = recentArtworks.length > 0 
      ? `\n\nFor context, here are some currently available artworks in our gallery right now: \n${recentArtworks.map(a => `- ${a.title} (${a.category}) - ₹${a.price}`).join('\n')}` 
      : '';

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_PROMPT + galleryContext
    });

    // Convert frontend history format to Gemini format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Gemini strictly requires the history array to start with a 'user' message.
    // If the first message in the history is our hardcoded greeting ('model'), we must remove it.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Start the chat with the history
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage([{ text: message }]);
    const responseText = result.response.text();

    res.json({ botMessage: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI service.', botMessage: 'I encountered an error while trying to process that. Please try again later.' });
  }
});

module.exports = router;
