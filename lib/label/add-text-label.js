var util = require("../util");

module.exports = addTextLabel;

/*
 * Attaches a text label to the specified root. Handles escape sequences.
 */
function addTextLabel(root, node) {
  var cssMapping = node.cssMapping || {}      
  var regString = ""
  Object.keys(cssMapping).map(function(v,i){
      if(i===0){
        regString = '(\\'+v+'.*?\\'+v+')'
      }
      else{
        regString = regString + '|(\\'+v+'.*?\\'+v+')'
      }
  })    
  var cssReg = new RegExp(regString,'g')	

  var domNode = root.append("text");

  var lines = processEscapeSequences(node.label).split("\n");
  for (var i = 0; i < lines.length; i++) {
    var tspan = domNode
      .append("tspan")
        .attr("xml:space", "preserve")
        .attr("dy", "1em")
        .attr("x", "1");

        if(regString) {
          lines[i].split(cssReg).forEach(function(v){
            if(v){
              var allStr = v
              var classKey = allStr.slice(0,2)
              var content = allStr
              if(classKey && cssMapping[classKey]){
                content = allStr.slice(2,allStr.length-2)
              }
              tspan.append("tspan")
                .attr("class", cssMapping[classKey]||'')
                .text(content);
            }
          })
        }
        else {
          tspan.text(lines[i]);
        }
    
  }

  util.applyStyle(domNode, node.labelStyle);

  return domNode;
}

function processEscapeSequences(text) {
  var newText = "",
      escaped = false,
      ch;
  for (var i = 0; i < text.length; ++i) {
    ch = text[i];
    if (escaped) {
      switch(ch) {
        case "n": newText += "\n"; break;
        default: newText += ch;
      }
      escaped = false;
    } else if (ch === "\\") {
      escaped = true;
    } else {
      newText += ch;
    }
  }
  return newText;
}
