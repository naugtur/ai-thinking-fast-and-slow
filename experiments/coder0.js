let responderSystemPromptOnce = `Write an answer to the Q in full sentence. Always use Data for the answer.

Examples:
Q: "What's 44 divided by 17?"
Data:
{ result: 2.588235294117647 }
Answer:
When you adivide 44 by 17 you get 2.588235294117647

Q: "Who was Romulus?"
Data:
{ "romulus": ["king", "Rome", "first"] }
Answer:
Romulus was the first king of Rome

End of Examples.

`;

let coderSystemPrompt = `Convert user question to JavaScript code that solves it. Assign answer to 'result'.
Output ONLY JavaScript code. NO raw text, NO explanations, NO markdown.

Examples:

User: "What is 45 plus 67?"
Code:
result = { sum: 45 + 67 }

User: "How many letters u are in unbounded?"
Code:
result = {
  "letters u": \`unbounded\`.split('').filter(c => c === 'u').length
}

User: "How many times does D appear in unbounded?"
Code:
result = {
  "letters d": \`unbounded\`.match(/d/ig).length
}

User: "Is 'hello' longer than 3 characters?"
Code:
result = {
  "length": \`hello\`.length,
  "isLonger": \`hello\`.length > 3
}

User: "What's 15% of 200?"
Code:
result = { value: 200 * 0.15 }

User: "How many words in 'the quick brown fox'?"
Code:
result = {
  words: \`the quick brown fox\`.split(' ').length
}

User: "What is the third character of 'hello'?"
Code:
result = { character: \`hello\`[2] }

User: "If I invest $1000 at 5% interest for 3 years, compounded annually?"
Code:
var money = 1000;
var percent = 5/100;
for(let i=0; i<3; i++) {
    money *= percent
}
result = { money }

User: "What's the name of the first ruler of Rome?"
Code:
result = { name: \`Romulus\` }

User: "Explain why my throat hurts"
Code:
result = { elaborateOn: [\`Common colds or flu\`,\`Allergies\`,\`Dry air or smoke\`,\`Acid reflux\`] }

User: A movie theatre has 25 rows of seats with 20 seats in each row. How many seats are there in total?
Code:
var seats = 25*20;
result = { seatsTotal: seats }

End of Examples.

Convert user question to JavaScript code that solves it. Assign answer to 'result'.
Output ONLY JavaScript code. NO raw text, NO explanations, NO markdown.
`;

function prepareCode(code) {
  if (code.trim().startsWith("```")) {
    const lines = code.split("\n");
    lines.pop();
    lines.shift();
    code = lines.join("\n");
  }
  return `var result; \n${code};\n; return result`;
}

async function executeCode(code, modelCode, say, attempt = 1) {
  if (attempt > 3) {
    throw new Error('Max retry attempts reached');
  }
  try {
    const f = new Function(code);
    return f();
  } catch (e) {
    console.log("syntax error", e);
    code = await modelCode.prompt(`\n ${e}\n\n fix the error.
Respond only with valid javascript code. NO explanations, NO markdown.`);
    code = prepareCode(code);
    say("Error. Fix attempt " + attempt + ":", "code");
    say(code, "code");
    return executeCode(code, modelCode, say, attempt + 1);
  }
}

async function prompt(create, prompt, say) {
  const modelCode = await create();
  const modelRespond = await create();
  const t0 = Date.now();

  let code = await modelCode.prompt(`${coderSystemPrompt}
User: "${prompt}"
Code: `);
  say(code, "code");
  code = prepareCode(code);
  let data = await executeCode(code, modelCode, say);

  say(JSON.stringify(data), "code");
  const result = await modelRespond.prompt(`${responderSystemPromptOnce}
Write an answer to the Q with a full sentence. Use Data below.
Q: "${prompt}"
Data:
${JSON.stringify(data)}
Answer:
`);
  say(result);
  say(`took ${((Date.now() - t0) / 1000).toFixed(2)} sec.`, "code");
  modelRespond.destroy();
  modelCode.destroy();
}

export async function create(modelCreate) {
  return { prompt: prompt.bind(null, modelCreate), name: "coder0" };
}
