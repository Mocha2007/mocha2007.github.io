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
	// Determining arguments
	if (command.substring(4)==='*'){
		arg = document.getElementById('machinestate').innerHTML;
	}
	else if (command.substring(4)==='$'){
		arg = pointer;
	}
	else if (command.substring(4)==='@'){
		arg = document.getElementById('x'+pointer).innerHTML;
	}
	else{
		arg = command.substring(4);
	}
	var operation = command.substring(0,3);
	// OPERATIONS
	if (operation==='NOP'){
		// 2 + 2 = 4 - 1 = 3
	}
	else if (command.substring(0,1)===':'){
		console.log(command.substring(1));
	}
	else if (operation==='SET'){
		document.getElementById('machinestate').innerHTML = arg;
	}
	else if (operation==='PNT'){
		pointer = mod(Number(arg),tapesize);
	}
	else if (operation==='STO'){
		document.getElementById('x'+pointer).innerHTML = arg;
	}
	else if (operation==='ADD'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)+Number(arg);
	}
	else if (operation==='MUL'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)*Number(arg);
	}
	else if (operation==='EXP'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(document.getElementById('x'+pointer).innerHTML),Number(arg));
	}
	else if (operation==='NRT'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(document.getElementById('x'+pointer).innerHTML),1/Number(arg));
	}
	else if (operation==='DIV'){
		document.getElementById('x'+pointer).innerHTML = Number(document.getElementById('x'+pointer).innerHTML)/Number(arg);
	}
	else if (operation==='MOD'){
		document.getElementById('x'+pointer).innerHTML = mod(Number(document.getElementById('x'+pointer).innerHTML),Number(arg));
	}
	else if (command[0]==='J'){
		// Determining Argument Type
		if (isNaN(arg)){
			var target = program.indexOf(':'+arg);
		}
		else {
			var target = arg;
		}
		// Jump Determination
		if (operation==='JMP'){
			document.getElementById('line').innerHTML = target;
		}
		else if (operation==='JIZ'){
			if (document.getElementById('x'+pointer).innerHTML==='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JNZ'){
			if (document.getElementById('x'+pointer).innerHTML!=='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIF'){
			if (document.getElementById('x'+pointer).innerHTML===document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JFN'){
			if (document.getElementById('x'+pointer).innerHTML!==document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIG'){
			if (document.getElementById('x'+pointer).innerHTML>document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIL'){
			if (document.getElementById('x'+pointer).innerHTML<document.getElementById('machinestate').innerHTML){
				document.getElementById('line').innerHTML = target;
			}
		}
		else {
			console.warn('Jump not in dictionary: '+command);
		}
	}
	else if (operation==='AND'){
		if (document.getElementById('x'+pointer).innerHTML==='1'){
			document.getElementById('x'+pointer).innerHTML = arg;
		}
	}
	else if (operation==='IOR'){
		if (document.getElementById('x'+pointer).innerHTML==='0'){
			document.getElementById('x'+pointer).innerHTML = arg;
		}
	}
	else if (operation==='NEG'){
		document.getElementById('x'+pointer).innerHTML = Number('-'+document.getElementById('x'+pointer).innerHTML);
	}
	else if (operation==='NOT'){
		if (document.getElementById('x'+pointer).innerHTML==='0'){
			document.getElementById('x'+pointer).innerHTML = '1';
		}
		else {
			document.getElementById('x'+pointer).innerHTML = '0';
		}
	}
	else if (operation==='XOR'){
		if (document.getElementById('x'+pointer).innerHTML===arg){
			document.getElementById('x'+pointer).innerHTML = 0;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 1;
		}
	}
	else if (operation==='XNR'){
		if (document.getElementById('x'+pointer).innerHTML==arg){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (operation==='NOR'){
		if (document.getElementById('x'+pointer).innerHTML===arg && arg==='0'){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (operation==='NAN'){
		if (document.getElementById('x'+pointer).innerHTML===arg && arg==='1'){
			document.getElementById('x'+pointer).innerHTML = 0;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 1;
		}
	}
	else if (operation==='MOV'){
		pointer = mod(pointer+Number(arg),tapesize);
	}
	else if (operation==='MMS'){
		document.getElementById('machinestate').innerHTML = Number(document.getElementById('machinestate').innerHTML)+Number(arg);
	}
	else if (operation==='APP'){
		document.getElementById('x'+pointer).innerHTML += arg;
	}
	else if (operation==='LET'){
		var arg1 = arg[0];
		var arg2 = arg.substring(2);
		// Figure out if arg2 is a specialchar
		// Machinestate
		if (arg2==='*'){
			arg2 = document.getElementById('machinestate').innerHTML;
		}
		// Pointer
		else if (arg2==='$'){
			arg2 = pointer;
		}
		// Value
		else if (arg2==='@'){
			arg2 = document.getElementById('x'+pointer).innerHTML;
		}
		// Do shit
		// Machinestate
		if (arg1==='*'){
			document.getElementById('machinestate').innerHTML = arg2;
		}
		// Pointer
		else if (arg1==='$'){
			pointer = arg2;
		}
		// Value
		else if (arg1==='@'){
			document.getElementById('x'+pointer).innerHTML = arg2;
		}
		// Error
		else {
			console.warn('Special not in dictionary: '+arg1);
		}
	}
	else if (operation==='SWP'){
		var arg1 = arg[0];
		var arg2 = arg[2];
		var oldarg2 = arg2;
		// Figure out if arg2 is a specialchar
		// Machinestate
		if (arg2==='*'){
			arg2 = document.getElementById('machinestate').innerHTML;
		}
		// Pointer
		else if (arg2==='$'){
			arg2 = pointer;
		}
		// Value
		else if (arg2==='@'){
			arg2 = document.getElementById('x'+pointer).innerHTML;
		}
		// Error
		else {
			console.warn('Special not in dictionary: '+arg2);
		}
		// Do shit
		// Machinestate
		if (arg1==='*'){
			arg1 = document.getElementById('machinestate').innerHTML
			document.getElementById('machinestate').innerHTML = arg2;
		}
		// Pointer
		else if (arg1==='$'){
			arg1 = pointer;
			pointer = arg2;
		}
		// Value
		else if (arg1==='@'){
			arg1 = document.getElementById('x'+pointer).innerHTML;
			document.getElementById('x'+pointer).innerHTML = arg2;
		}
		// Error
		else {
			console.warn('Special not in dictionary: '+arg1);
		}
		// Do shit some more
		// Machinestate
		if (oldarg2==='*'){
			document.getElementById('machinestate').innerHTML = arg1;
		}
		// Pointer
		else if (oldarg2==='$'){
			pointer = arg1;
		}
		// Value
		else if (oldarg2==='@'){
			document.getElementById('x'+pointer).innerHTML = arg1;
		}
	}
	else {
		console.warn('Operation not in dictionary: '+command);
	}
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x'+pointer).classList.add("pointed");
}