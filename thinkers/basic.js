async function prompt(create, prompt, say) {
  const modelR = await create();
  const t0 = Date.now();
  const result = await modelR.prompt(prompt);
  say(result);
  say(`took ${((Date.now() - t0) / 1000).toFixed(2)} sec.`, "code");
  modelR.destroy();
}

export async function create(modelCreate) {
  return { prompt: prompt.bind(null, modelCreate), name: 'basic' };
}
