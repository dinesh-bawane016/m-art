require('dotenv').config({ path: 'server/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are a bot"
    });
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage("hello");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
