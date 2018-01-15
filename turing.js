// Myinstants
var quos = [];
quos['ALH'] = 'boom_9';
quos['ANG'] = 'aint-nobody-got-time-for-that_1';
quos['BAT'] = 'im-batman';
quos['BFL'] = 'das-war-ein-befehl';
quos['BHS'] = 'boomheadshot.swf';
quos['BOS'] = 'ballsofsteel.swf';
quos['BRL'] = 'barrelroll.swf';
quos['BTS'] = 'wilford-brimley-diabetes';
quos['BTW'] = 'birdtheword.swf';
quos['BZG'] = 'bazinga.swf';
quos['CMB'] = 'combobreaker';
quos['CTT'] = 'mc-hammer-u-cant-touch-this';
quos['DOH'] = 'doh.swf';
quos['DOI'] = 'senator-palpatine-do-it_1';
quos['DRK'] = 'hellodarknessmyoldfriend';
quos['DUL'] = 'its-time-to-duel';
quos['EAG'] = 'ea_games';
quos['FNH'] = 'finishhim.swf';
quos['FRD'] = 'fus-ro-dah';
quos['GAY'] = 'ha-gay';
quos['HHA'] = 'haha.swf';
quos['HHH'] = 'hahahahihihihehehe';
quos['HLJ'] = 'hallelujahshort.swf';
quos['IKU'] = 'ahmed-the-dead-terrorist-silence-i-kill-you_';
quos['ILT'] = 'i-like-turtles';
quos['JCN'] = 'john-cena_5';
quos['JDI'] = 'real_1';
quos['KHN'] = 'khaaan.swf';
quos['LDL'] = 'lee-leedle';
quos['LEG'] = 'my-leg_2';
quos['LRJ'] = 'leroy.swf';
quos['LSN'] = 'hey_listen';
quos['LYN'] = 'why-you-always-lying-original';
quos['LZR'] = 'sound-9___';
quos['MGY'] = 'idubbbz-im-gay-free-download';
quos['MSF'] = 'dank-meme-compilation-volume-17_cutted';
quos['MSK'] = 'im-mr';
quos['NGP'] = 'no-god-please-no-noooooooooo';
quos['NOM'] = 'sound-8';
quos['NOO'] = 'nooo.swf';
quos['NOT'] = 'noot-noot';
quos['O66'] = 'order66';
quos['OMY'] = 'oh_my';
quos['PKL'] = 'pickle_rick';
quos['PNG'] = 'pingas-richard-89282878';
quos['PUS'] = 'grab-them-by-the-p__y';
quos['RDN'] = 'chamillionaire-ridin-ft-krayzie-bone';
quos['RRL'] = 'epic.swf_1';
quos['SFU'] = 'shut-the-fuck-up';
quos['SHU'] = 'shutup.swf';
quos['SKR'] = 'the-ting-go-skra';
quos['SMF'] = 'surprise-motherfucker';
quos['STP'] = 'its-time-to-stop-button';
quos['SWE'] = 'snoop-dogg-smoke-weed-everyday';
quos['TIS'] = 'thisissparta.swf';
quos['TPL'] = 'oh-baby-a-triple';
quos['TRL'] = 'trollolol.swf';
quos['TRP'] = 'itsatrap.swf';
quos['TTR'] = 'tuturu_1';
quos['TWE'] = 'that_was_easy';
quos['UTN'] = 'utini';
quos['WLL'] = 'sound-9';
quos['YAA'] = 'sound-9______';
quos['YEE'] = 'yee';
quos['YES'] = 'm_1';
var sfxs = [];
sfxs['5NF'] = 'five-nights-at-freddys-full-scream-sound_2';
sfxs['APP'] = 'applause-4';
sfxs['BEL'] = 'correct.swf';
sfxs['CRK'] = 'crickets.swf';
sfxs['DNG'] = 'ding-sound-effect_2';
sfxs['DPH'] = 'dolphin';
sfxs['DRM'] = 'drumroll.swf';
sfxs['JPD'] = 'jeopardy';
sfxs['LNO'] = 'dun_dun_1';
sfxs['LOS'] = 'the-price-is-right-losing-horn';
sfxs['MLG'] = 'mlg-airhorn';
sfxs['NCP'] = 'inceptionbutton';
sfxs['QAK'] = 'cuek.swf';
sfxs['RBX'] = 'roblox-death-sound_1';
sfxs['SAX'] = 'george-micael-wham-careless-whisper-1';
sfxs['SFL'] = 'seinfeld-theme_1';
sfxs['SHY'] = 'grin';
sfxs['SWX'] = 'switch-sound';
sfxs['TDA'] = 'tada.swf';
sfxs['VLN'] = 'tf_nemesis';
sfxs['VVZ'] = 'vuvuzela';
sfxs['WED'] = 'it-is-wednesday-my-dudes-vine';
sfxs['WHP'] = 'crack_the_whip';
sfxs['WKA'] = 'wakawaka.swf';
sfxs['WLD'] = 'wubalubadubdubs-rick-and-morty';
sfxs['WLH'] = 'wilhelmscream';
sfxs['WSL'] = 'goodbadugly-whistle-long';
sfxs['WYP'] = 'watch-your-profanity_1';
sfxs['XFL'] = 'x-files-theme-song-copy';
sfxs['XPE'] = 'erro';

function mod(n,m){
	return ((n%m)+m)%m;
}

function EnglishNumber(integer){
	var words = ['zero','one','two','three','four','five','six','seven','eight','nine'];
	var teens = ['ten','eleven','twelve','thir','four','fif','six','seven','eigh','nine'];
	var illions = [';)','thousand','m','b','tr'];
	var string = '';
	// Zero & Negatives
	if (integer===0){
		return words[0];
	}
	else if (integer<0){
		string+='negative ';
	}
	integer = Math.abs(integer);
	// Digits
	if (integer<10){
		return string+words[integer];
	}
	//Teens
	else if (integer===10){
		return string+teens[0];
	}
	else if (integer<13){
		return string+teens[integer-10];
	}
	else if (integer<20){
		return string+teens[integer-10]+'teen';
	}
	//twenties
	else if (integer===20){
		return string+'twenty';
	}
	else if (integer<30){
		return string+'twenty-'+words[integer%10];
	}
	// X0
	else if (integer<100 && integer%10===0){
		return string+teens[+(integer+[])[0]]+'ty';
	}
	// XX
	else if (integer<100){
		return string+teens[+(integer+[])[0]]+'ty-'+words[integer%10];
	}
	// 100
	else if (integer===100){
		return string+'a hundred';
	}
	// 1XX
	else if (integer<200){
		return string+'a hundred '+EnglishNumber(integer-100);
	}
	// XXX
	else if (integer<1e3){
		return string+words[+(integer+[])[0]]+' hundred '+EnglishNumber(integer%100);
	}
	// 1,XXX
	else if (integer<2e3){
		return string+'a '+illions[1]+' '+EnglishNumber(integer-1e3);
	}
	// XXX,XXX
	else if (integer<1e6){
		return string+EnglishNumber(Math.floor(integer/1e3))+' '+illions[1]+' '+EnglishNumber(integer%1e3);
	}
	// 1,XXX,XXX
	else if (integer<2e6){
		return string+'a '+illions[2]+'illion '+EnglishNumber(integer-1e6);
	}
	// XXX,XXX,XXX
	else if (integer<1e9){
		return string+EnglishNumber(Math.floor(integer/1e6))+' '+illions[2]+'illion '+EnglishNumber(integer%1e6);
	}
	// 1,XXX,XXX,XXX
	else if (integer<2e9){
		return string+'a '+illions[3]+'illion '+EnglishNumber(integer-1e9);
	}
	// XXX,XXX,XXX,XXX
	else if (integer<1e12){
		return string+EnglishNumber(Math.floor(integer/1e9))+' '+illions[3]+'illion '+EnglishNumber(integer%1e9);
	}
	// 1,XXX,XXX,XXX,XXX
	else if (integer<2e12){
		return string+'a '+illions[4]+'illion '+EnglishNumber(integer-1e12);
	}
	// XXX,XXX,XXX,XXX,XXX
	else if (integer<1e15){
		return string+EnglishNumber(Math.floor(integer/1e12))+' '+illions[4]+'illion '+EnglishNumber(integer%1e12);
	}
	else {
		return 'a really, really big number'
	}
}

// MAIN

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
	// Bad Practices
	// blank
	if (program==''){
			console.warn('No Program\n@ Line 0\n ');
	}
	// Last line is a label but not :X
	if (program[program.length-1][0]===':' && program[program.length-1]!==':X'){
			console.warn('Last line is label but not ":X"\n@ Line '+(program.length-1)+'\n\t'+program[program.length-1]);
	}
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
	var linenumber = Number(document.getElementById('line').innerHTML);
	// Determining the command
	var command = program[linenumber];
	// Reject
	if (command==undefined || command===''){
		document.getElementById('machinestate').innerHTML = '[HALTED]';
		console.log('The End.');
		return true;
	}
	// INC
	document.getElementById('line').innerHTML=linenumber+1
	// Remove color
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
	// Generating errors for number-only ops
	var badop = 'Useless operation written by a useless coder\n@ Line ';
	if ('ADD DIV EXP MMS MOD MOV MUL NRT FUN I2W'.indexOf(operation)!==-1 && isNaN(Number(arg))){
			console.error('"'+arg+'" not number\n@ Line '+linenumber+'\n\t'+command);
			document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
			return true
	}
	// Generating warning for specialchar-duped ops
	else if ('LET SWP'.indexOf(operation)!==-1 && ['* *','$ $','@ @'].indexOf(arg)!==-1){
			console.warn(badop+linenumber+'\n\t'+command);
	}
	// Generating warning for other NOPs arg===0
	else if ('ADD IOR MMS MOV'.indexOf(operation)!==-1 && Number(arg)===0){
			console.warn(badop+linenumber+'\n\t'+command);
	}
	// Generating warning for other NOPs arg===1
	else if ('DIV EXP MUL NRT'.indexOf(operation)!==-1 && Number(arg)===1){
			console.warn(badop+linenumber+'\n\t'+command);
	}
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
		if (arg==='0'){
			console.error('Zero divisor\n@ Line '+linenumber+'\n\t'+command);
			return true
		}
	}
	else if (operation==='MOD'){
		document.getElementById('x'+pointer).innerHTML = mod(Number(specialtarget),Number(arg));
		if (arg==='0'){
			console.error('Zero divisor\n@ Line '+linenumber+'\n\t'+command);
			return true
		}
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
			console.error('Jump not in dictionary: '+command+'\n@ Line '+linenumber+'\n\t'+command);
			document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
			return true
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
			console.error('Special not in dictionary: '+arg1+'\n@ Line '+linenumber+'\n\t'+command);
			document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
			return true
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
			console.error('Special not in dictionary: '+arg2+'\n@ Line '+linenumber+'\n\t'+command);
			document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
			return true
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
			console.error('Special not in dictionary: '+arg1+'\n@ Line '+linenumber+'\n\t'+command);
			document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
			return true
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
	else if (operation==='LEN'){
		document.getElementById('x'+pointer).innerHTML = arg.length;
	}
	// WEIRD AND HARDLY USEFUL COMMANDS
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
	else if (operation==='I2W'){
		document.getElementById('x'+pointer).innerHTML = EnglishNumber(arg);
	}
	else if (operation==='SFX'){
		// Unique
		if (arg==='PTY'){
			new Audio('snd/partyhorn.mp3').play();
		}
		else if (arg==='SAD'){
			new Audio('http://www.orangefreesounds.com/wp-content/uploads/2015/07/Sad-trombone.mp3').play();
		}
		else {
			try {
				new Audio('https://www.myinstants.com/media/sounds/'+sfxs[arg]+'.mp3').play();
			}
			catch (e) {
				console.warn('SFX may not be in dictionary: '+arg+'\n\tGave error: '+e);
			}
		}
	}
	else if (operation==='QUO'){
		// Unique
		if (arg==='PYT'){
			new Audio('https://www.intriguing.com/mp/_sounds/hg/hamster.wav').play();
		}
		else {
			try {
				new Audio('https://www.myinstants.com/media/sounds/'+quos[arg]+'.mp3').play();
			}
			catch (e) {
				console.warn('QUO may not be in dictionary: '+arg+'\n\tGave error: '+e);
			}
		}
	}
	else {
		console.error('Operation not in dictionary: '+command+'\n@ Line '+linenumber+'\n\t'+command);
		document.getElementById('machinestate').innerHTML = '[ERR CHECK CONSOLE]';
		return true
	}
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x'+pointer).classList.add("pointed");
}