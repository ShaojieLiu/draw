/**
 * Created by liushaojie on 2017/12/8.
 */
class Tool {
	constructor(store) {
		this.store = store
		this.init()
	}
	
	init() {
		const store = this.store
		const pen = el('#pen')
		const eraser = el('#eraser')
		pen.addEventListener('click', ev => store.state = 'pen')
		eraser.addEventListener('click', ev => store.state = 'eraser')
	}
}