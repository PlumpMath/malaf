var marked = require("marked")
var fs = require("fs")
var exec = require('child_process').exec;

var styleFile = process.argv[3] || "style.css";

function compileFile(markdownFile) {
  var htmlFile = markdownFile + ".html";
  var pdfFile = markdownFile + ".pdf";

  var markdownSource = fs.readFileSync(markdownFile, "utf8");
  var htmlSource = "<html><head>";
  htmlSource += "<meta charset=\"utf8\">";
  htmlSource += "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + styleFile + "\">" ;
  htmlSource += "<script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>" ;
  htmlSource += "</head><body>" ;
  htmlSource += marked(markdownSource);
  htmlSource += "</body>" ;

  fs.writeFileSync(htmlFile, htmlSource);
  console.log("generated " + htmlFile);
  exec('wkhtmltopdf ' + htmlFile + " " + pdfFile, function (error, stdout, stderr) {
    console.log("generated " + pdfFile);
  });
}

compileFile(process.argv[2]);

fs.watch(process.argv[2], function(event) {
  if(event == "change")
    compileFile(process.argv[2]);
});