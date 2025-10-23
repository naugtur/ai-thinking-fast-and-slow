lockdown();

const evaluateSilent = (code, resultCallback) => {
  const askFetch = (url, options) => {
    if (confirm(`Allow code to fetch ${url} ?`)) {
      return fetch(url, options);
    } else {
      return Promise.reject(new Error("Fetch not allowed by user"));
    }
  };
  const c = new Compartment({
    resultCb: resultCallback,
    Math,
    Date,
    fetch: askFetch,
    console,
    JSON,
    atob,
    btoa,
  });

  Object.defineProperty(c.globalThis, "result", {
    get: () => {},
    set: (v) => {
      resultCallback(v);
    },
  });

  // make declaring result optional
  return c.evaluate(`
const out = (() => {
  ${code};
  return result;
})();
if(out) {
resultCb(out)
}`);
};

const evaluate = evaluateSilent;
export { evaluate };
