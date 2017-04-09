//搜索框属性
var AnkHeight = 0;
if (document.body.offsetWidth > 990) {
    AnkHeight = 68;
} else {
    AnkHeight = 50;
}

var AnkWidth = AnkHeight * 10;
var AnkFontsize = AnkHeight - 20;
var linew = 5
//logo大小控制器
var zoom = parseInt(AnkHeight / 6);

var canvas = document.createElement("canvas");
canvas.id = "canvas";
Rectangle(canvas);
document.body.appendChild(canvas);

//坐标转换
//a b:坐标位置   c d:矩形长宽
function Bian(a, b, c, d) {
    var temp = [a / 2 - c / 2, b / 2.5 - d / 2, c, d];
    return temp;
}

function Rectangle(incanvas) {
    incanvas.width = window.innerWidth;
    incanvas.height = window.innerHeight;
}

var mycontext = canvas.getContext('2d');
//canvas的宽和高
var Cw = canvas.width;
var Ch = canvas.height;
//搜索框位置及大小
var tem = Bian(Cw, Ch, AnkWidth, AnkHeight);

function RainPlot(pinter) {

    var rain = [
        [0, 0, 1, 4],
        [1, 1, 2, 1],
        [4, 0, 1, 4],
        [5, 0, 1, 1],
        [5, 2, 1, 1],
        [6, 0, 1, 4],
        [8, 0, 1, 4],
        [10, 0, 1, 3],
        [11, 0, 1, 1],
        [12, 0, 1, 3],
        [10, 3, 3, 1]
    ];

    var rainoffx = parseInt(tem[0] + 2.5 + 5);
    var rainoffy = parseInt(Ch / 2.5 - 4 * zoom / 2);
    pinter.fillStyle = '#000';
    mycontext.fillRect(tem[0] + 2.5 + zoom * 13 + 10, tem[1], linew, AnkHeight);
    for (var val in rain) {
        if (val == rain.length - 1) {
            pinter.fillStyle = '#F00';
        }
        pinter.fillRect(rain[val][0] * zoom + rainoffx, rain[val][1] * zoom + rainoffy, rain[val][2] * zoom, rain[val][3] * zoom)

    }
}

function InputContext() {

    mycontext.strokeStyle = '#000';
    mycontext.lineWidth = linew;
    //主框绘图
    mycontext.strokeRect(tem[0], tem[1], tem[2], tem[3]);

    //搜索输入框
    var Ank = document.getElementById('Ank');
    Ank.style['height'] = AnkHeight;
    Ank.style['width'] = AnkWidth - (2.5 + zoom * 13 + 10 + linew + 4);
    Ank.style['font-size'] = AnkFontsize;
    Ank.style['left'] = tem[0] + 2.5 + zoom * 13 + 10 + linew + 1;
    Ank.style['top'] = tem[1];

    RainPlot(mycontext);
}

window.onresize = function() {
    Rectangle(canvas);
    //更新canvas的宽和高
    Cw = canvas.width;
    Ch = canvas.height;
    //更新搜索框位置及大小
    tem = Bian(Cw, Ch, AnkWidth, AnkHeight);

    InputContext();
}
InputContext();

// window.onload = function () {
//
//   function onKeyboardEvent (event) {
//     switch (event.keyCode) {
//     case 13:
//       console.log("ok");
//       break;
//     default:
//       //console.log(event.keyCode);
//     }
//   }
//
//   window.addEventListener('keydown', onKeyboardEvent, false);
// };

// That's right... I'm using gobals... *gasp*
let width;
let height;

let ctx;


width = window.innerWidth;
height = window.innerHeight;
//
// canvas.width = width;
// canvas.height = height;

ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(255,255,200)';
ctx.fillRect(0, 0, width, height);
InputContext();
mainLoop([create()]);


function mainLoop(particles) {
    let nextParticles = [];

    requestAnimationFrame(function() {
        mainLoop(nextParticles);
    });

    let spawnCutoff = width / 1000000;
    if (Math.random() < spawnCutoff) {
        nextParticles.push(create());
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let i = 0, len = particles.length; i < len; i++) {
        renderParticle(particles[i]);
        updateParticle(particles[i], nextParticles);
    }

    // Nothing lasts forever. Not even these pixels.
    ctx.fillStyle = 'rgba(255,255,200, 0.05)';
    let n = (width * height * 0.001) | 0;
    for (let i = 0; i < n; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        ctx.fillRect(x, y, 1, 1);
    }
}

function renderParticle(p) {
    let radius = p.radius;
    let n = 1 + (radius * radius * Math.PI * 0.5) | 0;
    for (let i = 0; i < n; i++) {
        let a = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random()) * radius;
        let x = p.x + Math.cos(a) * r;
        let y = p.y + Math.sin(a) * r;
        ctx.fillRect(x, y, 1, 1);
    }
}

function updateParticle(p, nextParticles) {
    let d = Math.random() * 1.25;
    p.x += Math.cos(p.angle) * d;
    p.y += Math.sin(p.angle) * d;
    p.angle += Math.random() * 0.02 - 0.01;
    p.radius *= 0.998;
    if (p.radius > 0.5) {
        nextParticles.push(p);
        let splitCutoff = Math.min(0.005, 1.0 / (p.radius * 10));
        if (Math.random() < splitCutoff) {
            nextParticles.push({
                x: p.x,
                y: p.y,
                angle: p.angle + Math.random() - 0.5,
                radius: p.radius * 0.9
            });
            p.angle += Math.random() - 0.5;
            p.radius *= 0.9;
        }
    } else {
        // Let's have a moment of silence for the loss of this great branch.
        // ...
    }
}

// A newborn branch. Isn't it cute?
function create() {
    return {
        x: Math.random() * width,
        y: height + 5,
        angle: -Math.PI / 2,
        radius: Math.random() * 20 + 20,
    };
}
