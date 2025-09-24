const evaluator = new Function(`
  with (this.scopeTerminator) {
    with (this.globalObject) {
        with (this.evalScope) {
          var result; 
          const out = (async function() {
            'use strict'; 
            eval(arguments[0]);
            return result;
          })(this.code);
          return out;
        }
      }
    }
`);

window.evaluatorAsk = async (code) => {
  return evaluator.call(
    {
      evalScope: Object.freeze(
        Object.defineProperty(Object.create(null), "eval", {
          get: Array.prototype.pop.bind([eval]),
        })
      ),
      scopeTerminator: new Proxy(async function () {}, {
        has: (_, prop) => true,
        get: (_, prop) => {
          if (prop === Symbol.unscopables) return Object.create(null);
          return window.confirm(`Access ${prop}?`) ? window[prop] : undefined;
        },
      }),
      globalObject: {},
      code,
    },
    code
  );
};
