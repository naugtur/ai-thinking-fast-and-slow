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

  // make declaring result optional
  return c.evaluate(code);
};

const evaluate = evaluateSilent;
export { evaluate };
