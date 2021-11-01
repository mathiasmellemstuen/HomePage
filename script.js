var backgroundCanvas; 
var context; 

var mouseX; 
var mouseY; 
var currentColorIndex = 0; 
var colorDifference = 0.02; 
var x0; 
var y0; 
var x1; 
var y1; 
var x2; 
var y2; 
var x3; 
var y3;
var dir0 = 1; 
var dir1 = 1;
var dir2 = 1; 
var dir3 = 1;

color = "white"; 

maxSpeed = 1; 
window.onload = function() {

    x0 = lerp(0, 1920, Math.random());
    x1 = lerp(0, 1920, Math.random());
    x2 = lerp(0, 1920, Math.random());
    x3 = lerp(0, 1920, Math.random());
    y0 = lerp(0, 1080, Math.random()); 
    y1 = lerp(0, 1080, Math.random()); 
    y2 = lerp(0, 1080, Math.random()); 
    y3 = lerp(0, 1080, Math.random()); 

    backgroundCanvas = document.getElementById("backgroundCanvas"); 
    context = backgroundCanvas.getContext("2d"); 

    backgroundCanvas.addEventListener("mousemove", function(e) { 
        var cRect = backgroundCanvas.getBoundingClientRect();
        mouseX = Math.round(e.clientX - cRect.left);
        mouseY = Math.round(e.clientY - cRect.top);
    });

    setInterval(update, 10); 
}
function update() {
    dir0 = x0 >= 1920 ? -1 : x0 <= 0 ? 1 : y0 >= 1080 ? -1 : y0 <= 0 ? -1 : dir0;  
    dir1 = x1 >= 1920 ? -1 : x1 <= 0 ? 1 : y1 >= 1080 ? -1 : y1 <= 0 ? -1 : dir1;  
    dir2 = x2 >= 1920 ? -1 : x2 <= 0 ? 1 : y2 >= 1080 ? -1 : y2 <= 0 ? -1 : dir2;  
    dir3 = x3 >= 1920 ? -1 : x3 <= 0 ? 1 : y3 >= 1080 ? -1 : y3 <= 0 ? -1 : dir3;
    x0 += dir0 * lerp(0, maxSpeed, Math.random());
    y0 += dir0 * lerp(0, maxSpeed, Math.random());
    x1 += dir1 * lerp(0, maxSpeed, Math.random());
    y1 += dir1 * lerp(0, maxSpeed, Math.random());
    x2 += dir2 * lerp(0, maxSpeed, Math.random());
    y2 += dir2 * lerp(0, maxSpeed, Math.random());
    x3 += dir3 * lerp(0, maxSpeed, Math.random());
    y3 += dir3 * lerp(0, maxSpeed, Math.random());

    delta = 0.03; 
    context.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    for(let t = 0; t < 1 - delta + 0.00001; t+= delta) {
        let cubic = bezierCubic(x0, y0, x1, y1, x2, y2, x3, y3, t);

    }
    currentColorIndex = 0; 
}

function bezierCubic(x0, y0, x1, y1, x2, y2, x3, y3, t) {
    let v1 = bezierQuadratic(x0, y0, x1, y1, x2, y2, t); 
    let v2 = bezierQuadratic(x1, y1, x2, y2, x3, y3, t); 
    let x = lerp(v1.x, v2.x, t); 
    let y = lerp(v1.y, v2.y, t);

    if(Math.abs(mouseX - x) <= 100 && Math.abs(mouseY - y) <= 100) {
        color = "red"; 
    }
    drawLine(v1.x, v1.y, v2.x, v2.y, color, 1.0, context); 

    color = "white"; 
    let returnValue = {
        "x" : x,
        "y" : y 
    }
    return returnValue; 
}
function bezierQuadratic(x0, y0, x1, y1, x2, y2, t) {
    lx1 = lerp(x0, x1, t); 
    ly1 = lerp(y0, y1, t); 
    lx2 = lerp(x1, x2, t); 
    ly2 = lerp(y1, y2, t); 
    
    x = lerp(lx1, lx2, t);
    y = lerp(ly1, ly2, t);

    if(Math.abs(mouseX - x) <= 100 && Math.abs(mouseY - y) <= 100) {
        color = "orange"; 
    }
    drawLine(lx1, ly1, lx2, ly2, color, 1.0, context);  

    color = "white"; 

    let returnValue = {
        "x" : x,
        "y" : y
    }
    return returnValue; 
}

function lerp(x0, x1, t) {
    return x0 + (x1 - x0) * t; 
}
function drawLine(x0, y0, x1, y1, color, strokeWidth, context) {
    currentColorIndex += 1; 
    context.beginPath();
    context.lineWidth = strokeWidth;
    context.strokeStyle = color;
    context.moveTo(x0, y0); 
    context.lineTo(x1, y1);
    context.stroke();
} 