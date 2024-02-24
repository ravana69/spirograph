window.addEventListener("resize", resize);
var DEBUG = false;
var canvas;
var width;
var height;
var stats = new Stats();
var gui;
var showFPS = false;
var showControls = true;

var Params = function(){
  this.paused = false;
  this.lineWidth = 1;
  this.opacity = 100;
  this.rotation_speed_1 = 338.5;
  this.rotation_speed_2 = 214;
  this.inner_radius = 243;
  this.outer_radius = 108;
  this.trail_length = 1000;
  this.save_Image = function(){
    saveCanvas("my_image", "png");
  }
  this.randomize = function(){
    randomize();
    renderLines();
  }
}

var Line = function(x1, y1, x2, y2, color){
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.color = color;
}

Line.prototype.draw = function(){
  strokeWeight(params.lineWidth);
  stroke(this.color);
  line(this.x1, this.y1, this.x2, this.y2);
}

var Spirograph = function(){
  this.x = 0;
  this.y = 0;
  this.prevX = 0;
  this.prevY = 0;
  this.angle1 = 0;
  this.angle2 = 0;
}

Spirograph.prototype.tick = function(){
  this.prevX = this.x;
  this.prevY = this.y;
  var x1 = Math.cos(toRad(this.angle1))*params.inner_radius;
  var y1 = Math.sin(toRad(this.angle1))*params.inner_radius;
  var x2 = Math.cos(toRad(this.angle2))*params.outer_radius;
  var y2 = Math.sin(toRad(this.angle2))*params.outer_radius;
  this.x = x1+x2 + width/2;
  this.y = y1+y2 + height/2;
  this.angle1 = ((this.angle1 + 180 + params.rotation_speed_1)%360) - 180;
  this.angle2 = ((this.angle2 + 180 + params.rotation_speed_2)%360) - 180;
}

Spirograph.prototype.reset = function(){
  this.x = params.inner_radius + params.outer_radius + width/2;
  this.prevX = this.x;
  this.y = height/2;
  this.prevY = this.y;
  this.angle1 = 0;
  this.angle2 = 0;
}

var params;
var lines;
var spirograph;


function toRad(deg){
  return deg*0.0174533;
}

function randomize(){
  params.rotation_speed_1 = Math.floor(Math.random()*720)/2;
  params.rotation_speed_2 = Math.floor(Math.random()*720)/2;
  params.inner_radius = Math.floor(Math.random()*500);
  params.outer_radius = Math.floor(Math.random()*250);
}

function setup(){
  createCanvas();
  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);
  rectMode(CENTER);
  width = 0;
  height = 0;
  params = new Params();
  lines = [];
  spirograph = new Spirograph();
  resize();
  
  if (showFPS){
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
  }
  
  if (showControls){
    gui = new dat.GUI();
    var lw = gui.add(params, "lineWidth", .5, 10, .5);
    var op = gui.add(params, "opacity", 0, 100, .5);
    var tl = gui.add(params, "trail_length", 1, 2000);
    var rot1 = gui.add(params, "rotation_speed_1", 0, 360, .5).listen();
    var rot2 = gui.add(params, "rotation_speed_2", 0, 360, .5).listen();
    var inner = gui.add(params, "inner_radius", 1, 500, 1).listen();
    var outer = gui.add(params, "outer_radius", 1, 500, 1).listen();
    gui.add(params, "randomize");
    gui.add(params, "save_Image");
    
    lw.onChange(renderLines);
    op.onChange(renderLines);
    tl.onChange(renderLines);
    rot1.onChange(renderLines);
    rot2.onChange(renderLines);
    inner.onChange(renderLines);
    outer.onChange(renderLines);
  }
  renderLines();
}

function draw(){
  if (stats != undefined) stats.begin();
  if (params != undefined && !params.paused){
  }
  if (stats != undefined) stats.end();
}

function renderLines(){
  spirograph.reset();
  lines.splice(0, lines.length);
  for (var i = 0; i < params.trail_length; i++){
    spirograph.tick();
    pushLine();
  }
  background(0);
  if (spirograph == undefined || params == undefined || lines == undefined) return;
  for (var i = 0; i < lines.length; i++){
    lines[i].draw();
  }
}

function pushLine(){
  var xDiff = spirograph.x - spirograph.prevX;
  var yDiff = spirograph.y - spirograph.prevY;
  var hue = (Math.sqrt(xDiff*xDiff + yDiff*yDiff))%360;
  var line = new Line(spirograph.x, spirograph.y, spirograph.prevX, spirograph.prevY, color(hue, 100, 100, params.opacity));
  lines.push(line);
}

function resize(){
  width = window.innerWidth;
  height = window.innerHeight;
  resizeCanvas(width, height);
  renderLines();
}