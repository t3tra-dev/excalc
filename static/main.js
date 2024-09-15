let pyodide;

const updatePreview = () => {
  const editor = document.getElementById("editor");
  const preview = document.getElementById("preview");
  const latex = editor.value;

  preview.innerHTML = "";
  MathJax.texReset();
  MathJax.typesetClear();

  const node = MathJax.tex2svgPromise(latex);
  node.then((svg) => {
    preview.appendChild(svg);
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
  });
};

const updateResult = (latex) => {
  const result = document.getElementById("result-preview");

  result.innerHTML = "";
  MathJax.texReset();
  MathJax.typesetClear();

  const node = MathJax.tex2svgPromise(latex);
  node.then((svg) => {
    result.appendChild(svg);
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
  });
};

const clearLog = () => {
  const log = document.getElementById("log-preview");
  log.value = "";
};

const copyInput = () => {
  const editor = document.getElementById("editor");
  navigator.clipboard.writeText(editor.value);
};

const copyLink = () => {
  const editor = document.getElementById("editor");
  const shareURL = window.location.origin + window.location.pathname +
    "?share=" + btoa(editor.value);
  navigator.clipboard.writeText(shareURL);
};

const download = () => {
  const node = MathJax.tex2svgPromise(editor.value);
  node.then((obj) => {
    var data = new XMLSerializer().serializeToString(obj.childNodes[0]);
    var uri = "data:image/svg+xml;charset=utf-8;," + encodeURIComponent(data);
    var a = document.createElement("a");
    a.download = "LaTeX.svg";
    a.href = uri;
    a.click();
    a.remove();
  });
};

const simplify = () => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import simplify, latex
from sympy.parsing.latex import parse_latex

latex(simplify(parse_latex("${editor.value.replace("\\", "\\\\")}")))`);
  console.log(res);
  updateResult(res);
};

const solve = (arg) => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import solve, latex
from sympy.parsing.latex import parse_latex

latex(solve(parse_latex("${
    editor.value.replace("\\", "\\\\")
  }"), parse_latex("${arg}")))`);
  console.log(res);
  updateResult(res);
};

const expand = () => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import expand, latex
from sympy.parsing.latex import parse_latex

latex(expand(parse_latex("${editor.value.replace("\\", "\\\\")}")))`);
  console.log(res);
  updateResult(res);
};

const factor = () => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import factor, latex
from sympy.parsing.latex import parse_latex

latex(factor(parse_latex("${editor.value.replace("\\", "\\\\")}")))`);
  console.log(res);
  updateResult(res);
};

const apart = () => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import apart, latex
from sympy.parsing.latex import parse_latex

latex(apart(parse_latex("${editor.value.replace("\\", "\\\\")}")))`);
  console.log(res);
  updateResult(res);
};

const trigsimp = () => {
  const editor = document.getElementById("editor");

  var res = pyodide.runPython(`
from sympy import trigsimp, latex
from sympy.parsing.latex import parse_latex

latex(trigsimp(parse_latex("${editor.value.replace("\\", "\\\\")}")))`);
  console.log(res);
  updateResult(res);
};

document.addEventListener("DOMContentLoaded", function (event) {
  var p = new URLSearchParams(window.location.search);
  if (p.has("share")) {
    code = atob(p.get("share"));
    console.log(`shared: ${code}`);
    document.getElementById("editor").value = code;
  }
  updatePreview();

  document.getElementById("log-preview").value = "[INFO] Initializing...";

  async function pyodideMain() {
    pyodide = await loadPyodide();
    await pyodide.runPython(`
import js
log = js.document.getElementById('log-preview')
log.value += '\\n[INFO] pyodide loaded'
`);
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await pyodide.runPython(`
import js
log = js.document.getElementById('log-preview')
log.value += '\\n[INFO] micropip loaded'
`);
    await micropip.install("sympy");
    await pyodide.runPython(`
import js
log = js.document.getElementById('log-preview')
log.value += '\\n[INFO] sympy loaded'
`);
    await micropip.install("antlr4-python3-runtime==4.11");
    await pyodide.runPython(`
import js
log = js.document.getElementById('log-preview')
log.value += '\\n[INFO] antlr4-python3-runtime loaded'
`);
    await pyodide.runPython(`
import js

from sympy import latex, expand
from sympy.parsing.latex import parse_latex

latex(expand(parse_latex('x^2+y^2')))

log = js.document.getElementById('log-preview')
log.value += '\\n[INFO] test passed\\n[INFO] Ready!'
`)
    document.getElementById("funcs").querySelectorAll("button").forEach(
      (btn) => {
        if (btn.hasAttribute("disabled")) btn.removeAttribute("disabled");
      },
    );
  }
  pyodideMain();
});
