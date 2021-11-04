var screenHeight = window.innerHeight; 
var screenWidth = window.innerWidth; 
var backgroundCanvas; 
var context; 
var colorDifference = 0.02; 
var color = "white"; 
var maxSpeed = 1; 
var time = 0; 
var updateMs = 10;
var points = [];
var amountOfPoints;

class Point {
    constructor(x, y) {
        this.x = x; 
        this.y = y; 
        this.previousXDirection = (lerp(-1, 1, Math.random())) > 0 ? 1 : 0;
        this.previousYDirection = (lerp(-1, 1, Math.random())) > 0 ? 1 : 0;
    }
    directionX() {

        this.previousXDirection = this.x >= screenWidth ? -1 : this.x <= 0 ? 1 : this.previousXDirection;
        return this.previousXDirection; 
    }
    directionY() {

        this.previousYDirection = this.y >= screenHeight ? -1 : this.y <= 0 ? 1 : this.previousYDirection;
        return this.previousYDirection;
    }
}



window.onload = function() {

    backgroundCanvas = document.getElementById("backgroundCanvas"); 
    backgroundCanvas.width = screenWidth;
    backgroundCanvas.height = screenHeight;

    context = backgroundCanvas.getContext("2d"); 

    amountOfPoints = parseInt(lerp(4, 20, Math.random())); 

    for(let i = 0; i < amountOfPoints; i++)
        points.push(new Point(lerp(0, screenWidth, Math.random()), lerp(0, screenHeight, Math.random())));
    
    setInterval(update, updateMs); 
}

function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [ r * 255, g * 255, b * 255 ];
}

function drawLine(point0, point1) {

    let point = Math.abs(point1.x - point0.x) / 2;
    let value = 180 + Math.sin(point/screenWidth);
    let rgb = hsvToRgb(value, 1, 1)
    let color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.moveTo(point0.x, point0.y); 
    context.lineTo(point1.x, point1.y);
    context.stroke();
} 

function lerp(x0, x1, t) {
    return x0 + (x1 - x0) * t; 
}

function bezier(point0, point1, point2, t) {
    lx1 = lerp(point0.x, point1.x, t); 
    ly1 = lerp(point0.y, point1.y, t); 
    lx2 = lerp(point1.x, point2.x, t); 
    ly2 = lerp(point1.y, point2.y, t); 
    
    x = lerp(lx1, lx2, t);
    y = lerp(ly1, ly2, t);

    drawLine(new Point(lx1, ly1), new Point(lx2, ly2));  
    return new Point(x, y); 
}

function bezierCubic(point0, point1, point2, point3, t) {
    let v1 = bezier(point0, point1, point2, t); 
    let v2 = bezier(point1, point2, point3, t); 
    let x = lerp(v1.x, v2.x, t); 
    let y = lerp(v1.y, v2.y, t);

    drawLine(v1, v2); 
    return new Point(x, y); 
}

function update() {

    time += updateMs / 1000;
    delta = 0.02 + Math.sin(0.01 / time); 

    context.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    let lastCurve;

    for(let i = 0; i < points.length; i+=2) {
        
        for(let t = 0; t < 1 - delta + 0.00001; t+= delta) {
            
            if(points[i + 3] == undefined)
                break; 

            let currentCurve = bezierCubic(points[i + 0], points[i + 1], points[i + 2], points[i + 3], t);

            if(lastCurve != undefined) {
                drawLine(lastCurve, currentCurve);  
            }
            lastCurve = currentCurve; 
        }
    }
    for(let i = 0; i < points.length - 1; i++) {
        
        points[i].x += points[i].directionX() * lerp(0, maxSpeed, Math.random());
        points[i].y += points[i].directionY() * lerp(0, maxSpeed, Math.random());
    }
}