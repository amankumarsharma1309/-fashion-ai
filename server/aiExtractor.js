const { Ollama } = require("ollama");
const ollama = new Ollama();

async function aiExtractor(message) {
  const response = await ollama.chat({
    model: "gemma2:2b",
    messages: [
      {
        role: "user",
        content: `
Extract the following information from this sentence:

- height
- skinTone
- occasion

Sentence:
${message}

Respond with ONLY raw JSON.
Do not use markdown.
Do not use triple backticks.
Do not explain anything.

Example:
{
  "height": 175,
  "skinTone": "medium",
  "occasion": "party"
}
`,
      },
    ],
  });

  return response.message.content;
}

module.exports = aiExtractor;