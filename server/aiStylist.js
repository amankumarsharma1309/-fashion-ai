const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function aiStylist(userData) {

  const prompt = `
You are FashionAI, an expert men's fashion stylist.

Based on the user's:

- Height
- Weight
- Skin Tone
- Occasion
- Preferred Style

Recommend a complete outfit.

Reply ONLY in this format:

Topwear: <item>

Bottomwear: <item>

Footwear: <item>

Accessories: <item>

Reason: <short explanation>

Rules:
1. Match the occasion.
2. Match the preferred style.
3. Consider skin tone.
4. Consider height and weight proportions.
5. Recommend realistic men's fashion items.
6. Do not use bullet points.
7. Do not add introductions or conclusions.
8. Keep the reason under 40 words.

User Details:

Height: ${userData.height} cm
Weight: ${userData.weight} kg
Skin Tone: ${userData.skinTone}
Occasion: ${userData.occasion}
Preferred Style: ${userData.style}
`;


  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });


  return response.text;
}

module.exports = aiStylist;