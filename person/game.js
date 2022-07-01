/* exported debug, game */
/* global Person */

const game = {
	history: {
		/** @type {ObjectThumbnail[]} */
		backData: [],
		/** @type {ObjectThumbnail} */
		current: undefined,
		/** @type {ObjectThumbnail[]} */
		forwardData: [],
		// methods
		back(){
			if (!this.backData.length)
				return;
			this.forwardData.push(this.current);
			this.current = this.backData.pop();
			this.set(this.current);
		},
		forward(){
			if (!this.forwardData.length)
				return;
			this.backData.push(this.current);
			this.current = this.forwardData.pop();
			this.set(this.current);
		},
		/** equivalent to clicking on a hyperlink
		 * @param {ObjectThumbnail} obj */
		go(obj){
			this.forwardData = [];
			if (this.current)
				this.backData.push(this.current);
			this.current = obj;
			this.set(obj);
		},
		/** ONLY set the current displayed object, do not touch history
		 * @param {ObjectThumbnail} obj */
		set(obj){
			/** @param {HTMLDivElement} */
			const infobox = document.getElementById('infobox');
			infobox.innerHTML = '';
			infobox.appendChild(obj.table);
			// console.debug(obj);
		}
	},
	player: Person.gen(),
};

function debug(){
	// console.debug();
}

function main(){
	game;
}

main();