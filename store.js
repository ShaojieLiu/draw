/**
 * Created by liushaojie on 2017/12/8.
 */
class Store {
	constructor() {
		this.state = 'pen'
		this.elements = {}
		this.init()
	}
	
	add(ele) {
		const id = new Date()
		this.elements[id] = ele
	}
	
	init() {
	
	}
}