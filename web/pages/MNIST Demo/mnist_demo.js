var testing_path = "test_data/";

var n_test_samples = 10000;

var div_train_data = document.getElementById("div-train-data");

var image_dimension = 28;
var image_channels = 1;
var scaleX, scaleY; scaleX = scaleY = 2;

var test_batch = new Array();
var stop = true;

var testAccWindow = new cnnutil.Window(n_test_samples);
var f2t = cnnutil.f2t;
var maxmin = cnnutil.maxmin;

var draw_layers = new Array();


// Load trained network
var net;
$.getJSON("net-trained.json", function(json) {
  net = new convnetjs.Net();
  net.fromJSON(json);

  createDivActivations(net, document.getElementById("div-activations"));
});

// Test image whenever the click is released
drawingpad.onDrawEnd = function() {
  testImage(drawingpad.canvas);
}

$("#clear_canvas").click( function() {
  drawingpad.clear();
  reset();
});

$(window).on("resize", function(){
  drawingpad.resize($("#draw-section").width());
});

$(window).on("load", function() {
  drawingpad.resize($("#draw-section").width());
  reset();
});

var wait = 100;
function initTest() {
  if(test_batch.length === 0) loadTestBatch();
  stop = false;
  test();
}

function loadTestBatch() {
  for(var i=0; i<n_test_samples; i++) {
    loadTestSample(i);
  }
}

function loadTestSample(n) {
  var img = new Image();
  img.onload = function() {
    test_batch.push({img:img, y:test_labels[n]});
    if(test_batch.length === n_test_samples) {
      console.log("Finito "+test_batch.length);
    }
  }
  img.src = testing_path+n+".png";
}

var n_test = 0;
function test() {
  if(stop) return;
  if(test_batch.length > 0) {
    var canvas = invertColors(test_batch[n_test].img);
    var x = convnetjs.img_to_vol(canvas, false);
    var data = {x:x, y:test_batch[n_test].y};
    testNet(data);

    n_test++;
    $("#ex-seen").text("Esempi visti: "+n_test);

    setTimeout(test, wait);
  } else {
    setTimeout(test, 200);
  }
}

function testNet(data) {
  var out = net.forward(data.x);

  var yhat = net.getPrediction();
  var train_acc = yhat === data.y ? 1.0 : 0.0;
  testAccWindow.add(train_acc);

  drawInput(net);
  drawPreds(out, net, data.y, true);

  $("#accuracy").text("Accuratezza: "+f2t(testAccWindow.get_average()));

  drawLayers();
}

function stopTest() {
  stop = true;
}

function testImage(canvas) {
  canvas = removeBlanks(canvas, 0.2);
  canvas = resize(canvas, image_dimension, image_dimension);
  //canvas = invertColors(canvas);

  var x = convnetjs.img_to_vol(canvas, false);
  var out = net.forward(x);

  drawInput(net);
  drawPreds(out, net);
  //drawActivations(net);
  drawLayers();
}

function reset() {
  // Reset input canvas
  var canvas = document.getElementById("input-canvas");
  canvas.width = image_dimension*3;
  canvas.height = image_dimension*3;
  canvas.class = "round-canvas";
  clearCanvas(canvas, "white");
  // Reset predictions
  for(var i=0; i<3; i++) {
    $("#td_"+i).text("");
    var probscanv = document.getElementById('prob_'+i);
    $("#prob_"+i).animate({width:0}, 200);
  }
  // Reset draw activations
  for(var i=0; i<draw_layers.length; i++) {
    for(var j=0; j<draw_layers[i].part_draw.childNodes.length; j++) {
      clearCanvas(draw_layers[i].part_draw.childNodes[j]);
    }
  }
}

function drawInput(net) {
  var input = document.getElementById("input-canvas");
  var canvas = volToImgs(net.layers[0].out_act, 3, 3, 1)[0];
  var input_ctx = input.getContext("2d");
  input_ctx.clearRect(0, 0, input.width, input.height);
  input_ctx.drawImage(canvas, 0, 0, input.width, input.height, 0, 0, input.width, input.height);
}

function drawPreds(out, net, y, fast_mode) {
  var section = document.getElementById("pred-section");

  // get predictions and sort them by probability
  var preds =[]
  for(var k=0;k<out.w.length;k++) { preds.push({k:k,p:out.w[k]}); }
  preds.sort(function(a,b){return a.p<b.p ? 1:-1;});

  for(var k=0;k<3;k++) {
    var col = '#C81D11'; // Red
    if(k === 0) {
      if(y == undefined || preds[k].k === y) col = '#4CBB17'; // Green
    } else if(k === 1 || k === 2) {
      col = "#F4C430"; // yeallow
    }

    $("#td_"+k).text(preds[k].k);

    var probscanv = document.getElementById('prob_'+k);
    probscanv.setAttribute("style", "height: 8px; border-radius:2px; background-color:" + col + ";");
    if(fast_mode) $("#prob_"+k).width(Math.floor(preds[k].p/1*80));
    else $("#prob_"+k).animate({width:Math.floor(preds[k].p/1*80)}, 200);
    //probsdiv.innerHTML = t;
  }
}

function stop() {
  stop = true;
}

function createDivActivations(net, div) {
  // Prendo la rete e guardo quanti layers ha
  // Il layer 'input' è formato da un solo canvas e una sola part
  // Il layer 'conv' seguito dal layer 'relu' è formato da N = depth canvas
  // Il layer 'pool' è formato da N = depth canvas con scale = scale*sx
  // Il layer 'fc' seguito dal layer 'relu' hanno scaleY = 10*scaleX
  // Il layer 'softmax' è segnato dai numeri
  
  for(var i=0; i<net.layers.length; i++) {
    var L = net.layers[i];
    switch(L.layer_type) {
      case 'input':
        addActSection(div);
        var t = "<b>Strato Input</b> ";
        t += '(' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth +")";
        draw_layers[i].part_text.innerHTML = t;
        draw_layers[i].part_draw.appendChild(createEmptyCanvas(L.out_sx*scaleX, L.out_sy*scaleY, "white", "act-canvas"));
        break;
      case 'conv':
        addActSection(div);
        var t = "<b>Str. Convoluzionale</b> ";
        t += '(' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ")</br>";
        t += "Numero filtri: "+L.out_depth + "</br>";
        t += "Dimensione filtri: "+ L.filters[0].sx + 'x' + L.filters[0].sy + 'x' + L.filters[0].depth + "</br>";
        draw_layers[i].part_text.innerHTML = t;
        for(var c=0; c<L.out_depth; c++) {
          draw_layers[i].part_draw.appendChild(createEmptyCanvas(L.out_sx*scaleX, L.out_sy*scaleY, "white", "act-canvas"));
        }
      break;
      case 'pool':
        addActSection(div);
        var t = "<b>Str. Pooling</b>";
        t += ' (' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ')</br>';
        t += "Dimensione pooling: "+L.sx + 'x' + L.sy;
        draw_layers[i].part_text.innerHTML = t;
        for(var c=0; c<L.out_depth; c++) {
          draw_layers[i].part_draw.appendChild(createEmptyCanvas(L.out_sx*L.sx*scaleX, L.out_sy*L.sy*scaleY, "white", "act-canvas"));
        }
      break;
      case 'fc':
        addActSection(div);
        var t = "<b>Str. Completamente connesso</b></br>";
        t += ' (' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ')';
        draw_layers[i].part_text.innerHTML = t;
        for(var c=0; c<L.out_depth; c++) {
          draw_layers[i].part_draw.appendChild(createEmptyCanvas(7, 7, "white", ""));
        }
      break;
      case 'relu':
        addActSection(div);
        var t = '<b>Strato ReLu</b> (' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ')';
        draw_layers[i].part_text.innerHTML = t;

        // Use the same parameters of the canvas of the last layer
        var last_layer_canvas = draw_layers[i-1].part_draw.childNodes[0];
        for(var c=0; c<L.out_depth; c++) {
          draw_layers[i].part_draw.appendChild(createEmptyCanvas(last_layer_canvas.width, last_layer_canvas.height, "white", last_layer_canvas.className));
        }
        break;
      case 'softmax':
        addActSection(div);
        var t = "<b>Strato Softmax</b></br>";
        t += 'Numero classi: '+L.out_depth;
        draw_layers[i].part_text.innerHTML = t;
        for(var c=0; c<L.out_depth; c++) {
          draw_layers[i].part_draw.appendChild(createEmptyCanvas(scaleX*8, scaleY*8, "white", "act-canvas"));
        }
      break;
      default: break;
    }
  }
}

function addActSection(div) {
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

  draw_layers.push({part_text:part_text, part_draw:part_draw});

  div.appendChild(section);
}

function drawLayers() {
  for(var i=0; i<draw_layers.length; i++) {
    var L = net.layers[i];
    var out = L.out_act;

    var max_d = 1000;
    var sx = scaleX;
    var sy = scaleY;
    if(net.layers[i].layer_type === 'input') max_d = 1;
    if(net.layers[i].layer_type === 'pool') sx = sy = scaleX*net.layers[i].sx;

    var activations = volToImgs(out, sx, sy, max_d);
    for(var j=0; j<draw_layers[i].part_draw.childNodes.length; j++) {
      var context = draw_layers[i].part_draw.childNodes[j].getContext("2d");
      context.drawImage(activations[j], 0, 0, activations[j].width, activations[j].height, 0, 0, draw_layers[i].part_draw.childNodes[j].width, draw_layers[i].part_draw.childNodes[j].height);
    }
  }
}

function volToImgs(A, sx, sy, max_depth) {
  var imgArray = new Array();
  var mm = maxmin(A.w);

  var max_d = A.depth;
  max_d = (A.depth > max_depth) ? max_depth : A.depth;

  for(var d=0;d<max_d;d++) {
    var canv = document.createElement('canvas');
    var W = A.sx * sx;
    var H = A.sy * sy;
    canv.width = W;
    canv.height = H;
    var ctx = canv.getContext('2d');
    var g = ctx.createImageData(W, H);

    for(var x=0;x<A.sx;x++) {
      for(var y=0;y<A.sy;y++) {
        var dval = Math.floor((A.get(x,y,d)-mm.minv)/mm.dv*255);
        for(var dx=0;dx<sx;dx++) {
          for(var dy=0;dy<sy;dy++) {
            var pp = ((W * (y*sy+dy)) + (dx + x*sx)) * 4;
            for(var i=0;i<3;i++) { g.data[pp + i] = dval; } // rgb
            g.data[pp+3] = 255; // alpha channel
          }
        }
      }
    }
    ctx.putImageData(g, 0, 0);

    imgArray.push(canv);
  }

  return imgArray;
}