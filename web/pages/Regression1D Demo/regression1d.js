

var layer_defs, net, trainer;

// create neural net
var layer_defs = [];
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:1});
layer_defs.push({type:'fc', num_neurons:8, activation:'relu'});
layer_defs.push({type:'fc', num_neurons:8, activation:'sigmoid'});
layer_defs.push({type:'regression', num_neurons:1});

net = new convnetjs.Net();
net.makeLayers(layer_defs);

trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.0, batch_size:1, l2_decay:0.001});

var net = new convnetjs.Net();
net.makeLayers(layer_defs);

var draw_layers = new Array();

createDivLayers();
//createWeightArrows();

var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:10, l2_decay:0.001});

$(window).on("load", function() {
  for(var i=0; i<draw_layers.length-1; i++) {
    var l = draw_layers[i];
    var l_after = draw_layers[i+1];
    for(var j=0; j<l.part_draw.childNodes.length; j++) {
      for(var k=0; k<l_after.part_draw.childNodes.length; k++) {
        //drawConnector("a_"+i+j+"-"+(i+1)+k, l.part_draw.childNodes[j], l_after.part_draw.childNodes[k], Math.random()*4-0.5);
      }
    }
  }
});


function createWeightArrows() {
  var svg = document.getElementById("svg");
  
  for(var i=0; i<draw_layers.length-1; i++) {
    var l = draw_layers[i];
    var l_after = draw_layers[i+1];

    for(var j=0; j<l.part_draw.childNodes.length; j++) {
      for(var k=0; k<l_after.part_draw.childNodes.length; k++) {
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("fill", "none");
        g.setAttribute("stroke", "black");
        g.setAttribute("stroke-width", "1");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("id", "a_"+i+j+"-"+(i+1)+k);

        g.appendChild(path);
        svg.appendChild(g);
      }
    }
  }
}

function createDivLayers() {
  for(var i=0; i<net.layers.length; i++) {
    var L = net.layers[i];
    if(L.layer_type === "fc") continue;
    var section = createSection();
    section.part_text.innerHTML = L.layer_type + " : ( "+ L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ' )';
    for(var j=0; j<L.out_depth; j++) {section.part_draw.appendChild(createEmptyCanvas(64, 64, "white", "act-canvas"));}
  }
}

function createSection() {
  var div = document.getElementById("div-layers");

  var section = document.createElement("div");
  section.className = "section col-xs-12";

  var row = document.createElement("div");
  row.className = "row";

  var part_text = document.createElement("div");
  part_text.className = "col-xs-3 act-part-text";

  var part_draw_wrap = document.createElement("div");
  part_draw_wrap.className = "col-xs-9 act-part-draw wrap";

  var part_draw = document.createElement("div");
  part_draw.className = "fit-content";

  part_draw_wrap.appendChild(part_draw);

  row.appendChild(part_text);
  row.appendChild(part_draw_wrap);

  section.appendChild(row);
  div.appendChild(section);

  draw_layers.push({part_text:part_text, part_draw:part_draw});

  return {part_text:part_text, part_draw:part_draw};
}