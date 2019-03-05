// =================================== változók
var canvas = document.querySelector('canvas');
var W = window.innerWidth;
var H = window.innerHeight;
canvas.width = W;
canvas.height = H;
var c = canvas.getContext('2d');
var TheTextWasWritten = 0;
var hslCnt = 0;
var darkColor = "hsl(0, 80%, 10%)";
var menuLightColor = "hsl(0, 100%, 90%)";
var MenuDarkColor = "hsl(0, 40%, 20%)";
var MenuFullColor = "hsl(0, 100%, 50%)";
var bubbleColor = "hsla(0, 50%, 50%, 0.1)";
var emitterEnabled = false;
var title = document.getElementsByTagName("title")[0].innerHTML;


var textCloud = [

    // main
    "Webfejlesztés", "Grafika", "Animáció", "Programozás", "Design", "Illusztráció",
    "Vizuális kommunikáció", "Rajz - Festés - Szobrászat",
    "Illusztráció", "Motion design",
    "Látványtervek",
    "Grafika", "Animáció", "Programozás", "Motion design",
    "Látványtervek", "Design", "Logóanimáció", "VFX",
    // szlogen
    "Tudomány és Művészet", "Innováció", "Lifelong learning", "Vizuális trendek",
    "Kreatív", "Elkészítem a weboldaladat",
    // bővebb - grafika
    "2D - 3D grafika", "2D - 3D animáció", "Művészeti vezetés",
    "3D modellezés - textúrázás", "Mattepaint", "Rigging",
    "Animációs rendezés", "Webfejlesztés", "Concept art", "Storyboard rajzolás",
    "Character design", "Environment art",
    // bővebb - web
    "Sitebuild", "Responsive sitebuild", "Logó animáció", "Banner animáció",
    "Wordpress",
    // szoftver
    "Photoshop", "Illustrator", "Maya", "AfterEffects",
    "Photoshop", "Illustrator", "Maya", "ZBrush", "AfterEffects", "InDesign",
    "AnimeStudio",
    // programnyelv
    "JavaScript", "Bootstrap", "JQuery", "Python", "HTML", "CSS",
    "PHP", "MySQL", "NodeJS", "ASP.NET", "Django", "C#"
];
// =================================== Egér detektálás
var mouse = {
    x: undefined,
    y: undefined
}

window.onmousemove = function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

// ======================= pötty animáció =======================
var minSpeed = 3;
var speedFactor = 0.5;
var minRadius = Math.floor((W + H) * 0.001);
var maxRadius = minRadius * 8 - minRadius;

var quant = Math.floor((W + H) * 0.02);
var mouseField = 44;

// ===
function Circle(x, y, xSpeed, ySpeed, radius) {
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.radius = radius;
    this.minRadius = radius;

    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = bubbleColor;
        c.fill();
    }

    this.update = function () {
        if (this.x + this.radius > W || this.x - this.radius < 0) {
            this.xSpeed = -this.xSpeed;
        }
        this.x += this.xSpeed;

        if (this.y + this.radius > H || this.y - this.radius < 0) {
            this.ySpeed = -this.ySpeed;
        }
        this.y += this.ySpeed;

        // interaktiv
        if (mouse.x - this.x < mouseField && mouse.x - this.x > -mouseField &&
            mouse.y - this.y < mouseField && mouse.y - this.y > -mouseField) {
            if (this.radius < maxRadius * 3) {
                document.getElementById("canvas").style.cursor = "pointer";
                this.radius++;
                emitterEnabled = true;
            }
        } else if (this.radius > this.minRadius) {
            document.getElementById("canvas").style.cursor = "crosshair";
            this.radius -= 1;
            emitterEnabled = false;
        }
        this.draw();
    }
}

// ===
var CircleArray = [];

for (var i = 0; i < quant; i++) {
    var x = Math.random() * W;
    var y = Math.random() * H;
    var xSpeed = (Math.random() - 0.5) * speedFactor;
    xSpeed += xSpeed * minSpeed;
    var ySpeed = (Math.random() - 0.5) * speedFactor;
    ySpeed += ySpeed * minSpeed;
    radius = Math.random() * maxRadius + minRadius;

    CircleArray.push(new Circle(x, y, xSpeed, ySpeed, radius));
}
// ======================= pötty animáció vége =======================

// ======================= szöveg animáció =======================
// object id a szöveg részecskékhez
var txtParticles = {};
var txtParticleIndex = 0;

// anim controlls
var txtParticleNum = 5,
    life = 250,
    sizeMax = 12,
    sizeMin = 8,
    velocityMax = 50,
    friction = 0.95,
    damping = -0.5,
    gravity = -0.03;

function Particle() {
    this.size = Math.random() * (sizeMax - sizeMin) + sizeMin;
    this.floor = canvas.height - this.size;
    this.right = canvas.width - this.size;
    this.x = mouse.x;
    this.y = mouse.y;
    this.veloX = Math.random() * velocityMax - (velocityMax / 2);
    this.veloY = Math.random() * velocityMax - (velocityMax / 2);
    txtParticleIndex++;
    txtParticles[txtParticleIndex] = this;
    this.id = txtParticleIndex;
    this.life = 0;
    this.maxLife = Math.random() * life + life / 3;
    if (TheTextWasWritten < txtParticleNum) {
        this.txt = textCloud[TheTextWasWritten];
    } else {
        this.txt = textCloud[parseInt(Math.random() * textCloud.length)];
    }
}

Particle.prototype.draw = function () {
    this.x += this.veloX;
    this.y += this.veloY;

    // pattanás padló
    if (this.y > this.floor) {
        this.veloY *= damping;
        this.y = this.floor;
    }

    // pattanás plafon
    if (this.y <= this.size + 66) {
        this.veloY *= damping;
        this.y = this.size + 66;
    }

    // pattanás bal
    if (this.x <= this.size) {
        this.veloX *= damping;
        this.x = this.size;
    }

    // pattanás jobb
    if (this.x > this.right) {
        this.veloX *= damping;
        this.x = this.right;
    }

    // súrlódás és gravitáció
    this.veloX *= friction;
    this.veloY *= friction;
    this.veloY += gravity;

    // life
    this.life++;
    if (this.life >= this.maxLife) {
        delete txtParticles[this.id];
    }

    // életkor számolás az alfához
    this.age = (this.maxLife - this.life) / life;

    // creation
    c.fillStyle = "hsla(" + hslCnt + ", 100%, 80%, " + this.age + ")";
    c.font = "18px Lato";
    c.fillText(this.txt, this.x, this.y);
};

function textExplosion() {
    // emitter
    if (emitterEnabled) {
        for (var i = 0; i < txtParticleNum; i++) {
            new Particle();
            TheTextWasWritten++;
        }
    }
}
// ======================= szöveg animáció vége =======================

// ======================= color clock =======================
// hsl színek beállítása
function colorClock() {
    hslCnt = counter(hslCnt);
    darkColor = 'hsl(' + hslCnt + ', 80%, 10%)';
    bubbleColor = "hsla(" + hslCnt + ", 100%, 50%, 0.2)";
    menuLightColor = "hsl(" + hslCnt + ", 100%, 94%)";
    MenuDarkColor = "hsl(" + hslCnt + ", 40%, 20%)";
    MenuFullColor = "hsl(" + hslCnt + ", 100%, 50%)";
}

// számláló a hsl színhez
function counter(x) {
    if (x == 360) {
        return 1;
    } else {
        return x + 1;
    }
}
// ======================= color clock end =======================
// frame by frame
setInterval(function () {
    c.clearRect(0, 0, W, H);
    colorClock();
    document.documentElement.style.setProperty('--body-color', darkColor);
    document.documentElement.style.setProperty('--menu-light-color', menuLightColor);
    document.documentElement.style.setProperty('--menu-dark-color', MenuDarkColor);
    document.documentElement.style.setProperty('--menu-full-color', MenuFullColor);
    if (title == "Főoldal") {
        for (var i = 0; i < CircleArray.length; i++) {
            CircleArray[i].update();
        }
        for (var i in txtParticles) {
            txtParticles[i].draw();
        }
    }
}, 30);