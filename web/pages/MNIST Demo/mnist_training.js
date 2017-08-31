var t = "layer_defs = [];\n\
layer_defs.push({type:'input', out_sx:28, out_sy:28, out_depth:1});\n\
layer_defs.push({type:'conv', sx:5, filters:10, stride:1, pad:0, activation:'relu'});\n\
layer_defs.push({type:'pool', sx:3, stride:3});\n\
layer_defs.push({type:'fc', num_neurons:80, activation: 'relu'});\n\
layer_defs.push({type:'dropout'});\n\
layer_defs.push({type:'softmax', num_classes:10});\n\
\n\
net = new convnetjs.Net();\n\
net.makeLayers(layer_defs);\n\
\n\
trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:32, l2_decay:0.001});\n\
\n\
epochs = 5;\n\
";

var training_path = "train_data/";
var train_batch = new Array();

var stop = false;

$(window).load(function() {
  $("#newnet").val(t);
  eval($("#newnet").val());
});

function loadDataset(tot) {
  train_batch = new Array();
  $("#btn-start").prop("disabled", true);
  for(var i=0; i<tot; i++) {
    loadImage(i, tot);
  }
}

function loadImage(i, tot) {
  var img = new Image();
  img.onload = function() {
    var canvas = invertColors(img);
    train_batch.push({img:canvas, y:train_labels[i]});
    updateLoadingProgress(tot);
  }
  img.src = training_path+i+".png";
}

var train_prog = 0;
var current_epoch = 0;
var xLossWindow = new cnnutil.Window(100);
var wLossWindow = new cnnutil.Window(100);
var trainAccWindow = new cnnutil.Window(100);
var f2t = cnnutil.f2t;

function startTraining() {
  resetAll();
  trainNet();
}

function trainNet() {
  if(stop) return;
  if(current_epoch < epochs) {
    if(train_prog<train_batch.length) {
      var x = convnetjs.img_to_vol(train_batch[train_prog].img, false);
      var data = {x:x, y:train_batch[train_prog].y};
      var stats = trainer.train(data.x, data.y);


      var yhat = net.getPrediction();
      var train_acc = yhat === data.y ? 1.0 : 0.0;
      trainAccWindow.add(train_acc);

      updateTrainingProgress(train_prog);
      updateStats(stats);

      train_prog++;
      setTimeout(trainNet, 0);
    } else {
      current_epoch++;
      train_prog = 0;
      setTimeout(trainNet, 0);
    }
  }
}

function stopTraining() {
  stop = !stop;
  if(stop) $("#btn-stop").text("Riprendi");
  else {
    $("#btn-stop").text("Stop");
    trainNet();
  } 
}

function changeNet() {
  eval($("#newnet").val());
  resetAll();
}

function showNetJSON() {
  var p = document.getElementById("trained-net-json");
  p.value = JSON.stringify(this.net.toJSON());
}

function resetAll() {
  trainer = new convnetjs.SGDTrainer(net, {learning_rate:trainer.learning_rate, momentum:trainer.momentum, batch_size:trainer.batch_size, l2_decay:trainer.l2_decay});
  train_prog = 0;
  current_epoch = 0;
  $("#training-progress").text("");
  
  xLossWindow.reset();
  wLossWindow.reset();
  trainAccWindow.reset();

  $("#fwd-time").text(t);
  var t = 'Backprop time per esempio: ';
  $("#bwd-time").text(t);
  var t = 'Classification loss: ';
  $("#x-loss").text(t);
  var t = 'L2 Weight decay loss: ';
  $("#w-loss").text(t);
  var t = 'Training accuracy: ';
  $("#train-acc").text(t);
  var t = 'Examples seen: ';
  $("#ex-tot").text(t);
}

function updateLoadingProgress(tot) {
  $("#loading-progress").text("Caricate "+train_batch.length +" di "+tot);
  if(train_batch.length >= tot) {
    $("#loading-progress").text("Caricamento completato");
    $("#btn-start").prop("disabled", false);
  }
}

function updateTrainingProgress(i) {
  $("#training-progress").text("Allenate "+(i+1)+" di "+train_batch.length+ " (Epoca "+(current_epoch+1)+" di "+epochs+")");
  if(i >= train_batch.length-1 && current_epoch >= epochs-1) $("#training-progress").text("Allenamento completato");
}

function updateStats(stats) {
  var lossx = stats.cost_loss;
  var lossw = stats.l2_decay_loss;
  xLossWindow.add(lossx);
  wLossWindow.add(lossw);

  var t = 'Forward time per esempio: ' + stats.fwd_time + 'ms';
  $("#fwd-time").text(t);
  var t = 'Backprop time per esempio: ' + stats.bwd_time + 'ms';
  $("#bwd-time").text(t);
  var t = 'Classification loss: ' + f2t(xLossWindow.get_average());
  $("#x-loss").text(t);
  var t = 'L2 Weight decay loss: ' + f2t(wLossWindow.get_average());
  $("#w-loss").text(t);
  var t = 'Training accuracy: ' + f2t(trainAccWindow.get_average());
  $("#train-acc").text(t);
  var t = 'Examples seen: ' + (current_epoch*train_batch.length+train_prog+1);
  $("#ex-tot").text(t);
}