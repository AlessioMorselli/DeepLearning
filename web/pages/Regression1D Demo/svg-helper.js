

var drawConnector = function(idArrow, A, B, weight) {
  var arrow = document.getElementById(idArrow);
  var g = arrow.parentElement;
  g.setAttribute("stroke-width", weight);
  var a = A.getBoundingClientRect();
  var b = B.getBoundingClientRect();

  var posA = {
    x: a.left + A.width / 2,
    y: a.top  + A.height
  };
  var posB = {
    x: b.left + B.width / 2,
    y: b.top
  };
  var dy = (posA.y-posB.y)/2;
  var dArrow =
      "M" +
      ( posB.x ) + "," + ( posB.y ) + " " +
      "C" +
      ( posB.x ) + "," + ( posB.y + dy - 16) + " " +
      ( posA.x ) + "," + ( posB.y + dy + 16) + " " +
      ( posA.x ) + "," + ( posA.y );
  arrow.setAttribute("d", dArrow);
};