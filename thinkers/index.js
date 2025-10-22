import { create as createRegular } from "./basic.js";
import { coderWith } from "./coderWith.js";

const createCoder1 = coderWith(
  `Convert user question to valid JavaScript code that solves it programatically. Call resultCb() callback function with your result as argument.
Output ONLY JavaScript code. NO dependencies, don't require or import any modules, NO raw text, NO explanations, NO markdown.`,
  "coder1"
);

const createCoder2 = coderWith(
  `Convert user question to valid JavaScript code that solves it programatically and returns structured data. Call resultCb() callback function with your result as argument.
Output ONLY JavaScript code. NO dependencies, don't require or import any modules, NO raw text, NO explanations, NO markdown.
First line of your code must be a comment with steps you want to take. Never hardcode the result value if it can be computed.`,
  "coder2"
);

export async function createThinkers(
  create,
  thinkersFactories = [createRegular, createCoder1, createCoder2]
) {
  if (typeof create !== "function") {
    create = () => LanguageModel.create();
  }
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
