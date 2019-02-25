var stack,valency,x;

function reset(){
	stack = [];
	return false;
}

function parse(){
	reset();
	var input = document.getElementById('text').value.split(' ');
	input.reverse();
	while (input.length){
		x = input.pop();
		if (x !== ''){
			valency = 0;
			while (input[input.length-1] === 'ba'){
				input.pop();
				valency += 1;
			}
			stack.push('<span class="v'+valency+'">'+x+'</span>');
		}
	}
	document.getElementById('translation').innerHTML = stack.join(' ');
	return false;
}