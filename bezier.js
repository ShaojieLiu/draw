/**
 * Created by liushaojie on 2017/12/8.
 */
class Bezier {
	constructor(begin, handle, end) {
		this.begin = begin
		this.handle = handle
		this.end = end
	}
	
	getT(p0, p1, t) {
		const dx = p1.x - p0.x
		const dy = p1.y - p0.y
		return {
			x: p0.x + dx * t,
			y: p0.y + dy * t,
		}
	}
	
	getPoint(t) {
		const { begin, handle, end } = this
		const pointL = this.getT(begin, handle, t)
		const pointR = this.getT(handle, end, t)
		const p = this.getT(pointL, pointR, t)
		const result = {
			x: Math.round(p.x),
			y: Math.round(p.y),
		}
		return result
	}
	
	getAllPointAuto() {
		const { begin, end } = this
		const count = Math.floor(distance(begin, end) / 2)
		// log(count)
		return this.getAllPoint(count)
	}
	
	getAllPoint(count) {
		const dt = 1 / count
		const arr = new Array(count)
		for (let i = 0; i < count; i ++) {
			arr[i] = this.getPoint(dt * i)
		}
		return arr
	}
}
