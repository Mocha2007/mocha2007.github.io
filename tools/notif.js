/*
	Script to turn an error into a more accessible popup notification
*/
/* exported notif */
/* global createStyleSheet */

/** use notif.catch(e) to catch errors! */
const notif = {
	/** @param {Error} e */
	catch(e){
		if (!this.cssLoaded)
			this.loadcss();
		const popup = document.createElement('div');
		popup.classList.add('popup');
		const h = document.createElement('h');
		h.innerHTML = e.name;
		popup.innerHTML += e.message;
		document.body.appendChild(popup);
		this.fade(popup);
	},
	cssLoaded: false,
	/**
	 * @param {HTMLElement} elem
	 * @param {number} t in seconds, fade time
	 * @param {number} fps
	 * @param {number} wait in seconds, time to wait before fading
	 */
	fade(elem, t=1, fps=30, wait=5){
		setTimeout(() => {
			let i = t*fps;
			const interval = setInterval(() => {
				elem.style.opacity = i/(t*fps);
				i--;
				if (i <= 0)
					clearInterval(interval);
			}, 1000*t/fps);
		}, 1000*wait);
	},
	loadcss(){
		const ss = createStyleSheet();
		ss.insertRule('.popup{position:absolute;top:0;left:0;border:2px solid red;border-radius:10px;background-color:#f88;color:red;}');
		this.cssLoaded = true;
	},
};