var N, data, labels;
var ss = 30;
var n_size = 80;
var layer_defs, net, trainer;

// create neural net
var layer_defs = [];
layer_defs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 1 });
layer_defs.push({ type: 'fc', num_neurons: 4, activation: 'tanh' });
layer_defs.push({ type: 'fc', num_neurons: 2, activation: 'tanh' });
layer_defs.push({ type: 'regression', num_neurons: 1 });

net = new convnetjs.Net();
net.makeLayers(layer_defs);

trainer = new convnetjs.SGDTrainer(net, { learning_rate: 0.01, momentum: 0.0, batch_size: 1, l2_decay: 0.001 });


var draw_layers = new Array();

createDivLayers();

createWeightArrows();

var stop = true;

$(window).on("load", function() {
    NPGinit(24);
});

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

function myinit() {
    regen_data();
}

function update() {
    if (stop) return;
    // forward prop the data

    var netx = new convnetjs.Vol(1, 1, 1);
    avloss = 0.0;

    for (var iters = 0; iters < 5; iters++) {
        for (var ix = 0; ix < N; ix++) {
            netx.w = data[ix];
            var stats = trainer.train(netx, labels[ix]);
            avloss += stats.loss;
        }
    }

    avloss /= N * iters;

}

function draw() {
  var svg = document.getElementById("svg");
  //svg.setAttribute("transform", "translate(0,"+ (window.scrollY) +")");
  //console.log(window.screenY);


    drawOutput();

    drawArrows(stop);
}

function drawOutput() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "black";

    var netx = new convnetjs.Vol(1, 1, 1);

    var density = 5.0;

    var neurons = [draw_layers.length];
    for (var i = 0; i < draw_layers.length; i++) {
        neurons[i] = new Array();
    }

    ctx.beginPath();
    for (var x = 0.0; x <= WIDTH; x += density) {

        netx.w[0] = (x - WIDTH / 2) / ss;
        var a = net.forward(netx);
        var y = a.w[0];

        if (x === 0) ctx.moveTo(x, -y * ss + HEIGHT / 2);
        else ctx.lineTo(x, -y * ss + HEIGHT / 2);

        for (var i = 0; i < draw_layers.length; i++) {
            var ws = [].slice.call(net.layers[draw_layers[i].net_layer].out_act.w);
            neurons[i].push(ws);
        }
    }
    ctx.stroke();

    for (var i = 0; i < draw_layers.length; i++) {
        for (var j = 0; j < draw_layers[i].part_draw.childNodes.length; j++) {
            var ncanvas = draw_layers[i].part_draw.childNodes[j];
            var nctx = ncanvas.getContext("2d");

            var temp = createEmptyCanvas(WIDTH, HEIGHT, "white");
            var tctx = temp.getContext("2d");

            tctx.strokeStyle = 'rgb(250,50,50)';
            tctx.lineWidth = 10;
            tctx.beginPath();
            var n = 0;
            for (var x = 0.0; x <= WIDTH; x += density) {
                if (x === 0) tctx.moveTo(x, -neurons[i][n][j] * ss + HEIGHT / 2);
                else tctx.lineTo(x, -neurons[i][n][j] * ss + HEIGHT / 2);
                n++;
            }
            tctx.stroke();

            //temp = resize(temp, n_size, n_size);
            nctx.drawImage(temp, 0, 0, WIDTH, HEIGHT, 0, 0, n_size, n_size);

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
    if (!stop) {
        draw();
    } else {
        console.log(net.toJSON());
    }
}