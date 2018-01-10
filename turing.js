function mod(n,m){
	return ((n%m)+m)%m;
}

var program;
var pointer;
var xsize = 4;
var ysize = 32;
var tapesize = xsize*ysize;

function run(){
	document.getElementById('machinestate').innerHTML = '0';
	program = document.getElementById('code').value.split("\n");
	console.log(program);
	console.log('Load');
}

function reset(){
	program = [];
	document.getElementById('machinestate').innerHTML = '[PRESS LOAD]';
	document.getElementById('line').innerHTML = '0';
	
	//table construction
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
	
	//pointer
	if (document.getElementById('x'+pointer)!=null){
		document.getElementById('x'+pointer).classList.remove("pointed");
	}
	pointer = 0;
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x0').classList.add("pointed");

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
	// Reject
	if (command==undefined){
		document.getElementById('line').innerHTML = linenumber;
		document.getElementById('machinestate').innerHTML = '[HALTED]';
		return true;
	}
	document.getElementById('x'+pointer).classList.remove("pointed");
	// Commands
	if (command.substring(0,3)==='NOP'){
		// 2 + 2 = 4 - 1 = 3
	}
	else if (command.substring(0,1)===':'){
		console.log(command.substring(1));
	}
	else if (command.substring(0,3)==='SET'){
		document.getElementById('machinestate').innerHTML = command.substring(4);
	}
	else if (command.substring(0,3)==='PNT'){
		pointer = mod(Number(command.substring(4)),tapesize);
	}
	else if (command.substring(0,3)==='STO'){
		document.getElementById('x'+pointer).innerHTML = command.substring(4);
	}
	else if (command.substring(0,3)==='INC'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)+1;
	}
	else if (command.substring(0,3)==='DEC'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)-1;
	}
	else if (command.substring(0,3)==='OUT'){
		document.getElementById('machinestate').innerHTML = document.getElementById('x'+pointer).innerHTML;
	}
	else if (command.substring(0,3)==='INP'){
		document.getElementById('x'+pointer).innerHTML = document.getElementById('machinestate').innerHTML;
	}
	else if (command.substring(0,3)==='ADD'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)+Number(command.substring(4));
	}
	else if (command.substring(0,3)==='SUB'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)-Number(command.substring(4));
	}
	else if (command.substring(0,3)==='MUL'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)*Number(command.substring(4));
	}
	else if (command.substring(0,3)==='EXP'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(document.getElementById('x'+pointer).innerHTML),Number(command.substring(4)));
	}
	else if (command.substring(0,3)==='NRT'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(document.getElementById('x'+pointer).innerHTML),1/Number(command.substring(4)));
	}
	else if (command.substring(0,3)==='DIV'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)/Number(command.substring(4));
	}
	else if (command.substring(0,3)==='MOD'){
		document.getElementById('x'+pointer).innerHTML = mod(Number(document.getElementById('x'+pointer).innerHTML),Number(command.substring(4)));
	}
	else if (command.charAt(0)==='J'){
		// Determining Argument Type
		if (isNaN(command.substring(4))){
			var target = program.indexOf(':'+command.substring(4));
		}
		else {
			var target = command.substring(4);
		}
		// Jump Determination
		if (command.substring(0,3)==='JMP'){
			document.getElementById('line').innerHTML = target;
		}
		else if (command.substring(0,3)==='JIZ'){
			if (document.getElementById('x'+pointer).innerHTML==='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (command.substring(0,3)==='JNZ'){
			if (document.getElementById('x'+pointer).innerHTML!=='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (command.substring(0,3)==='JIF'){
			if (document.getElementById('x'+pointer).innerHTML===document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (command.substring(0,3)==='JFN'){
			if (document.getElementById('x'+pointer).innerHTML!==document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (command.substring(0,3)==='JIG'){
			if (document.getElementById('x'+pointer).innerHTML>document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (command.substring(0,3)==='JIL'){
			if (document.getElementById('x'+pointer).innerHTML<document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else {
			console.warn('Jump not in dictionary: ',command);
		}
	}
	else if (command.substring(0,3)==='GOT'){
		pointer = Number(document.getElementById('machinestate').innerHTML);
	}
	else if (command.substring(0,3)==='AND'){
		if (document.getElementById('x'+pointer).innerHTML==='1'){
			document.getElementById('x'+pointer).innerHTML = command.substring(4);
		}
	}
	else if (command.substring(0,3)==='IOR'){
		if (document.getElementById('x'+pointer).innerHTML==='0'){
			document.getElementById('x'+pointer).innerHTML = command.substring(4);
		}
	}
	else if (command.substring(0,3)==='NEG'){
		document.getElementById('x'+pointer).innerHTML = Number('-'+document.getElementById('x'+pointer).innerHTML);
	}
	else if (command.substring(0,3)==='LLL'){
		pointer=mod(pointer-1,tapesize);
	}
	else if (command.substring(0,3)==='RRR'){
		pointer=mod(pointer+1,tapesize);
	}
	else if (command.substring(0,3)==='NOT'){
		if (document.getElementById('x'+pointer).innerHTML==='0'){
			document.getElementById('x'+pointer).innerHTML = '1';
		}
		else {
			document.getElementById('x'+pointer).innerHTML = '0';
		}
	}
	else if (command.substring(0,3)==='SSP'){
		document.getElementById('machinestate').innerHTML = pointer;
	}
	else if (command.substring(0,3)==='XOR'){
		if (document.getElementById('x'+pointer).innerHTML===command.substring(4)){
			document.getElementById('x'+pointer).innerHTML = 0;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 1;
		}
	}
	else if (command.substring(0,3)==='XNR'){
		if (document.getElementById('x'+pointer).innerHTML==command.substring(4)){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (command.substring(0,3)==='NOR'){
		if (document.getElementById('x'+pointer).innerHTML===command.substring(4) && command.substring(4)==='0'){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (command.substring(0,3)==='NAN'){
		if (document.getElementById('x'+pointer).innerHTML===command.substring(4) && command.substring(4)==='1'){
			document.getElementById('x'+pointer).innerHTML = 0;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 1;
		}
	}
	else if (command.substring(0,3)==='MOV'){
		pointer = mod(pointer+Number(command.substring(4)),tapesize);
	}
	else if (command.substring(0,3)==='APP'){
		document.getElementById('x'+pointer).innerHTML += command.substring(4);
	}
	else {
		console.warn('Operation not in dictionary: ',command);
	}
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x'+pointer).classList.add("pointed");
}