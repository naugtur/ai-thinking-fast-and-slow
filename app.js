import { $, htm$ } from "./ui-framework.js";
import { createThinkers } from "./thinkers/index.js";

const samples = [
  `How many r letters are there in 'rare strawberry arrangement' ?`,
  `Explain how antibiotics work in 2 sentences.`,
  `Name 3 important European kings`,
  `If I have 500$ and invest it on 1.2% yearly rate with monthly capitalization, how much do I get after 8 months?`,
  `What's the square root of 123?`,
  `What's 0.3 - 0.2?`,
];

function outputBlock($parent) {
  const $output = htm$("article");
  $parent.appendChild($output);
  return (text, cl) => {
    $output.appendChild(htm$("section", { text, attr: { class: cl } }));
  };
}

let thinkers;

async function go(prompt) {
  const $out = $("#out");
  $out.replaceChildren(htm$("i", { text: prompt }));
  const $output = htm$("div", { attr: { class: "out" } });
  $out.appendChild($output);

  for (const thinker of thinkers) {
    const say = outputBlock($output);
    say(thinker.name, "code");
    await thinker.prompt(prompt, say);
  }
}

async function init() {
  if (!LanguageModel?.create) {
    alert("The Built-in AI API (languageModel.create) is not available.");
    return;
  }

  const availability = await LanguageModel.availability();
  console.log("Model availability:", availability);

  if (availability !== "available") {
    alert(`Model is not available. Status: ${availability}`);
    return;
  }

  thinkers = await createThinkers();

  const $samples = $(".samples");
  samples.map((sample) => {
    $samples.appendChild(htm$("button", { text: sample }));
  });
  $samples.addEventListener("click", (e) => {
    const text = e.target.innerText;
    go(text);
  });
  const $input = $("#in");
  $input.focus();
  $input.addEventListener("keypress", (ev) => {
    if (ev.key === "Enter") {
      const prompt = $input.value;
      $input.value = "";
      go(prompt);
    }
  });
}

init();
