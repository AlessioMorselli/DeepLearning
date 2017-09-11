var N, data, labels;
var ss = 24;
var n_size = 64;
var net, trainer;
var stop = true;
var nnt = document.getElementById("nnt");
var epochs = 0;

var layer_params = [];
layer_params.push({neurons: 4});
layer_params.push({neurons: 2});
var net_params = {activation:'tanh', learning_rate:0.01, reg:"l2", decay:0.001};

$(window).on("load", function() {
  NPGinit(24);
});

function myinit() {
  regen_data();
  initNeuralNetwork();
  initNeuronsDraw();
  initLinks();
}

function update(iters) {
  if(typeof iters === "undefined") iters = 5;
  if (stop) return;
  // forward prop the data

  var netx = new convnetjs.Vol(1, 1, 1);

  avloss = 0.0;
  for(var i=0; i<iters; i++) {
    for (var ix = 0; ix < N; ix++) {
        netx.w = data[ix];
        var stats = trainer.train(netx, labels[ix]);
        avloss += stats.loss;

    }
    epochs++;
    document.getElementById("iter-number").innerHTML = pad(epochs, 6);
  }

  avloss /= N * iters;
}

function draw() {
  drawOutput();
  drawLinks();
}

function initNeuralNetwork() {
  epochs = 0;
  document.getElementById("iter-number").innerHTML = pad(epochs, 6);
  // create neural net
  var layer_defs = [];
  layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 1 });
  for(var i=0; i<layer_params.length; i++) {
    layer_defs.push({ type: 'fc', num_neurons: layer_params[i].neurons, activation: net_params.activation });
  }
  layer_defs.push({ type: 'regression', num_neurons: 1 });

  net = new convnetjs.Net();
  net.makeLayers(layer_defs);

  console.log(net.layers);
  
  if(net_params.reg === "l1") trainer = new convnetjs.SGDTrainer(net, { learning_rate: net_params.learning_rate, momentum: 0.0, batch_size: 1, l1_decay: net_params.decay});
  else if(net_params.reg === "l2") trainer = new convnetjs.SGDTrainer(net, { learning_rate: net_params.learning_rate, momentum: 0.0, batch_size: 1, l2_decay: net_params.decay});
  else trainer = new convnetjs.SGDTrainer(net, { learning_rate: net_params.learning_rate, momentum: 0.0, batch_size: 1});
}

function initNeuronsDraw() {
  getTableBody(nnt).innerHTML = "";
  getTableHead(nnt).children[0].innerHTML = "";

  document.getElementById("layers_number").innerHTML = "<b>"+layer_params.length+"</b> strati";

  var c = 0;
  for (var i = 0; i < net.layers.length - 1; i++) {
    var L = net.layers[i]; if (L.layer_type === "fc") continue;
    if(getNumberColumns(nnt) < c+1) {
      addColumn(nnt);
    }
    for (var j = 0; j < L.out_depth; j++) {
      if(getColumn(nnt, c).length < j+1) {
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = n_size;
        canvas.className = "act-canvas";
        push(nnt, canvas, c);
      }
    }
    c++;
  }

  for(var i=0; i<getNumberColumns(nnt); i++) {
    var t = "";
    if(i===0) t = "<b>Input</b><br/><b>1</b> neurone";
    else {
      var acts = ["relu", "sigmoid", "tanh"];
      t = "<button class='btn btn-default' onclick='removeNeuron("+i+");'><i class='glyphicon glyphicon-minus'></i></button>";
      t += "<button class='btn btn-default' onclick='addNeuron("+i+");'><i class='glyphicon glyphicon-plus'></i></button><br/>";
      t += "<b>"+getColumn(nnt, i).length+"</b> neuroni<br/>";
    }
    setColumnHeader(nnt, t, i);
  }
}

function initLinks() {
  var svg = document.getElementById("svg");
  svg.innerHTML = "";
  
  // links neuron-neuron
  var cells = getCells(nnt);
  for (var i = 0; i < cells.length - 1; i++) {
    var col = cells[i];
    var col_after = cells[i + 1];

    for (var j = 0; j < col.length; j++) {
      for (var k = 0; k < col_after.length; k++) {
        if(document.getElementById("a_" + i + j + "-" + (i + 1) + k) === null) {
          var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          g.setAttribute("fill", "none");
          g.setAttribute("stroke", "black");
          g.setAttribute("stroke-width", "1");
          var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("id", "a_" + i + j + "-" + (i + 1) + k);

          g.appendChild(path);
          svg.appendChild(g);
        }
      }
    }
  }
  
  // Links neuron-output
  var col = cells[cells.length - 1];
  var out_canvas = document.getElementById("NPGcanvas");
  for (var i = 0; i < col.length; i++) {
    if(document.getElementById("o_" + i) === null) {
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("fill", "none");
      g.setAttribute("stroke", "black");
      g.setAttribute("stroke-width", "1");
      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("id", "o_" + i);

      g.appendChild(path);
      svg.appendChild(g);
    }
  }
}

function drawLinks() {
  // Arrows neuron-neuron
  var cells = getCells(nnt);
  var l = 0;
  for (var i = 0; i < cells.length - 1; i++) {
    var col = cells[i];
    var col_after = cells[i + 1];
    for (var j = 0; j < col.length; j++) {
      for (var k = 0; k < col_after.length; k++) {
        var net_layer = net.layers[l];
        if (net_layer.layer_type !== "regression" && net_layer.layer_type !== "fc") {
            net_layer = net.layers[l+1];
            var weight = net_layer.filters[k].w[j];
            drawConnector("a_" + i + j + "-" + (i + 1) + k, col[j], col_after[k], weight, stop);
        }
      }
    }
    l+=2;
  }
  // Links neuron-output
  var col = cells[cells.length - 1];
  var out_canvas = document.getElementById("NPGcanvas");
  for (var i = 0; i < col.length; i++) {
      var net_layer = net.layers[net.layers.length - 2];
      var weight = net_layer.filters[0].w[i];
      drawConnector("o_" + i, col[i], out_canvas, weight, stop);
  }
}

function addLayer() {
  if(layer_params.length >= 6) return;
  layer_params.push({neurons:4});
  initNeuralNetwork();
  initNeuronsDraw();
  initLinks();
}

function removeLayer() {
  if(layer_params.length <= 1) return;
  layer_params.pop();
  initNeuralNetwork();
  initNeuronsDraw();
  initLinks();
}

function addNeuron(col) {
  if(layer_params[col-1].neurons >= 8) return;
  layer_params[col-1].neurons++;
  initNeuralNetwork();
  initNeuronsDraw();
  initLinks();
}

function removeNeuron(col) {
  if(layer_params[col-1].neurons <= 1) return;
  layer_params[col-1].neurons--;
  initNeuralNetwork();
  initNeuronsDraw();
  initLinks();
}

function changeActivation(act) {
  net_params.activation = act;
  initNeuralNetwork();
}

function changeLearningRate(lr) {
  net_params.learning_rate = lr;
  initNeuralNetwork();
}

function changeReg(reg) {
  net_params.reg = reg;
  initNeuralNetwork();
}

function changeDecay(decay) {
  net_params.decay = decay;
  initNeuralNetwork();
}

function reset() {
  regen_data();
  initNeuralNetwork();
  stop = true;
  var btn_stop = document.getElementById("btn-stop");
  if(stop) {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
  } else {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-pause'></i>";
  }
}

function step() {
  stop = false;
  update(1);
  stop = true;
  var btn_stop = document.getElementById("btn-stop");
  if(stop) {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
  } else {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-pause'></i>";
  }
}

function regen_data() {
    N = 10;
    data = [];
    labels = [];
    for (var i = 0; i < N; i++) {
        var x = Math.random() * 10 - 5;
        var y = x * Math.sin(x);
        data.push([x]);
        labels.push([y]);
    }
}

function mouseClick(x, y, shiftPressed){
  console.log(x+", "+y);
  // add datapoint at location of click
  data.push([(x-WIDTH/2)/ss]);
  labels.push([-(y-HEIGHT/2)/ss]);
  N += 1;

}

function drawOutput() {
  var cells = getCells(nnt);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "black";

  var netx = new convnetjs.Vol(1, 1, 1);

  var density = 5.0;

  var neurons = [cells.length];
  for (var i = 0; i < cells.length; i++) {
      neurons[i] = new Array();
  }

  ctx.beginPath();
  for (var x = 0.0; x <= WIDTH; x += density) {

      netx.w[0] = (x - WIDTH / 2) / ss;
      var a = net.forward(netx);
      var y = a.w[0];

      if (x === 0) ctx.moveTo(x, -y * ss + HEIGHT / 2);
      else ctx.lineTo(x, -y * ss + HEIGHT / 2);

      var l=0;
      for (var i = 0; i < neurons.length; i++) {
        if(net.layers[l].layer_type === "fc") l++;
        var ws = [].slice.call(net.layers[l].out_act.w);
        neurons[i].push(ws);
        l++;
      }
  }
  ctx.stroke();

  for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[i].length; j++) {
          var ncanvas = cells[i][j];
          var nctx = ncanvas.getContext("2d");
          
          nctx.clearRect(0, 0, n_size, n_size);

          nctx.strokeStyle = 'rgb(250,50,50)';
          nctx.lineWidth = 1;
          nctx.beginPath();
          var n = 0;
          for (var x = 0.0; x <= n_size; x += 1) {
              if (x === 0) nctx.moveTo(x, -neurons[i][n][j] * 5 + n_size / 2);
              else nctx.lineTo(x, -neurons[i][n][j] * 5 + n_size / 2);
              n++;
          }
          nctx.stroke();

      }
  }

  // draw axes
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(140,140,140)';
  ctx.lineWidth = 0.5;
  ctx.moveTo(0, HEIGHT / 2);
  ctx.lineTo(WIDTH, HEIGHT / 2);
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();

  // draw datapoints. Draw support vectors larger
  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.lineWidth = 1;
  for (var i = 0; i < N; i++) {
      drawCircle(data[i] * ss + WIDTH / 2, -labels[i] * ss + HEIGHT / 2, 4.0);
  }
}

function drawArrows(stop) {
    // Arrows neuron-neuron
    for (var i = 0; i < draw_layers.length - 1; i++) {
        var l = draw_layers[i];
        var l_after = draw_layers[i + 1];
        for (var j = 0; j < l.part_draw.childNodes.length; j++) {
            for (var k = 0; k < l_after.part_draw.childNodes.length; k++) {
                var net_layer = net.layers[l.net_layer];
                if (net_layer.layer_type === "input" || net_layer.layer_type === "tanh") {
                    net_layer = net.layers[l.net_layer + 1];
                    var weight = net_layer.filters[k].w[j];
                    drawConnector("a_" + i + j + "-" + (i + 1) + k, l.part_draw.childNodes[j], l_after.part_draw.childNodes[k], weight, stop);
                }
            }
        }
    }
    // Arrows neuron-output
    var l = draw_layers[draw_layers.length - 1];
    var out_canvas = document.getElementById("NPGcanvas");
    for (var i = 0; i < l.part_draw.childNodes.length; i++) {
        var net_layer = net.layers[net.layers.length - 2];
        var weight = net_layer.filters[0].w[i];
        drawConnector("o_" + i, l.part_draw.childNodes[i], out_canvas, weight, stop);
    }
}

function createWeightArrows() {
    var svg = document.getElementById("svg");

    // arrows neuron-neuron
    for (var i = 0; i < draw_layers.length - 1; i++) {
        var l = draw_layers[i];
        var l_after = draw_layers[i + 1];

        for (var j = 0; j < l.part_draw.childNodes.length; j++) {
            for (var k = 0; k < l_after.part_draw.childNodes.length; k++) {
                var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                g.setAttribute("fill", "none");
                g.setAttribute("stroke", "black");
                g.setAttribute("stroke-width", "1");
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("id", "a_" + i + j + "-" + (i + 1) + k);

                g.appendChild(path);
                svg.appendChild(g);
            }
        }
    }
    // Arrows neuron-output
    var l = draw_layers[draw_layers.length - 1];
    var out_canvas = document.getElementById("NPGcanvas");
    for (var i = 0; i < l.part_draw.childNodes.length; i++) {
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("fill", "none");
        g.setAttribute("stroke", "black");
        g.setAttribute("stroke-width", "1");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("id", "o_" + i);

        g.appendChild(path);
        svg.appendChild(g);
    }
}

function createDivLayers() {
    for (var i = 0; i < net.layers.length - 1; i++) {
        var L = net.layers[i];
        if (L.layer_type === "fc") continue;
        var section = createSection(i);
        section.part_text.innerHTML = L.layer_type + " : ( " + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ' )';
        for (var j = 0; j < L.out_depth; j++) { section.part_draw.appendChild(createEmptyCanvas(n_size, n_size, "white", "act-canvas")); }
    }
}

function createSection(net_layer) {
    var div = document.getElementById("div-layers");

    var section = document.createElement("div");
    section.className = "section col-xs-12";

    var row = document.createElement("div");
    row.className = "row";

    var part_text = document.createElement("div");
    part_text.className = "col-xs-2 act-part-text";

    var part_draw_wrap = document.createElement("div");
    part_draw_wrap.className = "col-xs-10 wrap";

    var part_draw = document.createElement("div");
    part_draw.className = "fit-content";

    part_draw_wrap.appendChild(part_draw);

    row.appendChild(part_text);
    row.appendChild(part_draw_wrap);

    section.appendChild(row);
    div.appendChild(section);

    draw_layers.push({ net_layer: net_layer, part_text: part_text, part_draw: part_draw });

    return { part_text: part_text, part_draw: part_draw };
}

function stopTime() {
  stop = !stop;
  var btn_stop = document.getElementById("btn-stop");
  if(stop) {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-play'></i>";
  } else {
    btn_stop.innerHTML = "<i class='glyphicon glyphicon-pause'></i>";
  }
}

function pad(num, size){
  var s = ('000000000' + num).substr(-size);
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}