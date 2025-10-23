import { create as createRegular } from "./basic.js";
import { coderWith } from "./coderWith.js";

const pause = async () => new Promise((resolve) => setTimeout(resolve, 500));

function canCache(create) {
  return async () => {
    const model = await create();
    return {
      prompt: async (txt) => {
        if (window.location.hash.includes("cache")) {
          const cached = localStorage.getItem(txt);
          if (cached) {
            await pause();
            return cached;
          }
        }
        const result = await model.prompt(txt);
        localStorage.setItem(txt, result);
        return result;
      },
      destroy: () => model.destroy(),
    };
  };
}

const createCoder1 = coderWith(
  `Convert user question to valid JavaScript code that solves it programatically. Assign answer to 'result'.
Output ONLY JavaScript code. NO dependencies, don't require or import any modules, NO raw text, NO explanations, NO markdown.`,
  "coder1",
);

const createCoder2 = coderWith(
  `Convert user question to valid JavaScript code that solves it programatically and returns structured data. Assign answer to 'result'.
Output ONLY JavaScript code. NO dependencies, don't require or import any modules, NO raw text, NO explanations, NO markdown.
First line of your code must be a comment with steps you want to take. Never hardcode the result value if it can be computed.`,
  "coder2",
);

export async function createThinkers(
  create,
  thinkersFactories = [createRegular, createCoder1, createCoder2],
) {
  if (typeof create !== "function") {
    create = () => LanguageModel.create();
  }

  create = canCache(create);

  const thinkers = await Promise.all(thinkersFactories.map((t) => t(create)));
  return thinkers;
}

export function getThinkers() {
  return {
    createRegular,
    createCoder1,
    createCoder2,
  };
}
