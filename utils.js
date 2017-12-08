/**
 * Created by liushaojie on 2017/12/8.
 */
const el = sel => document.querySelector(sel)
const log = console.log
const getMiddle = (p0, p1) => ({
	x: (p0.x + p1.x) / 2,
	y: (p0.y + p1.y) / 2,
})
const distance = (p0, p1) => {
	const dx = p1.x - p0.x
	const dy = p1.y - p0.y
	const result = Math.sqrt(dx ** 2 + dy ** 2)
	// log(p0, p1, dx, dy, result)
	return result
}