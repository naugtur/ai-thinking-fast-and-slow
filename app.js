import { $, htm$ } from "./ui-framework.js";
import { createThinkers, getThinkers } from "./thinkers/index.js";

const samples = [
  `How many r letters are there in 'Triangular strawberry arrangement' ?`,
  `What's heavier? A kilogram of stones or 1024 grams of cotton?`,
  `What's the first title on the page https://en.wikipedia.org/wiki/Talk:Hummingbird?`,
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

  thinkers = await createThinkers(null, [
    getThinkers().createRegular,
    getThinkers().createCoder2,
  ]);

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
