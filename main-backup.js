const Store = {};

const canvas = document.getElementById('canvas');
const pen = document.getElementById('pen');
const eraser = document.getElementById('eraser');

canvas.onmousemove = onMouseMoveCanvas;
canvas.onmousedown = onMouseDownCanvas;
canvas.onmouseup = onMouseUpCanvas;
canvas.onmouseleave = onMouseLeaveCanvas;

pen.onclick = clickPen;
eraser.onclick = clickEraser;

let state = 'pen';
let path = [];
let isPenDown = false;
let lastLoc = null;
let curLoc = null;

function onMouseMoveCanvas(event) {
	if (state === 'pen') {
		moveDraw(event)
	} else {
		moveEraser(event)
	}
}

function onMouseDownCanvas(event) {
	if (state === 'pen') {
		isPenDown = true;
		beginDraw(event);
	} else {
		beginEraser(event);
	}
}

function onMouseUpCanvas() {

}

function onMouseLeaveCanvas() {

}

function clickPen() {
	state = 'pen';
}

function clickEraser() {
	state = 'eraser';
}

function beginDraw(event) {
	event = event || window.event;
	const x = event.offsetX;
	const y = event.offsetY;

	lastLoc = { x, y }

	path.push({ x, y })
}

function moveDraw(event) {
	const point = {
		x: event.offsetX,
		y: event.offsetY,
	}
	if (curLoc) {
	  //开始绘制直线
	  const nextLoc = {
	    x: point.x,
	    y: point.y
	  };
	  //路程
	  const s = this.calcDistance(nextLoc, this.curLoc);
	  //结束时间
	  const curTimestamp = new Date().getTime();
	  //时间差
	  const t = curTimestamp - this.lastTimestamp;
	  //绘制线条粗细
	  this.lineWidth = this.calcLineWidth(t, s);
	  // 将线宽、点坐标存储在box中
	  this.pointSet.push({
	    x: point.x,
	    y: point.y,
	    lineWidth: this.lineWidth
	  });

	  //绘制
	  const context = this.context;
	  context.beginPath();
	  !this.xc && (this.xc = this.lastLoc.x);
	  !this.yc && (this.yc = this.lastLoc.y);
	  context.moveTo(this.xc, this.yc);
	  this.xc = (this.curLoc.x + nextLoc.x) / 2;
	  this.yc = (this.curLoc.y + nextLoc.y) / 2;
	  context.quadraticCurveTo(this.curLoc.x, this.curLoc.y, this.xc, this.yc);

	  // 将二次贝塞尔曲线保存在path中
	  this.path += `Q${ this.curLoc.x } ${ this.curLoc.y } ${ this.xc } ${ this.yc }`;
	  this.lineWidthArr.push(this.lineWidth);

	  context.strokeStyle = this.strokeColor;
	  context.lineWidth = this.lineWidth;
	  context.lineCap = 'round';
	  context.lineJoin = 'round';
	  context.stroke();

	  // 将当前所有的像素点都放进pixelsPen中
	  // curLoc.x, curLoc.y 当前控制点坐标
	  

	  this.lastLoc = this.curLoc;
	  this.curLoc = nextLoc;
	  //时间更新
	  this.lastTimestamp = curTimestamp;
	  this.lastLineWidth = this.lineWidth;

	} else {
	  curLoc = {
	    x: point.x,
	    y: point.y
	  }
	  
	  this.pointSet.push({
	    x: point.x,
	    y: point.y,
	    lineWidth: this.maxLineWidth
	  })
	}
}

function moveEraser(event) {

}

function beginEraser(event) {

}


