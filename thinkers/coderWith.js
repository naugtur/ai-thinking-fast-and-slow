import { evaluate } from "../secure/evaluator.js";

function prepareCode(code) {
  if (code.trim().startsWith("```")) {
    const lines = code.split("\n");
    lines.pop();
    lines.shift();
    code = lines.join("\n");
  }
  return code;
}

async function executeCode(code, modelCode, say, attempt = 1) {
  try {
    return await evaluate(code);
  } catch (e) {
    console.log(e);
    code = await modelCode.prompt(`\n ${e.message}\n\n fix the error.
Respond only with valid javascript code. NO explanations, NO markdown.`);
    code = prepareCode(code);
    say(`Error. ${e.message} Fix attempt ${attempt}:`, "code");
    say(code, "code");
    if(attempt < 3) {
      return await executeCode(code, modelCode, say, attempt + 1);
    } else {
      return { error: e.message };
    }
  }
}

async function prompt(create, prompt, say) {
  const modelCode = await create();
  const modelRespond = await create();
  const t0 = Date.now();

  const coderSystemPrompt = this.promptText;

  let code = await modelCode.prompt(`${coderSystemPrompt}
User: "${prompt}"
Code: `);
  say(code, "code");
  code = prepareCode(code);
  let data = await executeCode(code, modelCode, say);

  say(JSON.stringify(data), "code");

  const responderSystemPromptOnce = `
Request: "${prompt}"
Result Data:
${JSON.stringify(data)}

Rephrase the ResultData as an answer to the Request in a full sentence.

`;

  const result = await modelRespond.prompt(responderSystemPromptOnce);
  say(result);
  say(`took ${((Date.now() - t0) / 1000).toFixed(2)} sec.`, "code");
  modelRespond.destroy();
  modelCode.destroy();
}

export const coderWith = (promptText, name) => {
  return async (modelCreate) => {
    return { prompt: prompt.bind({ promptText }, modelCreate), name };
  };
};
