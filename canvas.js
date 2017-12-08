/**
 * Created by liushaojie on 2017/12/8.
 */
class Canvas {
	constructor(dom, store) {
		this.canvas = dom
		this.width = dom.width
		this.height = dom.height
		this.ctx = dom.getContext('2d')
		this.pointArr = []
		this.path = ''
		this.bindAll()
		this.store = store
		this.lineParam = {
			strokeStyle: '#ff0000',
			lineWidth: 1,
		}
		// this.test()
	}
	
	test() {
	
	}
	
	bindAll() {
		const c = this.canvas
		c.addEventListener('mousemove', this.mousemove.bind(this))
		c.addEventListener('mousedown', this.mousedown.bind(this))
		el('html').addEventListener('mouseup', this.mouseup.bind(this))
	}
	
	clear() {
		const { ctx, width, height } = this
		ctx.clearRect(0, 0, width, height)
	}
	
	drawQ(p0, p1, p2, param) {
		// log(arguments)
		const ctx = this.ctx
		const begin = this.lastEnd || p0
		const handle = p1
		const end = {
			x: (p2.x + p1.x) / 2,
			y: (p2.y + p1.y) / 2,
		}
		
		ctx.beginPath()
		ctx.moveTo(begin.x, begin.y)
		ctx.quadraticCurveTo(handle.x, handle.y, end.x, end.y)
		
		if (!this.lastEnd) {this.path = `M ${begin.x} ${begin.y} `}
		this.path += `Q ${handle.x} ${handle.y} ${end.x} ${end.y} `
		
		this.lastEnd = end
		Object.assign(ctx, param)
		
		// ctx.strokeStyle = 'red'
		// ctx.lineWidth = 10
		
		// ctx.lineCap = 'round';
		ctx.lineCap = 'round';
		ctx.stroke();
	}
	
	drawLast3(param) {
		if (this.pointArr.length < 3) {return}
		const last3 = this.pointArr.slice(-3)
		
		this.drawQ(...last3, param)
	}
	
	penMove() {
		const param = this.lineParam
		this.drawLast3(param)
	}
	
	eraserMove() {
		const param = {
			strokeStyle: 'rgba(100, 100, 100, 1.0)',
			lineWidth: 30,
		}
		this.drawLast3(param)
	}
	
	addPoint(ev) {
		const x = ev.offsetX
		const y = ev.offsetY
		this.pointArr.push({x, y})
		this.lastPoint = {x, y}
	}
	
	mousedown(ev) {
		this.isDown = true
		this.addPoint(ev)
	}
	
	mousemove(ev) {
		if (!this.isDown) {return}
		this.addPoint(ev)
		const func = {
			'pen': this.penMove,
			'eraser': this.eraserMove,
		}[this.store.state]
		func.call(this, ev)
	}
	
	penUp(ev) {
		this.store.add(new Line(this.pointArr, this.lineParam, this.path))
	}
	
	eraserUp(ev) {
		Object.values(this.store.elements).forEach(l => {
			const arr = l.pointArr
			
			// arr.reduce((prev, curr) => {
			// 	if (!prev) {return curr}
			// 	const x = (prev.x + curr.x) / 2
			// 	const y = (prev.y + curr.y) / 2
			// 	const pix = this.ctx.getImageData(x, y, 1, 1).data
			// 	log(pix)
			// 	return curr
			// }, null)
			
			let beginPoint = null
			for (let i = 0; i < arr.length - 2; i++) {
				beginPoint = beginPoint || arr[i]
				let end = getMiddle(arr[i + 1], arr[i + 2])
				const b = new Bezier(beginPoint, arr[i + 1], end)
				const result = b.getAllPointAuto()
				
				// testSpeed(beginPoint, arr[i + 1], end)
				// log(result)
				beginPoint = end
			}
		})
	}
	
	mouseup(ev) {
		if (!this.isDown) {return}
		this.addPoint(ev)
		
		const func = {
			'pen': this.penUp,
			'eraser': this.eraserUp,
		}[this.store.state]
		func.call(this, ev)
		
		this.clearTemp()
		this.clear()
		
		this.drawStore()
	}
	
	clearTemp() {
		this.pointArr = []
		this.isDown = false
		this.lastEnd = null
	}
	
	drawStore() {
		Object.values(this.store.elements).forEach(l => this.drawLine(l))
	}
	
	drawLine(line) {
		const { pointArr, param } = line
		pointArr.forEach((p, i) => {
			if (i < 2) { return '' }
			this.drawQ(pointArr[i - 2], pointArr[i - 1], p, param)
		})
		this.clearTemp()
	}
}

const testSpeed = (begin, handle, end) => {
	const path = `M ${begin.x} ${begin.y} Q ${handle.x} ${handle.y} ${end.x} ${end.y}`
	const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	const length = Math.floor(pathElement.getTotalLength());
	{
		console.time('bezier')
		const b = new Bezier(begin, handle, end)
		b.getAllPoint(length)
		console.timeEnd('bezier')
	}
	{
		console.time('path')
		const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pathElement.setAttributeNS(null, 'd', path);
		const length = pathElement.getTotalLength();
		const uint8Array = new Uint8Array(length);
		uint8Array.forEach((item, index) => {
			const point = pathElement.getPointAtLength(index);
		})
		console.timeEnd('path')
	}
}