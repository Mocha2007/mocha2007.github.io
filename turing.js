var program;
var pointer = 0;
var xsize = 4;
var ysize = 32;
var tapesize = xsize*ysize;

function run(){
	program = document.getElementById('code').value.split("\n");
	console.log(program);
	console.log('Run');
}

function reset(){
	program = [];
	document.getElementById('machinestate').innerHTML = '0';
	document.getElementById('line').innerHTML = '0';

	var tabularasa = '<table>';
	for (i=0;i<xsize;i++) {
		tabularasa+='<tr>';
		for (j=0;j<ysize;j++) {
			tabularasa+='<td id="x'+Number(i*ysize+j)+'">0</td>';
		}
		tabularasa+='</tr>';
	}
	tabularasa+='</table>';
	document.getElementById('memory').innerHTML = tabularasa;

	console.log('Reset');
}

// Main

function fstep(){
	// INC
	var linenumber = Number(document.getElementById('line').innerHTML);
	document.getElementById('line').innerHTML=linenumber+1
	// Determining the command
	var command = program[linenumber];
	// DEBUG
	console.log(linenumber+' '+command);
	if (command.substring(0,3)=='NOP'){
		console.log('NOP');
	}
	else if (command.substring(0,3)=='SET'){
		document.getElementById('machinestate').innerHTML = command.substring(4);
	}
	else if (command.substring(0,3)=='JMP'){
		document.getElementById('line').innerHTML = Number(command.substring(4));
	}
	else if (command.substring(0,3)=='PNT'){
		pointer = Number(command.substring(4))%tapesize;
	}
	else if (command.substring(0,3)=='STO'){
		document.getElementById('x'+pointer).innerHTML = command.substring(4);
	}
	else if (command.substring(0,3)=='INC'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)+1;
	}
	else if (command.substring(0,3)=='DEC'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)-1;
	}
	else if (command.substring(0,3)=='OUT'){
		document.getElementById('machinestate').innerHTML = document.getElementById('x'+pointer).innerHTML;
	}
	else if (command.substring(0,3)=='INP'){
		document.getElementById('x'+pointer).innerHTML = document.getElementById('machinestate').innerHTML;
	}
	else if (command.substring(0,3)=='ADD'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)+Number(command.substring(4));
	}
	else if (command.substring(0,3)=='SUB'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)-Number(command.substring(4));
	}
	else if (command.substring(0,3)=='MUL'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)*Number(command.substring(4));
	}
	else if (command.substring(0,3)=='DIV'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)/Number(command.substring(4));
	}
	else if (command.substring(0,3)=='MOD'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)%Number(command.substring(4));
	}
	else if (command.substring(0,3)=='JIZ'){
		if (document.getElementById('x'+pointer).innerHTML==0){
			document.getElementById('line').innerHTML = Number(command.substring(4));
		}
	}
	else if (command.substring(0,3)=='JNZ'){
		if (document.getElementById('x'+pointer).innerHTML!=0){
			document.getElementById('line').innerHTML = Number(command.substring(4));
		}
	}
	else if (command.substring(0,3)=='JIF'){
		if (document.getElementById('x'+pointer).innerHTML!=0){
			document.getElementById('line').innerHTML = command.substring(4);
		}
	}
	else if (command.substring(0,3)=='GOT'){
		pointer = Number(document.getElementById('x'+pointer).innerHTML);
	}
	else if (command.substring(0,3)=='AND'){
		if (document.getElementById('x'+pointer).innerHTML==0){
			document.getElementById('x'+pointer).innerHTML = Number(command.substring(4));
		}
		else {
			document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML);
		}
	}
	else if (command.substring(0,3)=='IOR'){
		if (document.getElementById('x'+pointer).innerHTML==1){
			document.getElementById('x'+pointer).innerHTML = Number(command.substring(4));
		}
		else {
			document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML);
		}
	}
	else if (command.substring(0,3)=='NEG'){
		document.getElementById('x'+pointer).innerHTML = Number('-'+document.getElementById('x'+pointer).innerHTML);
	}
	else if (command.substring(0,3)=='LLL'){
		pointer=(pointer-1)%tapesize;
	}
	else if (command.substring(0,3)=='RRR'){
		pointer=(pointer+1)%tapesize;
	}
	else {
		document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
		console.warn('Operation not in dictionary: ',command);
	}
	document.getElementById('pointing').innerHTML=pointer;
}