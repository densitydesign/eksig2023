let dm_sans;

var gridPoints = [];
var grid = [];
var selectedPoints = [];
var center = {x: 0, y: 0, z:0};

var rem = parseInt(getComputedStyle(document.documentElement).fontSize);

// GRID
const step = 25;
var stepX = 0;
var distance;
var padding = .6*rem;
const radius = .3*rem;

// SHAPE
const nPoint = 10;
var shapePaddingX = 6;
var shapePaddingY = 6;

var pointRadius = .5*rem;
var sphereRadius = .25*rem;
var lineThickness = .1*rem;
var shapeOpacity = 20;

if (window.innerHeight > window.innerWidth) {
  shapePaddingX = 2;
  shapePaddingY = 6;
  lineThickness = .2*rem;
}

var pointer;

var state = 1;

function preload() {
  dm_sans = loadFont('assets/fonts/DMSans-Bold.ttf');
}

function setup() {
  setAttributes('antialias', true);
  frameRate(30)
  let container = select('#cover');
  var canvas = createCanvas(container.width,container.height, WEBGL)
  canvas.parent('cover');

  ortho(-width/2, width/2, -height/2, height/2, -3000, +3000)

  pointer = new Point(0,0)

  createGrid();

  gl = document.getElementById('defaultCanvas0').getContext('webgl');
  gl.disable(gl.DEPTH_TEST);

}

function draw() {
  // put drawing code here
  background('#f2f2f2');

  let locX = mouseX*2 - width / 2;
  let locY = mouseY*2 - height / 2;

  if (frameCount == 1) {
      pointer.x = 0;
      pointer.y = 0;
  }

  pointer.update(locX, locY);

  if (state == 1) {
    anim1_grid();
  }else if (state == 2) {
    anim2_points();
  }else if (state == 3) {
    anim3_lines();
  }else if (state == 4) {
    anim4_3d();
  }


}

//_______________________________________________ ANIMATION STATES

//_______________________________________________ [1]

function anim1_grid() {
  for (var i = 0; i < grid.length; i++) {
    var opacity = frameCount*20 - grid[i].time*20 - 200
    // var opacity = frameCount*20 - i*20 - 200
    // if (opacity < 150) {
    //   opacity = 0;
    // }else {
    //   opacity = 255
    // }
    fill(159,159,159,opacity);
    noStroke();

    grid[i].display();
  }

  subtitle();

  if (frameCount*20 > 300 + (step+stepX)*20) {
    frameCount = 0;
    state = 2;
  }
}

//_______________________________________________ [2]

function anim2_points() {
  for (var i = 0; i < grid.length; i++) {
    fill(159);
    noStroke();
    grid[i].display();
  }

  for (var i = 0; i < selectedPoints.length; i++) {
    var opacity = frameCount*15 - i*100;
    var size = map(opacity, 0,150,0,pointRadius,true)

    if (opacity < 0) {
      opacity = 0;
    }
    fill(0, 0, 255)
    ellipse(selectedPoints[i].x, selectedPoints[i].y, size)
  }

  subtitle();

  if (frameCount*15 > i*100 + 100) {
    frameCount = 0;
    state = 3;
  }

}

//_______________________________________________ [3]

function anim3_lines() {
  for (var i = 0; i < grid.length; i++) {
    fill(159);
    noStroke();
    grid[i].display();
  }

  subtitle();

  for (var i = 0; i < selectedPoints.length; i++) {
    fill(0, 0, 255)
    noStroke();
    ellipse(selectedPoints[i].x, selectedPoints[i].y, pointRadius)

    var x1 = selectedPoints[i].x;
    var y1 = selectedPoints[i].y;

    if (i != selectedPoints.length-1) {
      var x2 = selectedPoints[i+1].x;
      var y2 = selectedPoints[i+1].y;
    }else {
      var x2 = selectedPoints[0].x;
      var y2 = selectedPoints[0].y;
    }
    var m = (y2 - y1) / (x2 - x1);
    var q = (x2*y1 - x1*y2) / (x2 - x1);

    var pos = frameCount*15 - i*10 - 200;
    var distMax = sqrt( sq(x2-x1) + sq(y2-y1) );

    var dist = map(pos, 0, 255, 0, distMax, true) + 1;

    if (m == Infinity || m == -Infinity) {
      posX = x1;
      posY = y1 + (Math.sign(y2-y1)) * dist;
    }else {
      posX = ((2*x1 + 2*m*y1 - 2*m*q) + (Math.sign(x2-x1)) * sqrt(sq(-2*x1 - 2*m*y1 + 2*m*q) - 4*(1 + sq(m))*(sq(x1) + sq(q) + sq(y1) -2*q*y1 - sq(dist)))) / (2*(1 + sq(m)))
      posY = posX*m + q;
    }

    stroke(0, 0, 255);
    strokeWeight(lineThickness)
    line(x1, y1, posX, posY)
  }

  if (frameCount > 70) {
    frameCount = 0;
    state = 4;
  }

}

//_______________________________________________ [4]

function anim4_3d() {
  for (var i = 0; i < grid.length; i++) {
    fill(159);
    noStroke();
    push()
    translate(0,0,-step/2*distance)
    grid[i].display();
    pop();
  }

  subtitle();

  push()
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;
  rotateX(frameCount/500);
  rotateY(frameCount/500);

  rotateX(pointer.y/2000)
  rotateY(-pointer.x/2000)

  for (var i = 0; i < selectedPoints.length; i++) {
    fill(0, 0, 255)
    noStroke();

    push()
    translate(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
    sphere(sphereRadius)
    pop()

    var x1 = selectedPoints[i].x;
    var y1 = selectedPoints[i].y;
    var z1 = selectedPoints[i].z;

    if (i != selectedPoints.length-1) {
      var x2 = selectedPoints[i+1].x;
      var y2 = selectedPoints[i+1].y;
      var z2 = selectedPoints[i+1].z;
    }else {
      var x2 = selectedPoints[0].x;
      var y2 = selectedPoints[0].y;
      var z2 = selectedPoints[0].z;
    }

    stroke(0, 0, 255);
    strokeWeight(lineThickness)
    line(x1, y1, z1, x2, y2, z2)
  }

  noStroke()
  var opacity = frameCount*20 - 200
  opacity = map(opacity,0,500,0,shapeOpacity,true)
  fill(0, 0,255, opacity)

  beginShape(TRIANGLE_STRIP)
  for (var i = 0; i <= selectedPoints.length; i++) {
    if (i == selectedPoints.length) {
      vertex(selectedPoints[0].x, selectedPoints[0].y, selectedPoints[0].z)
    }else {
      vertex(selectedPoints[i].x, selectedPoints[i].y, selectedPoints[i].z)
    }
  }
  endShape(CLOSE)
  pop()

}

// _______________________________________________ window resize not suitable for mobile

// function windowResized() {
//   let container = select('#cover');
//   resizeCanvas(container.width,container.height, WEBGL)
//   createGrid();
//   frameCount = 0;
//   state = 1;
//   ortho(-width/2, width/2, -height/2, height/2, -3000, +3000)
// }

class GridPoint{
	constructor(x, y, z, time){
    	this.x=x;
      this.y=y;
      this.z=z;
      // this.time =  Math.round( random(0,step*2) );
      this.time = time;
    }

    display(){
      push();
      translate(0,0,-500);
      ellipse(this.x, this.y, radius)
      pop();
    }
}

function makeShape() {
  selectedPoints = []
  for (var i = 0; i < nPoint; i++) {

    var repeat = true;
    var tempPoint;

    while (repeat) {
      tempPoint = gridPoints[round(random(gridPoints.length - 1))];

      var x = abs(tempPoint.x);
      var y = abs(tempPoint.y);
      var z = abs(tempPoint.z);
      var p = abs((stepX/2 - shapePaddingX)* distance);
      var py = abs((step/2 - shapePaddingY + 1)* distance);

      if (x < p && z < p && y < py) {
        repeat = false;
      }
    }

    selectedPoints.push(tempPoint);
  }

  center = findCenter(selectedPoints)
}

$('#cover').on("click", function() {
  frameCount = 0;
  state = 2;
  makeShape();
});

function findCenter(points){

  var xValues = [];
  var yValues = [];
  var zValues = [];

  for (var i = 0; i < points.length; i++) {
    var tempX = points[i].x;
    var tempY = points[i].y;
    var tempZ = points[i].z;

    xValues.push(points[i].x);
    yValues.push(points[i].y);
    zValues.push(points[i].z);
  }

  var centerX = (findMin(xValues) + findMax(xValues)) / 2;
  var centerY = (findMin(yValues) + findMax(yValues)) / 2;
  var centerZ = (findMin(zValues) + findMax(zValues)) / 2;

  var center = {x: centerX, y: centerY, z: centerZ};

  return center
}

function findMin(values){

  var min = 0;

  for (var i = 0; i < values.length; i++) {
    temp = values[i];
    if (temp < min) {
      min = temp;
    }
  }

  return min
}

function findMax(values){

  var max = 0;

  for (var i = 0; i < values.length; i++) {
    temp = values[i];
    if (temp > max) {
      max = temp;
    }
  }

  return max
}

function createGrid() {

  grid = [];
  gridPoints = [];
  let gridWidth = width - padding*2;
  let gridHeight = height - padding*2;
  distance = gridHeight / (step - 1);
  stepX = round(gridWidth / distance + 1) - 1;


  for (var i = -stepX/2; i <= stepX/2; i++) {
    for (var j = -step/2; j <= step/2; j++) {
      var time = i+j+step;
      var g = new GridPoint(i*distance, j*distance, 0, time);
      grid.push(g)
      for (var k = -stepX/2; k <= stepX/2; k++) {
        var point = new GridPoint(i*distance, j*distance, k*distance, i+j);
        gridPoints.push(point);
      }
    }
  }

  makeShape();
}

// _____________________________________________________ DRAW SUBTITLE FUNCTION

function subtitle() {
  textSize(1.2*rem);
  textFont(dm_sans);

  push();
  translate(0,0,-500);
  var text1 = "FROM ABSTRACTNESS\nTO CONCRETENESS";
  if (window.innerHeight > window.innerWidth) {
    var text2 = "EXPERIENTIAL KNOWLEDGE\nAND ROLE OF PROTOTYPES\nIN DESIGN RESEARCH";
    var text2Width = textWidth("EXPERIENTIAL KNOWLEDGE");
    var height2 = 5*rem + padding;
  }else {
    var text2 = "EXPERIENTIAL KNOWLEDGE AND ROLE\nOF PROTOTYPES IN DESIGN RESEARCH";
    var text2Width = textWidth("EXPERIENTIAL KNOWLEDGE AND ROLE");
    var height2 = 4*rem + padding*2;
  }
  var text1Width = textWidth("FROM ABSTRACTNESS");
  noStroke();
  fill("#f2f2f2")
  rect(-width/2, -height/2 + padding,text1Width + padding*2, 4*rem + padding)
  rect(width/2 - text2Width - padding*2, height/2 - height2, text2Width + padding*2, height2)
  fill('#323232')
  textAlign(LEFT, TOP);
  text(text1,-width/2 + padding,-height/2 + padding*2)
  textAlign(RIGHT, BOTTOM);
  text(text2, width/2 - padding, height/2 - padding*2)
  pop();
}

///////////////////////////////////////////////////////////////////// POINT CLASS

function Point(_x, _y) {
  this.x = _x;
  this.y = _y;
  this.speed = 1;
  this.directionX = 1;
  this.directionY = 1;

  this.noiseSeed = random();
  this.noise;
  this.s = random();
  this.n;

  this.update = function(_targetX, _targetY) {

    this.noise = 50 * noise(millis() / 10000 + this.noiseSeed);
    this.n = 3 * noise(millis() / 10000 + this.s);

    this.x = this.x + cos(this.noise / 3) * 2 * this.n
    this.y = this.y + sin(this.noise / 3) * 2 * this.n

    var deltaX = this.x - _targetX;
    var deltaY = this.y - _targetY;

    if (deltaX >= 0) {
      this.directionX = -1;
    } else {
      this.directionX = 1;
    }
    if (deltaY >= 0) {
      this.directionY = -1;
    } else {
      this.directionY = 1;
    }
    this.x = this.x + (this.speed * this.directionX * abs(deltaX) / 20);
    this.y = this.y + (this.speed * this.directionY * abs(deltaY) / 20);
  }

  this.display = function() {
    noStroke();
    fill(255, 255, 255, 20)
    ellipse(this.x, this.y, 30)
    ellipse(this.x, this.y, 20)
    ellipse(this.x, this.y, 10)
    ellipse(this.x, this.y, 9)
    ellipse(this.x, this.y, 7)
    ellipse(this.x, this.y, 6)
    ellipse(this.x, this.y, 5)
    fill(255, 255, 255)
    ellipse(this.x, this.y, 5)
  }
}
