// // === БАЗОВЫЕ УТИЛИТЫ ===
// class Vec2 {
// constructor(x=0, y=0) { this.x = x; this.y = y; }
// add(v) { this.x += v.x; this.y += v.y; return this; }
// clone() { return new Vec2(this.x, this.y); }
// }
// // === БАЗОВЫЙ КЛАСС СУЩНОСТИ ===
// class Entity {
// #pos; #vel; #w; #h;
// constructor(x, y, w, h) { this.#pos = new Vec2(x,y); this.#vel = new Vec2(); this.#w=w; this.#h=h; this.dead=false; }
// get x(){ return this.#pos.x } set x(v){ this.#pos.x = v }
// get y(){ return this.#pos.y } set y(v){ this.#pos.y = v }
// get w(){ return this.#w } get h(){ return this.#h }
// get vel(){ return this.#vel }
// update(dt, game) {}
// render(ctx) {}
// intersects(other){ return !(this.x+this.w < other.x || other.x+other.w < this.x || this.y+this.h < other.y || other.y+other.h < this.y); }
// }

class Entity {
  static #Vec2 = class {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    clone() {
      return new Entity.#Vec2(this.x, this.y);
    }
  };
  #pos;#vel;#w;#h;
  constructor(x, y, w, h) {
    this.#pos = new Entity.#Vec2(x, y);
    this.#vel = new Entity.#Vec2();
    this.#w = w;
    this.#h = h;
    this.dead = false;
  }
  get x() { return this.#pos.x }
  set x(v) { this.#pos.x = v }
  get y() { return this.#pos.y }
  set y(v) { this.#pos.y = v }
  get w() { return this.#w }
  get h() { return this.#h }
  get vel() { return this.#vel }
  update(dt, game) {}
  render(ctx) {}
  intersects(other) {
    return !(
      this.x + this.w < other.x ||
      other.x + other.w < this.x ||
      this.y + this.h < other.y ||
      other.y + other.h < this.y
    );
  }
}

// === ИГРОК ===
class Player extends Entity {
static SPEED = 360;
#color = '#7cc4ff';
constructor(x,y){ super(x,y,64,18); }
update(dt, game){
const dir = (game.input.left?-1:0) + (game.input.right?1:0);
this.x += dir * Player.SPEED * dt;
this.x = Math.max(0, Math.min(game.width - this.w, this.x));
}
render(ctx){
ctx.fillStyle = this.#color;
ctx.fillRect(this.x, this.y, this.w, this.h);
}
}
// === ПАДАЮЩИЕ ОБЪЕКТЫ ===
class Falling extends Entity {
constructor(x,y,w,h){ super(x,y,w,h); this.vel.y = 120 + Math.random()*120; }
update(dt, game){ this.y += this.vel.y * dt; if(this.y>game.height){ this.dead = true; } }
}
class Star extends Falling {
static POINTS = 50;
render(ctx){
ctx.fillStyle = '#9effa6';
ctx.beginPath();
const cx=this.x+this.w/2, cy=this.y+this.h/2, r=this.w/2;
for(let i=0;i<5;i++){ const a= i*2*Math.PI/5; ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); }
ctx.closePath(); ctx.fill();
}
}


class Meteor extends Falling {
render(ctx){
ctx.fillStyle = '#ff7c7c';
ctx.beginPath(); ctx.arc(this.x+this.w/2, this.y+this.h/2, this.w/2, 0, Math.PI*2); ctx.fill();
}
}
// === ИНПУТ ===
class Input {
left=false; right=false; paused=false;
constructor(){
const set=(k,v)=>{ if(['ArrowLeft','a','A'].includes(k)) this.left=v; if(['ArrowRight','d','D'].includes(k)) this.right=v; if(k==='p' || k==='P') this.paused = !this.paused; };
window.addEventListener('keydown', e=> set(e.key,true));
window.addEventListener('keyup', e=> set(e.key,false));
}
}


// === КЛАСС ИГРЫ ===
class Game {
static #bestScore = Number(localStorage.getItem('bestScore')||0);
static get bestScore(){ return Game.#bestScore }
static set bestScore(v){ Game.#bestScore = v; localStorage.setItem('bestScore', String(v)); }


#ctx; #last=0; #acc=0; #spawn=0; #running=false;
#entities = []; #player; #score=0; #lives=3; #difficulty=0;


constructor(canvas){
this.canvas = canvas; this.width = canvas.width; this.height = canvas.height; this.#ctx = canvas.getContext('2d');
this.input = new Input();
this.#player = new Player(this.width/2-32, this.height-30);
this.ui = {
score: document.querySelector('#score'),
lives: document.querySelector('#lives'),
best: document.querySelector('#best'),
diffBar: document.querySelector('#diffBar'),
};
this.ui.best.textContent = Game.bestScore;
}


get score(){ return this.#score }
set score(v){ this.#score = v; this.ui.score.textContent = v; if(v>Game.bestScore) Game.bestScore = v; this.ui.best.textContent = Game.bestScore; }
get lives(){ return this.#lives }
set lives(v){ this.#lives = v; this.ui.lives.textContent = v; if(v<=0) this.stop(); }


start(){ if(this.#running) return; this.#running=true; this.#last=performance.now(); requestAnimationFrame(this.#loop); }
stop(){ this.#running=false; this.#drawOverlay('Игра окончена — нажмите R для рестарта'); }
togglePause(){ if(!this.#running) return; this.input.paused = !this.input.paused; if(this.input.paused) this.#drawOverlay('Пауза'); }
reset(){ this.#entities = []; this.score=0; this.lives=3; this.#difficulty=0; this.#spawn=0; this.#acc=0; this.#clear(); this.#player.x=this.width/2-32; this.#player.y=this.height-30; }


#loop = (t)=>{
if(!this.#running) return;
const dt = Math.min(0.033, (t - this.#last)/1000); this.#last = t; if(!this.input.paused){ this.update(dt); this.render(); }
requestAnimationFrame(this.#loop);
}
update(dt){
this.#acc += dt; this.#difficulty = Math.min(1, this.#acc/60);
this.ui.diffBar.style.width = Math.round(this.#difficulty*100) + '%';


this.#spawn -= dt;
if(this.#spawn <= 0){
const x = Math.random()*(this.width-26);
const isStar = Math.random() < 0.65;
const obj = isStar ? new Star(x, -26, 26, 26) : new Meteor(x, -24, 24, 24);
obj.vel.y *= (1 + this.#difficulty*1.5);
this.#entities.push(obj);
this.#spawn = 0.5 - this.#difficulty*0.35 + Math.random()*0.25;
}


this.#player.update(dt, this);
for(const e of this.#entities) e.update(dt, this);


for(const e of this.#entities){
if(e.dead) continue;
if(e.intersects(this.#player)){
if(e instanceof Star){ this.score += Star.POINTS; }
else if(e instanceof Meteor){ this.lives -= 1; }
e.dead = true;
}
}
this.#entities = this.#entities.filter(e=>!e.dead);
}
render(){
const ctx = this.#ctx; this.#clear();
ctx.globalAlpha = 1; ctx.fillStyle = '#0b1020'; ctx.fillRect(0,0,this.width,this.height);
ctx.globalAlpha = 0.2; for(let i=0;i<40;i++){ ctx.fillRect(Math.random()*this.width, Math.random()*this.height, 2,2); }
ctx.globalAlpha = 1;


this.#player.render(ctx);
for(const e of this.#entities) e.render(ctx);
}


#clear(){ this.#ctx.clearRect(0,0,this.width,this.height); }


#drawOverlay(text){
const ctx = this.#ctx;
ctx.save();
ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,this.width,this.height);
ctx.fillStyle = '#e8f1ff'; ctx.font = '600 24px system-ui'; ctx.textAlign='center';
ctx.fillText(text, this.width/2, this.height/2);
ctx.restore();
}
}
// === ИНИЦИАЛИЗАЦИЯ ===
const canvas = document.getElementById('game');
const game = new Game(canvas);


document.getElementById('btnStart').addEventListener('click', ()=>{ game.reset(); game.start(); });
document.getElementById('btnPause').addEventListener('click', ()=> game.togglePause());
document.getElementById('btnReset').addEventListener('click', ()=>{ localStorage.removeItem('bestScore'); Game.bestScore = 0; document.getElementById('best').textContent = 0; });


window.addEventListener('keydown', (e)=>{
if(e.key==='r' || e.key==='R'){ game.reset(); game.start(); }
if(e.key==='p' || e.key==='P'){ game.togglePause(); }
});