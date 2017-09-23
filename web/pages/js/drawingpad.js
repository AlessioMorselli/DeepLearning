drawingpad = {
  canvas: undefined,
  context: undefined,
  marker: {width: 28, color: "rgb(0,0,0)"},
  lastEvent: undefined,
  mouseDown: false,

  onDrawStart: function() {},
  onDraw: function() {},
  onDrawEnd: function() {},
  onClear: function() {},

  clear: function(){
    drawingpad.onClear();
    drawingpad.context.clearRect(0, 0, drawingpad.canvas.width, drawingpad.canvas.height);
    
    drawingpad.context.beginPath();
    drawingpad.context.rect(0, 0, drawingpad.canvas.width, drawingpad.canvas.height);
    drawingpad.context.fillStyle = "white";
    drawingpad.context.fill();
  },

  resize: function(size) {
    var temp = document.createElement("canvas");
    temp.width = size;
    temp.height = size;
    var ctx_temp = temp.getContext("2d");
    ctx_temp.drawImage(drawingpad.canvas,0, 0, drawingpad.canvas.width, drawingpad.canvas.height, 0, 0, size, size);

    drawingpad.canvas.width = size;
    drawingpad.canvas.height = size;
    drawingpad.marker.width = size/10;
    drawingpad.context = drawingpad.canvas.getContext("2d");

    drawingpad.context.drawImage(temp,0, 0, size, size);
  }
}

var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
drawingpad.canvas = document.getElementById("drawingpad");
drawingpad.context = drawingpad.canvas.getContext('2d');
drawingpad.clear();

/* MOUSE */
drawingpad.canvas.addEventListener( 'mousedown', function(e) {
  drawingpad.onDrawStart();

  if(isFirefox) drawingpad.lastEvent = JSON.parse(JSON.stringify(e));
  else drawingpad.lastEvent = e;

  drawingpad.mouseDown = true;
}
, false);

drawingpad.canvas.addEventListener( 'mousemove', function(e) {
  drawingpad.onDraw();

  if(drawingpad.mouseDown){
    drawingpad.context.beginPath();
    
    drawingpad.context.moveTo(drawingpad.lastEvent.offsetX, drawingpad.lastEvent.offsetY);
    drawingpad.context.lineTo(e.offsetX,e.offsetY);
    drawingpad.context.lineWidth = drawingpad.marker.width;
    drawingpad.context.strokeStyle = drawingpad.marker.color;
    drawingpad.context.lineCap = 'round';
    drawingpad.context.stroke();
    
    if(isFirefox) drawingpad.lastEvent = JSON.parse(JSON.stringify(e));
    else drawingpad.lastEvent = e;
  }
}
, false);

drawingpad.canvas.addEventListener( 'mouseup', function(e) {
  drawingpad.mouseDown = false;
  drawingpad.onDrawEnd();
}
, false);

drawingpad.canvas.addEventListener( 'mouseleave', function(e) {
  if(drawingpad.mouseDown) { drawingpad.onDrawEnd(); }
  drawingpad.mouseDown = false;
}
, false);

/* TOUCH */
drawingpad.canvas.addEventListener( 'touchstart', function(e) {
  drawingpad.onDrawStart();

  if(isFirefox) drawingpad.lastEvent = JSON.parse(JSON.stringify(e));
  else drawingpad.lastEvent = e;
  
  drawingpad.mouseDown = true;
}
, false);

drawingpad.canvas.addEventListener( 'touchmove', function(e) {
  e.preventDefault();

  drawingpad.onDraw();

  if(drawingpad.mouseDown){
    drawingpad.context.beginPath();
    var offsetLeft = drawingpad.canvas.getBoundingClientRect().left;
    var offsetTop = drawingpad.canvas.getBoundingClientRect().top;
    console.log(offsetLeft+", "+offsetTop);
    drawingpad.context.moveTo(drawingpad.lastEvent.targetTouches[0].pageX - offsetLeft, drawingpad.lastEvent.targetTouches[0].pageY - offsetTop);
    drawingpad.context.lineTo(e.targetTouches[0].pageX - offsetLeft, e.targetTouches[0].pageY - offsetTop);
    drawingpad.context.lineWidth = drawingpad.marker.width;
    drawingpad.context.strokeStyle = drawingpad.marker.color;
    drawingpad.context.lineCap = 'round';
    drawingpad.context.stroke();
    
    if(isFirefox) drawingpad.lastEvent = JSON.parse(JSON.stringify(e));
    else drawingpad.lastEvent = e;
  }
}, false);

drawingpad.canvas.addEventListener( 'touchend', function(e) {
  drawingpad.onDrawEnd();
  drawingpad.mouseDown = false; 
}, false);

drawingpad.canvas.addEventListener( 'touchcancel', function(e) {
  drawingpad.onDrawEnd();
  drawingpad.mouseDown = false; 
}, false);