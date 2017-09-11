
function getOffsetTop( elem )
{
    var offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) )
      {
          offsetTop += elem.offsetTop;
      }
    } while( elem = elem.offsetParent );
    return offsetTop;
}

function getOffsetLeft( elem )
{
    var offsetLeft = 0;
    do {
      if ( !isNaN( elem.offsetLeft ) )
      {
          offsetLeft += elem.offsetLeft;
      }
    } while( elem = elem.offsetParent );
    return offsetLeft;
}

var drawConnector = function(idArrow, A, B, weight, stop) {
    var arrow = document.getElementById(idArrow);
    var g = arrow.parentElement;
    var a = A.getBoundingClientRect();
    var b = B.getBoundingClientRect();

    var offY = 0;

    var posA = {
        x: a.left + A.width + 2,
        y: getOffsetTop(A) + A.height/2 + offY
    };
    var posB = {
        x: b.left,
        y: getOffsetTop(B) + B.height/2 + offY
    };
    var dx = (posB.x - posA.x) / 2;
    var dy = (posA.y - posB.y) / 2;
    var dArrow =
        "M" +
        (posA.x) + "," + (posA.y) + " " +
        "C" +
        (posA.x + dx) + "," + (posA.y) + " " +
        (posA.x + dx) + "," + (posB.y) + " " +
        (posB.x) + "," + (posB.y);
    arrow.setAttribute("d", dArrow);

    arrow.setAttribute("stroke-dasharray", "10,1");

    if (!stop) {
        var last_offset = Number(arrow.getAttribute("stroke-dashoffset"));
        arrow.setAttribute("stroke-dashoffset", (last_offset - 1));
    }

    var width = 2 * Math.abs(weight) + Math.pow(2, -Math.abs(weight) / 2); // 2x+2^(-x/2)
    if (width > 8) width = 8;
    arrow.setAttribute("stroke-width", width);

    var alpha = Math.abs(weight);
    if (alpha > 1) alpha = 1;
    var neg_c = "rgb(245, 147, 34)";
    var pos_c = "rgb(8, 119, 189)";
    if (weight > 0) {
        arrow.setAttribute("stroke", "rgba(8,119,189," + alpha + ")");
    } else {
        arrow.setAttribute("stroke", "rgba(245,147,34," + alpha + ")");
    }

};