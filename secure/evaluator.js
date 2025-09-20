import "./ses.mjs";

lockdown();

export const evaluate = (code) => {
  const c = new Compartment({Math, Date, console, JSON, atob, btoa});

  // make declaring result optional
  return c.evaluate(`
var result; 
const out = (() => { 
  ${code};
  return result;
})();
out;`);
};
