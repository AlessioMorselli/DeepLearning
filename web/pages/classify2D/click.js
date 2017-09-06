function NPGtick() {
    /*update();
    draw();*/
}

function NPGinit(FPS){
  //takes frames per secont to run at
  
  canvas = document.getElementById('tela');
  ctx = canvas.getContext('2d');
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  
  canvas.addEventListener('click', eventClick, false);
  
  //canvas element cannot get focus by default. Requires to either set 
  //tabindex to 1 so that it's focusable, or we need to attach listeners
  //to the document. Here we do the latter
  /*document.addEventListener('keyup', eventKeyUp, true);
  document.addEventListener('keydown', eventKeyDown, true);*/
  
  setInterval(NPGtick, 1000/FPS);
  
  myinit();
}

function myinit() { console.log("Inizializzazione - COMPLETATA"); }

function eventClick(e) {
    
  console.log("Ciaone!");
  
  //get position of cursor relative to top left of canvas
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  } else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  } 
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  
  
  console.log("Coordinate: x = " + x + " - y = " + y);
  
  //call user-defined callback
  mouseClick(x, y, e.shiftKey, e.ctrlKey);
}

function mouseClick(x, y, shiftPressed, ctrlPressed){
  /*
  // x and y transformed to data space coordinates
  var xt = (x-WIDTH/2)/ss;
  var yt = (y-HEIGHT/2)/ss;

  if(ctrlPressed) {
    // remove closest data point
    var mink = -1;
    var mind = 99999;
    for(var k=0, n=data.length;k<n;k++) {
      var dx = data[k][0] - xt;
      var dy = data[k][1] - yt;
      var d = dx*dx+dy*dy;
      if(d < mind || k==0) {
        mind = d;
        mink = k;
      }
    }
    if(mink>=0) {
      console.log('splicing ' + mink);
      data.splice(mink, 1);
      labels.splice(mink, 1);
      N -= 1;
    }

  } else {
    // add datapoint at location of click
    data.push([xt, yt]);
    labels.push(shiftPressed ? 1 : 0);
    N += 1;
  }
*/
  console.log("Ciao! Hai premuto sul canvas!");
}