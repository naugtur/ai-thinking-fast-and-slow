export const $$ = (s) => Array.from(document.querySelectorAll(s));
export const $ = document.querySelector.bind(document);
export const htm$ = (type, { text, attr } = {}) => {
  const e = document.createElement(type);
  if (typeof text === "string") {
    e.innerText = text;
  }
  if (typeof attr === "object") {
    Object.entries(attr).map(([k, v]) => {
      e.setAttribute(k, v);
    });
  }
  return e;
};
