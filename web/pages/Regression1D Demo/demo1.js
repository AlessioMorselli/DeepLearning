
var N, data, labels;
var ss = 30.0; // scale for drawing

var layer_defs, net, trainer;

// create neural net
var t = "layer_defs = [];\n\
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:1});\n\
layer_defs.push({type:'fc', num_neurons:15, activation:'relu'});\n\
layer_defs.push({type:'fc', num_neurons:15, activation:'sigmoid'});\n\
layer_defs.push({type:'regression', num_neurons:1});\n\
\n\
net = new convnetjs.Net();\n\
net.makeLayers(layer_defs);\n\
\n\
trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.0, batch_size:1, l2_decay:0.001});\n\
";

function reload() {
  //eval($("#layerdef").val());
  n1 = parseInt($("#n1").val());
  n2 = parseInt($("#n2").val());
  l_rate = parseFloat($("#l_rate").val());

  var layers_t = $('.layer_t').map(function() {
    return this.value;
  }).get();

  var layers_n = $('.layer_n').map(function() {
    return this.value;
  }).get();

  var layers_a = $('.layer_a').map(function() {
    return this.value;
  }).get();

  layer_defs = [];
  layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:1});
  for(var i=0; i<layers_t.length; i++) {
    layer_defs.push({type:layers_t[i], num_neurons:layers_n[i], activation:layers_a[i]});
  }
  //layer_defs.push({type:'fc', num_neurons:n1, activation:'relu'});
  //layer_defs.push({type:'fc', num_neurons:n1, activation:'sigmoid'});
  layer_defs.push({type:'regression', num_neurons:1});
  
  net = new convnetjs.Net();
  net.makeLayers(layer_defs);
  
  trainer = new convnetjs.SGDTrainer(net, {learning_rate:l_rate, momentum:0.0, batch_size:1, l2_decay:0.001});

}
 
function regen_data() {
  N = parseInt($("#num_data").val());
  data = [];
  labels = [];
  for(var i=0;i<N;i++) {
    var x = Math.random()*10-5;
    var y = x*Math.sin(x);
    data.push([x]);
    labels.push([y]);
  }
}

function myinit(){
  regen_data();
  //$("#layerdef").val(t);
  reload();
}
 
function update(){
  // forward prop the data
  
  var netx = new convnetjs.Vol(1,1,1);
  avloss = 0.0;

  for(var iters=0;iters<50;iters++) {
    for(var ix=0;ix<N;ix++) {
      netx.w = data[ix];
      var stats = trainer.train(netx, labels[ix]);
      avloss += stats.cost_loss;
    }
  }
  avloss /= N*iters;

}

function draw(){
    
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = "black";

    var netx = new convnetjs.Vol(1,1,1);

    // draw decisions in the grid
    var density= 5.0;
    var draw_neuron_outputs = $("#layer_outs").is(':checked');
    
    // draw final decision
    var neurons = [];
    ctx.beginPath();
    for(var x=0.0; x<=WIDTH; x+= density) {

      netx.w[0] = (x-WIDTH/2)/ss;
      var a = net.forward(netx);
      var y = a.w[0];

      if(draw_neuron_outputs) {
        neurons.push(net.layers[lix].out_act.w); // back these up
      }

      if(x===0) ctx.moveTo(x, -y*ss+HEIGHT/2);
      else ctx.lineTo(x, -y*ss+HEIGHT/2);
    }
    ctx.stroke();

    // draw individual neurons on first layer
    if(draw_neuron_outputs) {
      var NL = neurons.length;
      ctx.strokeStyle = 'rgb(250,50,50)';
      for(var k=0;k<NL;k++) {
        ctx.beginPath();
        var n = 0;
        for(var x=0.0; x<=WIDTH; x+= density) {
          if(x===0) ctx.moveTo(x, -neurons[n][k]*ss+HEIGHT/2);
          else ctx.lineTo(x, -neurons[n][k]*ss+HEIGHT/2);
          n++;
        }
        ctx.stroke();
      }
    }
  
    // draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(50,50,50)';
    ctx.lineWidth = 1;
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();

    // draw datapoints. Draw support vectors larger
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 1;
    for(var i=0;i<N;i++) {
      drawCircle(data[i]*ss+WIDTH/2, -labels[i]*ss+HEIGHT/2, 3.0);
    }

    ctx.fillStyle = "blue";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Avarage loss: " + avloss, 20, 20);
}

function mouseClick(x, y, shiftPressed){
  
  // add datapoint at location of click
  for(var i=0; i<data.length; i++) {
    if(data[i] - [(x-WIDTH/2)/ss] < 0.2 && data[i] - [(x-WIDTH/2)/ss] > -0.2) {
      return;
    }
  }

  data.push([(x-WIDTH/2)/ss]);
  labels.push([-(y-HEIGHT/2)/ss]);
  N += 1;

}

function keyDown(key){
}

function keyUp(key) {

}

$(function() {
    
});

var n_strati = 2;

function addLayer() {
  n_strati++;
  var strati = document.getElementById('layers');
  var divtest = document.createElement("div");
  divtest.innerHTML = 
  'Strato '+n_strati+'<br /> Tipo: <input class="layer_t" type="text" value="fc" /> Numero neuroni: <input class="layer_n" type="number" value="12" /> Attivazione: <input class="layer_a" type="text" value="relu" /> <br /><br /> ';

  strati.appendChild(divtest);
}