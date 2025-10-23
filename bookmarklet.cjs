const bookmarklet = function ai() {
  const e = document.createElement("div");
  e.innerHTML = `<div class="box"><div class="samples"></div><input type="text" id="in" placeholder="prompt" /><div id="out"></div></div>`;
  e.id = "AIthinker";
  const sc = document.createElement("script");
  const stylrel = document.createElement("link");
  stylrel.rel = "stylesheet";
  stylrel.href = "http://localhost:8080/style.css";
  sc.type = "module";
  sc.innerText = `import("http://localhost:8080/secure/ses.mjs");import("http://localhost:8080/app.js")`;
  document.head.append(stylrel);
  document.body.append(e, sc);
};

const oneliner = `javascript:void (${bookmarklet.toString().replace(/[\n\r]/g, "")})()`;

const html = `<a href='${oneliner}'>AIthinker</a>`;

require("http")
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  })
  .listen(8888);
