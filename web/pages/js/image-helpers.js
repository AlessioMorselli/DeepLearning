
var loadFile = function(event) {
var reader = new FileReader();
reader.onload = function(){
  var preview = document.getElementById('preview_img');
  preview.src = centerCrop(reader.result);
  preview.src = resize(preview.src);
};
reader.readAsDataURL(event.target.files[0]);
};

function centerCrop(src){
    var image = new Image();
    image.src = src;

    var max_width = Math.min(image.width, image.height);
    var max_height = Math.min(image.width, image.height);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = max_width;
    canvas.height = max_height;
    ctx.drawImage(image, (max_width - image.width)/2, (max_height - image.height)/2, image.width, image.height);
    return canvas.toDataURL("image/png");
}

function resize(canvas, new_width, new_height){
    var dst = document.createElement('canvas');
    dst.width = new_width;
    dst.height = new_height;

    window.pica.WW = false;
    window.pica.resizeCanvas(canvas, dst, {
    quality: 0,
    unsharpAmount: 0,
    unsharpThreshold: 0,
    transferable: false
  }, function (err) {  });
    window.pica.WW = true;
    return dst;
}

var removeBlanks = function (canvas, padding_percent) {
  var context = canvas.getContext("2d");
  var imgWidth = canvas.width;
  var imgHeight = canvas.height;

  var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
           data = imageData.data,
         getRBG = function(x, y) {
                    return {
                      red:   data[(imgWidth*y + x) * 4],
                      green: data[(imgWidth*y + x) * 4 + 1],
                      blue:  data[(imgWidth*y + x) * 4 + 2]
                    };
                  },
        isWhite = function (rgb) {
                    return rgb.red == 255 && rgb.green == 255 && rgb.blue == 255;
                  },
          scanY = function (fromTop) {
                    var offset = fromTop ? 1 : -1;

                    // loop through each row
                    for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                      // loop through each column
                      for(var x = 0; x < imgWidth; x++) {
                          if (!isWhite(getRBG(x, y))) {
                              return y;                        
                          }      
                      }
                  }
                  return null; // all image is white
              },
          scanX = function (fromLeft) {
                    var offset = fromLeft? 1 : -1;

                    // loop through each column
                    for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                      // loop through each row
                      for(var y = 0; y < imgHeight; y++) {
                          if (!isWhite(getRBG(x, y))) {
                              return x;                        
                          }      
                      }
                  }
                  return null; // all image is white
              };


      var cropTop = scanY(true),
          cropBottom = scanY(false),
          cropLeft = scanX(true),
          cropRight = scanX(false);
          cropWidth = cropRight - cropLeft,
          cropHeight = cropBottom - cropTop;
  // cropTop is the last topmost white row. Above this row all is white
  // cropBottom is the last bottommost white row. Below this row all is white
  // cropLeft is the last leftmost white column.
  // cropRight is the last rightmost white column.
  var cropped_canvas = document.createElement("canvas");
  var size;
  if(cropWidth > cropHeight) {
    size = cropWidth;
  } else {
    size = cropHeight;
  }
  cropped_canvas.width = size+size*2*padding_percent;
  cropped_canvas.height = size+size*2*padding_percent;
  cctx = cropped_canvas.getContext("2d");
  cctx.clearRect(0, 0, cctx.canvas.width, cctx.canvas.height);
  cctx.beginPath();
  cctx.rect(0, 0, cctx.canvas.width, cctx.canvas.height);
  cctx.fillStyle = "white";
  cctx.fill();
  cctx.closePath();
  cctx.drawImage(canvas,
    cropLeft, cropTop, cropWidth, cropHeight,
    (size-cropWidth)*0.5+size*padding_percent, (size-cropHeight)*0.5+size*padding_percent, cropWidth, cropHeight);

  return cropped_canvas;
};

function getCanvasCopy(canvas) {
  var cpy = document.createElement("canvas");
  cpy.width = canvas.width;
  cpy.height = canvas.height;
  var cpy_ctx = cpy.getContext("2d");
  cpy_ctx.clearRect(0, 0, cpy.width, cpy.height);
  cpy_ctx.drawImage(canvas, 0, 0);
  return cpy;
}

function invertColors(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation='difference';
  ctx.fillStyle='white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  return canvas;
}



function rotateAndPaintImage (image, angleInRad) {
  var c = document.createElement("canvas");
  c.width = image.width;
  c.height = image.height;
  var context = c.getContext("2d");
  
  context.beginPath();
  context.rect(0, 0, c.width, c.height);
  context.fillStyle = "black";
  context.fill();


  var x = c.width / 2;
  var y = c.height / 2;
  var width = image.width;
  var height = image.height;
  
  context.translate(x, y);
  context.rotate(angleInRad);
  context.drawImage(image, -width / 2, -height / 2, width, height);
  context.rotate(-angleInRad);
  context.translate(-x, -y);
  return c;
}

function removeBackground(img) {
  var c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  var ctx = c.getContext("2d");

  ctx.drawImage(img,0,0);

  var imgd = ctx.getImageData(0, 0, c.width, c.height);
  var pix = imgd.data;
  var newColor = {r:0,g:0,b:0, a:0};

  for (var i = 0, n = pix.length; i <n; i += 4) {
    var r = pix[i];
    var  g = pix[i+1];
    var b = pix[i+2];

    // If its white then change it
    if(r == 0 && g == 0 && b == 0){ 
        // Change the white to whatever.
        pix[i] = newColor.r;
        pix[i+1] = newColor.g;
        pix[i+2] = newColor.b;
        pix[i+3] = newColor.a;
    }
  }

  ctx.putImageData(imgd, 0, 0);

  return c;
}

function createEmptyCanvas(width, height, color, class_name) {
  if(typeof width === "undefined") width = 100;
  if(typeof height === "undefined") height = width;
  if(typeof color === "undefined") color = "white";
  if(typeof class_name === "undefined") class_name = "";

  var canvas = document.createElement("canvas");
  canvas.className = class_name;
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext("2d");
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.fill();

  return canvas;
}

function clearCanvas(canvas, color) {
  if(typeof color === "undefined") color = "white";

  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.fill();
}
  
