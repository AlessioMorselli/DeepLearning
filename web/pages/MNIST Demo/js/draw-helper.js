context = document.getElementById('draw-canvas').getContext("2d");

$('#draw-canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
		
  paint = true;
  
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#draw-canvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#draw-canvas').mouseup(function(e){
  paint = false;
});

$('#draw-canvas').mouseleave(function(e){
  paint = false;
});

$('#clear_canvas').click(function(e){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  context.beginPath();
  context.rect(0, 0, 240, 240);
  context.fillStyle = "black";
  context.fill();
  context.closePath();
  clickX = new Array();
clickY = new Array();
clickDrag = new Array();
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  context.beginPath();
  context.rect(0, 0, 240, 240);
  context.fillStyle = "black";
  context.fill();
  
  context.strokeStyle = 'rgba(255, 255, 255, 1)';
  context.lineJoin = "round";
  context.lineWidth = 20;
			
  for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}