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
	// Grabbing specials beforehand
	var specialstate = document.getElementById('machinestate').innerHTML;
	var specialtarget = document.getElementById('x'+pointer).innerHTML;
	// Determining arguments
	arg = command.substring(4);
	if (arg==='*'){
		arg = specialstate;
	}
	else if (arg==='$'){
		arg = pointer;
	}
	else if (arg==='@'){
		arg = specialtarget;
	}
	var operation = command.substring(0,3);
	// OPERATIONS
	if (command.substring(0,1)===':'){
		console.log(command.substring(1));
	}
	else if (operation==='ADD'){
		document.getElementById('x'+pointer).innerHTML = Number(specialtarget)+Number(arg);
	}
	else if (operation==='MUL'){
		document.getElementById('x'+pointer).innerHTML = Number(specialtarget)*Number(arg);
	}
	else if (operation==='EXP'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(specialtarget),Number(arg));
	}
	else if (operation==='NRT'){
		document.getElementById('x'+pointer).innerHTML = Math.pow(Number(specialtarget),1/Number(arg));
	}
	else if (operation==='DIV'){
		document.getElementById('x'+pointer).innerHTML = Number(specialtarget)/Number(arg);
	}
	else if (operation==='MOD'){
		document.getElementById('x'+pointer).innerHTML = mod(Number(specialtarget),Number(arg));
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
			if (specialtarget==='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JNZ'){
			if (specialtarget!=='0'){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIF'){
			if (specialtarget===specialstate){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JNE'){
			if (specialtarget!==specialstate){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIG'){
			if (specialtarget>specialstate){
				document.getElementById('line').innerHTML = target;
			}
		}
		else if (operation==='JIL'){
			if (specialtarget<specialstate){
				document.getElementById('line').innerHTML = target;
			}
		}
		else {
			console.warn('Jump not in dictionary: '+command);
		}
	}
	else if (operation==='AND'){
		if (specialtarget==='1'){
			document.getElementById('x'+pointer).innerHTML = arg;
		}
	}
	else if (operation==='IOR'){
		if (specialtarget==='0'){
			document.getElementById('x'+pointer).innerHTML = arg;
		}
	}
	else if (operation==='NEG'){
		document.getElementById('x'+pointer).innerHTML = -Number(specialtarget);
	}
	else if (operation==='INV'){
		document.getElementById('x'+pointer).innerHTML = 1/Number(specialtarget);
	}
	else if (operation==='NOT'){
		if (specialtarget==='0'){
			document.getElementById('x'+pointer).innerHTML = '1';
		}
		else {
			document.getElementById('x'+pointer).innerHTML = '0';
		}
	}
	else if (operation==='XOR'){
		if (specialtarget===arg){
			document.getElementById('x'+pointer).innerHTML = 0;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 1;
		}
	}
	else if (operation==='XNR'){
		if (specialtarget==arg){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (operation==='NOR'){
		if (specialtarget===arg && arg==='0'){
			document.getElementById('x'+pointer).innerHTML = 1;
		}
		else {
			document.getElementById('x'+pointer).innerHTML = 0;
		}
	}
	else if (operation==='NAN'){
		if (specialtarget===arg && arg==='1'){
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
		document.getElementById('machinestate').innerHTML = Number(specialstate)+Number(arg);
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
			arg2 = specialstate;
		}
		// Pointer
		else if (arg2==='$'){
			arg2 = pointer;
		}
		// Value
		else if (arg2==='@'){
			arg2 = specialtarget;
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
			arg2 = specialstate;
		}
		// Pointer
		else if (arg2==='$'){
			arg2 = pointer;
		}
		// Value
		else if (arg2==='@'){
			arg2 = specialtarget;
		}
		// Error
		else {
			console.warn('Special not in dictionary: '+arg2);
		}
		// Do shit
		// Machinestate
		if (arg1==='*'){
			arg1 = specialstate
			document.getElementById('machinestate').innerHTML = arg2;
		}
		// Pointer
		else if (arg1==='$'){
			arg1 = pointer;
			pointer = arg2;
		}
		// Value
		else if (arg1==='@'){
			arg1 = specialtarget;
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
	else if (operation==='FUN'){
		var otherlinenumber = linenumber+Number(arg);
		var temp = program[linenumber];
		program[linenumber] = program[otherlinenumber];
		program[otherlinenumber] = temp;
		console.log(program);
	}
	else if (operation==='FSW'){
		// Specials replacement
		arg = arg.replace('*',specialstate).replace('$',pointer).replace('@',specialtarget);
		
		var onelinenumber = Number(arg.split(",")[0]);
		var anotherlinenumber = Number(arg.split(",")[1]);
		var temp = program[onelinenumber];
		program[onelinenumber] = program[anotherlinenumber];
		program[anotherlinenumber] = temp;
		console.log(program);
	}
	else if (operation==='FRG'){
		// Specials replacement
		arg = arg.replace('*',specialstate).replace('$',pointer).replace('@',specialtarget);
		
		var onelinenumber = Number(arg.split(/,(.+)/)[0]);
		var oneargs = arg.split(/,(.+)/)[1];
		program[onelinenumber] = program[onelinenumber].substring(0,4)+oneargs;
		console.log(program);
	}
	else if (operation==='FAA'){
		// Specials replacement
		var args = arg.replace('*',specialstate).replace('$',pointer).replace('@',specialtarget).split(',');
		var oldcode = program.join('\n');
		var code1 = oldcode.substring(0,Number(args[0]));
		var code2 = oldcode.substring(Number(args[2]),Number(args[3]));
		var code3 = oldcode.substring(Number(args[1]),oldcode.length-1);/*
		// undef bugfix
		if (code3===undefined){
			code3='';
		}*/

		console.log([code1,code2,code3]);
		var newcode = code1+code2+code3
		
		console.log(newcode);
		program = newcode.split('\n');
	
		console.log(program);
	}
	else if (operation==='LEN'){
		document.getElementById('x'+pointer).innerHTML = arg.length;
	}
	else {
		console.warn('Operation not in dictionary: '+command);
	}
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x'+pointer).classList.add("pointed");
}