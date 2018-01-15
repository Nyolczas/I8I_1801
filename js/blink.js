var canvas = document.querySelector('#blink-canvas');
var W = window.innerWidth;
var H = window.innerHeight;
canvas.width = W;
canvas.height = H;
var ctx = canvas.getContext('2d');
// canvas.style.background = "pink";

// ================ szemhéj objektum ================       

function eyelid() {
    this.x = 0;
    this.y = 0;
    this.forgatas = 0;
    this.szin = "balck";
    this.suly = W / 4;
    this.suly2 = W - this.suly;
    this.nyitott = H;
    this.meretX = 1;
    this.meretY = 1;

    this.rajzol = function (ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.forgatas * Math.PI / 180);
        ctx.scale(this.meretX, this.meretY);

        ctx.fillStyle = this.szin;

        ctx.beginPath();

        ctx.moveTo(W / -2, H / 2);
        ctx.lineTo(W / -2, H / -2);
        ctx.bezierCurveTo(this.suly - W / 2, this.nyitott - H / 2, this.suly2 - W / 2, this.nyitott - H / 2, W / 2, H / -2);
        ctx.lineTo(W / 2, H / 2);

        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// ================ pislogás objektum ================ 

function blink(X, Y, R, Sx, Sy, Open) {
    this.X = W / 2;
    this.Y = H / 2;
    this.R = 0;
    this.Sx = 1;
    this.Sy = 1;
    this.Open = H * 1;

    var lid1 = new eyelid();
    lid1.x = X;
    lid1.y = Y + H / 2;
    lid1.forgatas = R;
    lid1.meretX = Sx;
    lid1.meretY = Sy;
    lid1.nyitott = Open;
    lid1.rajzol(ctx);

    var lid2 = new eyelid();
    lid2.x = X;
    lid2.y = Y - H / 2;
    lid2.forgatas = R + 180;
    lid2.meretX = Sx;
    lid2.meretY = Sy;
    lid2.nyitott = Open;

    lid2.rajzol(ctx);
}

// ================ betöltés anim (kinyit) ================ 
var openStart = 0;
var openScaleX = 1.2;
var openScaleY = 2;

var openBlink = setInterval(function () {
    ctx.clearRect(0, 0, W, H);
    blink(W / 2, H / 2, 0, openScaleX, openScaleY, openStart);
    openStart += 10;
    openScaleX += 0.01;
    openScaleY += 0.01;
    if (openStart >= H) {
        stopOpenBlink();
        document.getElementById("blink-canvas").style.visibility = "hidden";
    }
}, 1);

window.onload = openBlink;

function stopOpenBlink() {
    clearInterval(openBlink);
}

// ================ oldalelhagyás anim (becsuk) ================ 
var closeBlink;
function linkBlink() {
    document.getElementById("blink-canvas").style.visibility = "visible";
    closeBlink = setInterval(function () {
        ctx.clearRect(0, 0, W, H);
        blink(W / 2, H / 2, 0, openScaleX, openScaleY, openStart);
        openStart -= 10;
        if (openStart <= 0) {
            stopCloseBlink();
        }
    }, 1);
}

function stopCloseBlink() {
    clearInterval(closeBlink);
}

