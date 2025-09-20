import ollama from "ollama";
import { createThinkers } from "./thinkers/index.js";
const thinkers = await createThinkers(create);

const samples = [
  `How many r letters are there in 'rare strawberry arrangement' ?`,
  `If I have 500$ and invest it on 1.2% yearly rate with monthly capitalization, how much do I get after 8 months?`,
  `What's the square root of 123?`,
  `What's 0.3 - 0.2?`,
  `Name 3 important European kings`,
  `Explain how antibiotics work in 2 sentences.`,
];

for (const prompt of samples) {
  for (const thinker of thinkers) {
    await thinker.prompt(prompt, (answer, cl) => {
      console.log(answer);
    });
  }
}
function create() {
  return {
    async prompt(text) {
      // The host is 'http://localhost:11434' because that's the port we
      // exposed from the Docker container.
      const response = await ollama.chat({
        model: "deepseek-coder",
        messages: [{ role: "user", content: text }],
      });

      return response.message.content;
    },
    destroy() {},
  };
}
