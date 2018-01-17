var versionno = '180116f';
// Myinstants
var quos = [];
quos.ALH = 'boom_9';
quos.ANG = 'aint-nobody-got-time-for-that_1';
quos.BAT = 'im-batman';
quos.BFL = 'das-war-ein-befehl';
quos.BHS = 'boomheadshot.swf';
quos.BOS = 'ballsofsteel.swf';
quos.BRL = 'barrelroll.swf';
quos.BTS = 'wilford-brimley-diabetes';
quos.BTW = 'birdtheword.swf';
quos.BZG = 'bazinga.swf';
quos.CMB = 'combobreaker';
quos.CTT = 'mc-hammer-u-cant-touch-this';
quos.DOH = 'doh.swf';
quos.DOI = 'senator-palpatine-do-it_1';
quos.DRK = 'hellodarknessmyoldfriend';
quos.DUL = 'its-time-to-duel';
quos.EAG = 'ea_games';
quos.FNH = 'finishhim.swf';
quos.FRD = 'fus-ro-dah';
quos.GAY = 'ha-gay';
quos.HHA = 'haha.swf';
quos.HHH = 'hahahahihihihehehe';
quos.HLJ = 'hallelujahshort.swf';
quos.IKU = 'ahmed-the-dead-terrorist-silence-i-kill-you_';
quos.ILT = 'i-like-turtles';
quos.JCN = 'john-cena_5';
quos.JDI = 'real_1';
quos.KHN = 'khaaan.swf';
quos.LDL = 'lee-leedle';
quos.LEG = 'my-leg_2';
quos.LRJ = 'leroy.swf';
quos.LSN = 'hey_listen';
quos.LYN = 'why-you-always-lying-original';
quos.LZR = 'sound-9___';
quos.MGY = 'idubbbz-im-gay-free-download';
quos.MSF = 'dank-meme-compilation-volume-17_cutted';
quos.MSK = 'im-mr';
quos.NGP = 'no-god-please-no-noooooooooo';
quos.NOM = 'sound-8';
quos.NOO = 'nooo.swf';
quos.NOT = 'noot-noot';
quos.O66 = 'order66';
quos.OMY = 'oh_my';
quos.PKL = 'pickle_rick';
quos.PNG = 'pingas-richard-89282878';
quos.PUS = 'grab-them-by-the-p__y';
quos.RDN = 'chamillionaire-ridin-ft-krayzie-bone';
quos.RRL = 'epic.swf_1';
quos.SFU = 'shut-the-fuck-up';
quos.SHU = 'shutup.swf';
quos.SKR = 'the-ting-go-skra';
quos.SMF = 'surprise-motherfucker';
quos.STP = 'its-time-to-stop-button';
quos.SWE = 'snoop-dogg-smoke-weed-everyday';
quos.TIS = 'thisissparta.swf';
quos.TPL = 'oh-baby-a-triple';
quos.TRL = 'trollolol.swf';
quos.TRP = 'itsatrap.swf';
quos.TTR = 'tuturu_1';
quos.TWE = 'that_was_easy';
quos.UTN = 'utini';
quos.WLL = 'sound-9';
quos.YAA = 'sound-9______';
quos.YEE = 'yee';
quos.YES = 'm_1';
var sfxs = [];
sfxs['5NF'] = 'five-nights-at-freddys-full-scream-sound_2';
sfxs.APP = 'applause-4';
sfxs.BEL = 'correct.swf';
sfxs.CRK = 'crickets.swf';
sfxs.DNG = 'ding-sound-effect_2';
sfxs.DPH = 'dolphin';
sfxs.DRM = 'drumroll.swf';
sfxs.JPD = 'jeopardy';
sfxs.LNO = 'dun_dun_1';
sfxs.LOS = 'the-price-is-right-losing-horn';
sfxs.MLG = 'mlg-airhorn';
sfxs.NCP = 'inceptionbutton';
sfxs.QAK = 'cuek.swf';
sfxs.RBX = 'roblox-death-sound_1';
sfxs.SAX = 'george-micael-wham-careless-whisper-1';
sfxs.SFL = 'seinfeld-theme_1';
sfxs.SHY = 'grin';
sfxs.SWX = 'switch-sound';
sfxs.TDA = 'tada.swf';
sfxs.VLN = 'tf_nemesis';
sfxs.VVZ = 'vuvuzela';
sfxs.WED = 'it-is-wednesday-my-dudes-vine';
sfxs.WHP = 'crack_the_whip';
sfxs.WKA = 'wakawaka.swf';
sfxs.WLD = 'wubalubadubdubs-rick-and-morty';
sfxs.WLH = 'wilhelmscream';
sfxs.WSL = 'goodbadugly-whistle-long';
sfxs.WYP = 'watch-your-profanity_1';
sfxs.XFL = 'x-files-theme-song-copy';
sfxs.XPE = 'erro';

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

// https://stackoverflow.com/questions/3959211/fast-factorial-function-in-javascript/3959275#3959275
var f = [];
function factorial(n){
	if (n === 0 || n === 1){
		return 1;
	}
	if (f[n] > 0){
		return f[n];
	}
	return f[n] = factorial(n-1) * n;
}

// http://marcgg.com/blog/2016/11/01/javascript-audio
var context = new AudioContext();
function beep(hz,s,wave){
	var o = context.createOscillator();
	var g = context.createGain();
	o.connect(g);
	g.connect(context.destination);
	o.frequency.value = hz;
	o.type = wave; //sine square triangle sawtooth
	o.start(0);
	g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + s);
	return true;
}

//song
var birthday =	[1/16,[
				[['C4',1/8*1.5]],

				[],

				[],
				
				[['C4',1/16]],
				
				//
				
				[['F3',1/2*1.5],
				['A3',1/2*1.5],
				['D4',1/4]],

				[],

				[],

				[],
				
				[['C4',1/4]],

				[],
				
				[],

				[],
				
				[['F4',1/4]],

				[],
				
				[],

				[],
				
				//
				
				[['C3',1/2*1.5],
				['B3',1/2*1.5],
				['E4',1/2]],

				[],
				
				[],

				[],
				
				[],

				[],
				
				[],

				[],
				
				[['C4',1/8*1.5]],

				[],

				[],
				
				[['C4',1/16]],
				
				//
				
				[['C3',1/2*1.5],
				['B3',1/2*1.5],
				['D4',1/2]],

				[],

				[],

				[],
				
				[['C4',1/4]],

				[],
				
				[],

				[],
				
				[['G4',1/4]],

				[],
				
				[],

				[],
				
				//
				
				[['F3',1/2*1.5],
				['A3',1/2*1.5],
				['F4',1/2]],

				[],
				
				[],

				[],
				
				[],

				[],
				
				[],

				[],
				
				[['C4',1/8*1.5]],

				[],

				[],
				
				[['C4',1/16]],
				
				//
				
				[['F3',1/2*1.5],
				['A3',1/2*1.5],
				['C5',1/4]],

				[],

				[],

				[],
				
				[['A4',1/4]],

				[],
				
				[],

				[],
				
				[['F4',1/4]],

				[],
				
				[],

				[],
				
				//
				
				[['F3',1/2*1.5],
				['B3',1/2*1.5],
				['E4',1/4]],

				[],

				[],

				[],
				
				[['D4',1/4]],

				[],
				
				[],

				[],
				
				[['A#4',1/8*1.5]],

				[],

				[],
				
				[['A#4',1/16]],
				
				//
				
				[['F3',1/2],
				['A3',1/2],
				['A4',1/4]],

				[],

				[],

				[],
				
				[['F4',1/4]],

				[],
				
				[],

				[],
				
				[['C3',1/4],
				['B3',1/4],
				['G4',1/4]],

				[],
				
				[],

				[],
				
				//
				
				[['F3',1/2],
				['A3',1/2],
				['F4',1/2]],
				]];

async function mochsic(song){
	var fullnote = 2;
	var frequency,duration,startafter,fuckjavascript;

	for (i=0;i<song[1].length;i+=1){
		for (j=0;j<song[1][i].length;j+=1){
			frequency = song[1][i][j][0];
			duration = fullnote*song[1][i][j][1];
			console.log(frequency,duration);
			// FUCK javascript, i would've rather done this beforehand, but Nooooooo couldn't be that easy now could we? this is the ONLY way this works. No words express my confusion and rage.
			if (frequency==='C3'){fuckjavascript=130.81;}
			else if (frequency==='F3'){fuckjavascript=174.61;}
			else if (frequency==='A3'){fuckjavascript=220;}
			else if (frequency==='B3'){fuckjavascript=246.94;}
			else if (frequency==='C4'){fuckjavascript=261.63;}
			else if (frequency==='E4'){fuckjavascript=329.63;}
			else if (frequency==='F4'){fuckjavascript=349.23;}
			else if (frequency==='G4'){fuckjavascript=392;}
			else if (frequency==='A4'){fuckjavascript=440;}
			else if (frequency==='A#4'){fuckjavascript=466.16;}
			else if (frequency==='C5'){fuckjavascript=523.25;}

			beep(fuckjavascript,duration,'triangle');
		}
		await sleep(1000*fullnote*song[0]);
	}
}

function nPr(n,k){
	return factorial(n)/factorial(n-k);
}

function nCr(n,k){
	return nPr(n,k)/factorial(k);
}

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
	if (integer<0){
		string+='negative ';
	}
	integer = Math.abs(integer);
	// Digits
	if (integer<10){
		return string+words[integer];
	}
	//Teens
	if (integer===10){
		return string+teens[0];
	}
	if (integer<13){
		return string+teens[integer-10];
	}
	if (integer<20){
		return string+teens[integer-10]+'teen';
	}
	//twenties
	if (integer===20){
		return string+'twenty';
	}
	if (integer<30){
		return string+'twenty-'+words[integer%10];
	}
	// X0
	if (integer<100 && integer%10===0){
		return string+teens[Number(integer+[])[0]]+'ty';
	}
	// XX
	if (integer<100){
		return string+teens[Number(integer+[])[0]]+'ty-'+words[integer%10];
	}
	// 100
	if (integer===100){
		return string+'a hundred';
	}
	// 1XX
	if (integer<200){
		return string+'a hundred '+new EnglishNumber(integer-100);
	}
	// XXX
	if (integer<1e3){
		return string+words[Number(integer+[])[0]]+' hundred '+new EnglishNumber(integer%100);
	}
	// 1,XXX
	if (integer<2e3){
		return string+'a '+illions[1]+' '+new EnglishNumber(integer-1e3);
	}
	// XXX,XXX
	if (integer<1e6){
		return string+new EnglishNumber(Math.floor(integer/1e3))+' '+illions[1]+' '+new EnglishNumber(integer%1e3);
	}
	// 1,XXX,XXX
	if (integer<2e6){
		return string+'a '+illions[2]+'illion '+new EnglishNumber(integer-1e6);
	}
	// XXX,XXX,XXX
	if (integer<1e9){
		return string+new EnglishNumber(Math.floor(integer/1e6))+' '+illions[2]+'illion '+new EnglishNumber(integer%1e6);
	}
	// 1,XXX,XXX,XXX
	if (integer<2e9){
		return string+'a '+illions[3]+'illion '+new EnglishNumber(integer-1e9);
	}
	// XXX,XXX,XXX,XXX
	if (integer<1e12){
		return string+new EnglishNumber(Math.floor(integer/1e9))+' '+illions[3]+'illion '+new EnglishNumber(integer%1e9);
	}
	// 1,XXX,XXX,XXX,XXX
	if (integer<2e12){
		return string+'a '+illions[4]+'illion '+new EnglishNumber(integer-1e12);
	}
	// XXX,XXX,XXX,XXX,XXX
	if (integer<1e15){
		return string+new EnglishNumber(Math.floor(integer/1e12))+' '+illions[4]+'illion '+new EnglishNumber(integer%1e12);
	}
	return 'a really, really big number';
}
// Console
function mconsole(MessageClass,Message){
	if (MessageClass==='i'){
		document.getElementById('console').innerHTML += '\n<span class="ci">info</span>: '+Message;
	}
	else if (MessageClass==='w'){
		document.getElementById('console').innerHTML += '\n<span class="cw">warning</span>:\n'+Message;
	}
	else if (MessageClass==='e'){
		document.getElementById('console').innerHTML += '\n<span class="ce">error</span>:\n'+Message;
	}
	else if (MessageClass==='o'){
		if (Message==='sfx'){
			document.getElementById('console').innerHTML += '\n<span class="co">&rdca; &#x266B;</span>';
		}
		else {
			document.getElementById('console').innerHTML += '\n<span class="co">&rdca;</span> '+Message;
		}
	}
	else if (MessageClass==='I'){
		// document.getElementById('console').innerHTML += '\n<span class="ci">&ldca;</span> '+Message;
	}
	else {
		document.getElementById('console').innerHTML += '\n> '+Message;
	}
}

// MAIN

var program;
var pointer;
var xsize = 32;
var ysize = 32;
var tapesize = xsize*ysize;
var inputline = 0;

function cclr(){
	document.getElementById('console').innerHTML = '<i>MOCHINE rev '+versionno+'</i>';
}

function run(){
	document.getElementById('machinestate').innerHTML = '0';
	program = document.getElementById('code').value.split("\n");
	console.log(program);
	console.log('Load');
	// Bad Practices
	// blank
	if (program==''){
			console.warn('No Program');
			mconsole('w','No Program');
	}
	// Last line is a label but not :X
	if (program[program.length-1][0]===':' && program[program.length-1]!==':X'){
			console.warn('Last line is label but not ":X"\n@ Line '+(program.length-1)+'\n\t'+program[program.length-1]);
			mconsole('w','Last line is label but not "<span class="cf">:</span>X"\n@ Line '+(program.length-1)+'\n\t<span class="cf">:</span>'+program[program.length-1].substring(1));
	}
	//inputline
	inputline = 0;
}

function reset(){
	program = [];
	document.getElementById('machinestate').innerHTML = '[PRESS LOAD]';
	document.getElementById('line').innerHTML = '0';
	
	//table construction
	var tabularasa = '<table>';
	for (i=0;i<xsize;i+=1) {
		tabularasa+='<tr>';
		for (j=0;j<ysize;j+=1) {
			tabularasa+='<td id="x'+Number(i*ysize+j)+'">0</td>';
		}
		tabularasa+='</tr>';
	}
	tabularasa+='</table>';
	document.getElementById('memory').innerHTML = tabularasa;
	
	//pointer
	if (document.getElementById('x'+pointer)!==null){
		document.getElementById('x'+pointer).classList.remove("pointed");
	}
	pointer = 0;
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x0').classList.add("pointed");

	console.log('Reset');
}

function fstep100(){
	for (i=0;i<100;i+=1){
		fstep();
	}
	return false;
}

// Main

function fstep(){
	var linenumber = Number(document.getElementById('line').innerHTML);
	// Determining the command
	var command = program[linenumber];
	// Reject
	if (command===undefined || command===''){
		if (document.getElementById('console').innerHTML.slice(-44)!=='<span class="ci">info</span>: End of Program'){
			mconsole('i','End of Program');
		}
		return true;
	}
	// INC
	document.getElementById('line').innerHTML=linenumber+1;
	// Remove color
	document.getElementById('x'+pointer).classList.remove("pointed");
	// Grabbing specials beforehand
	var specialstate = document.getElementById('machinestate').innerHTML;
	var specialtarget = document.getElementById('x'+pointer).innerHTML;
	// replacing shorthand operation mode
	if ('i!t&a|lsmor^j=x'.indexOf(command[0])!==-1){
		command = command.split('');
		console.warn(command);
		command[0] = command[0].replace('i','INP');
		command[0] = command[0].replace('!','NOT');
		command[0] = command[0].replace('t','TIM');
		command[0] = command[0].replace('&','AND');
		command[0] = command[0].replace('a','APP');
		command[0] = command[0].replace('|','IOR');
		command[0] = command[0].replace('l','LEN');
		command[0] = command[0].replace('s','MMS');
		command[0] = command[0].replace('m','MOV');
		command[0] = command[0].replace('o','OUT');
		command[0] = command[0].replace('r','RPN');
		command[0] = command[0].replace('^','XOR');
		command[0] = command[0].replace('j','JJJ');
		command[0] = command[0].replace('=','LET');
		command[0] = command[0].replace('x','SWP');
		console.warn(command);
		command[0] += ' ';
		console.warn(command);
		command = command.join('');
		console.warn(command);
	}
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
	
	var badop = 'Useless operation written by a useless coder\n@ Line ';
	// Generating warning for deprecated ops
	if ('ADD DIV EXP INV MOD MUL NEG NRT'.indexOf(operation)!==-1){
			console.warn(operation+' is deprecated, use RPN instad.\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','<span class="cf">'+operation+'</span> is deprecated, use <span class="cf">RPN</span> instad.\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating warning for deprecated ops
	if ('JIF JIG JIL JIZ JMP JNE JNZ'.indexOf(operation)!==-1){
			console.warn(operation+' is deprecated, use JJJ instad.\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','<span class="cf">'+operation+'</span> is deprecated, use <span class="cf">JJJ</span> instad.\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating warning for deprecated ops
	if ('NAN NOR XNR'.indexOf(operation)!==-1){
			console.warn(operation+' is deprecated, use INV + its opposite instad.\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','<span class="cf">'+operation+'</span> is deprecated, use <span class="cf">INV</span>  + its opposite instad.\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating warning for specialchar-duped ops
	if ('LET SWP'.indexOf(operation)!==-1 && ['* *','$ $','@ @'].indexOf(arg)!==-1){
			console.warn(badop+linenumber+'\n\t'+command);
			mconsole('w',badop+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating warning for other NOPs arg===0
	else if ('ADD IOR MMS MOV'.indexOf(operation)!==-1 && Number(arg)===0){
			console.warn(badop+linenumber+'\n\t'+command);
			mconsole('w',badop+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating warning for other NOPs arg===1
	else if ('DIV EXP MUL NRT'.indexOf(operation)!==-1 && Number(arg)===1){
			console.warn(badop+linenumber+'\n\t'+command);
			mconsole('w',badop+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
	}
	// Generating errors for number-only ops
	else if ('ADD DIV EXP MMS MOD MOV MUL NRT FUN I2W'.indexOf(operation)!==-1 && Number.isNaN(Number(arg))){
			console.error('"'+arg+'" not number\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','"'+arg+'" not number\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
			return true;
	}
	// Generating err for insufficient commas (FRG/FSW)
	if ('FRG FSW'.indexOf(operation)!==-1 && (arg.match(/,/g) || []).length<1){
			console.error('Insufficient arguments\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','Insufficient arguments\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
			return true;
	}
	// Generating err for insufficient commas (FAA)
	if (operation==='FAA' && (arg.match(/,/g) || []).length<3){
			console.error('Insufficient arguments\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','Insufficient arguments\n@ Line '+linenumber+'\n\t<span class="cf">FAA</span> '+arg);
			return true;
	}
	// Generating err for non-nonnegative integer args
	if ('FAA FSW'.indexOf(operation)!==-1 && (arg.match(/[^,0-9]/g) || []).length!==0){
			console.error('Arguments not nonnegative integers\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','Arguments not nonnegative integers\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
			return true;
	}
	// Generating err for non-numeral first arg
	if (operation==='FRG' && (arg.match(/^[0-9]+,/g) || []).length===0){
			console.error('First argument not a nonnegative integer\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','First argument not a nonnegative integer\n@ Line '+linenumber+'\n\t<span class="cf">FRG</span> '+arg);
			return true;
	}
	// Generating ZeroDivisionError
	if ('DIV MOD NRT'.indexOf(operation)!==-1 && arg==='0'){
			console.error('Zero divisor\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','Zero divisor\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
			return true;
	}
	// Generating ZeroDivisionError for INV on 0
	if (operation==='INV' && specialtarget==='0'){
			console.error('Zero divisor\n@ Line '+linenumber+'\n\tINV');
			mconsole('e','Zero divisor\n@ Line '+linenumber+'\n\t<span class="cf">INV</span>');
			return true;
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
	}
	else if (operation==='MOD'){
		document.getElementById('x'+pointer).innerHTML = mod(Number(specialtarget),Number(arg));
	}
	else if (command[0]==='J'){
		if (operation==='JJJ'){
			arg = arg.replace('*',specialstate).replace('$',pointer).replace('@',specialtarget);
			var arg1 = arg.split(" ")[0];
			var arg2 = arg.split(" ")[1];
			var arg1a = arg1.match(/[^<>!=]+(?=[<>!=])/g)[0];
			var arg1b = arg1.match(/([<>!]?=)|<|>/g)[0];
			var arg1c = arg1.match(/(?<=[<>!=])[^<>!=]+/g)[0];

			// Determining Target Type
			if (Number.isNaN(arg2)){
				var target = program.indexOf(':'+arg2);
			}
			else {
				var target = arg2;
			}
			
			// Determination!
			if (arg1b==='='){
				if (arg1a===arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else if (arg1b==='>'){
				if (arg1a>arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else if (arg1b==='<'){
				if (arg1a<arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else if (arg1b==='>='){
				if (arg1a>=arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else if (arg1b==='<='){
				if (arg1a<=arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else if (arg1b==='!='){
				if (arg1a!==arg1c){
					document.getElementById('line').innerHTML = target;
				}
			}
			else {
				console.error('Misformed comparison "'+arg1b+'"\n@ Line '+linenumber+'\n\t'+command);
				mconsole('e','Misformed comparison "'+arg1b+'"\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
				return true;
			}
		}
		// other jumps
		else {
			// Determining Argument Type
			if (Number.isNaN(arg)){
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
				mconsole('e','Jump not in dictionary: '+command+'\n@ Line '+linenumber+'\n\t<span class="cf">'+operation+'</span> '+arg);
				return true;
			}
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
		if (specialtarget===arg){
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
			mconsole('e','Special not in dictionary: '+arg1+'\n@ Line '+linenumber+'\n\t<span class="cf">LET</span> '+arg);
			return true;
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
			mconsole('e','Special not in dictionary: '+arg2+'\n@ Line '+linenumber+'\n\t<span class="cf">SWP</span> '+arg);
			return true;
		}
		// Do shit
		// Machinestate
		if (arg1==='*'){
			arg1 = specialstate;
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
			mconsole('e','Special not in dictionary: '+arg1+'\n@ Line '+linenumber+'\n\t<span class="cf">SWP</span> '+arg);
			return true;
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
		var newcode = code1+code2+code3;
		
		console.log(newcode);
		program = newcode.split('\n');
	
		console.log(program);
	}
	else if (operation==='I2W'){
		document.getElementById('x'+pointer).innerHTML = new EnglishNumber(arg);
	}
	else if (operation==='SFX'){
		// Unique
		if (arg==='PTY'){
			new Audio('snd/partyhorn.mp3').play();
		}
		else if (arg==='SAD'){
			new Audio('http://www.orangefreesounds.com/wp-content/uploads/2015/07/Sad-trombone.mp3').play();
		}
		else if (sfxs[arg]!==undefined){
			new Audio('https://www.myinstants.com/media/sounds/'+sfxs[arg]+'.mp3').play();
		}
		else {
			console.error('SFX not in dictionary: '+arg+'\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','SFX not in dictionary: '+arg+'\n@ Line '+linenumber+'\n\t<span class="cf">SFX</span> '+arg);
			return true;
		}
		mconsole('o','sfx');
	}
	else if (operation==='QUO'){
		// Unique
		if (arg==='PYT'){
			new Audio('https://www.intriguing.com/mp/_sounds/hg/hamster.wav').play();
		}
		else if (quos[arg]!==undefined){
			new Audio('https://www.myinstants.com/media/sounds/'+quos[arg]+'.mp3').play();
		}
		else {
			console.error('QUO not in dictionary: '+arg+'\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','QUO not in dictionary: '+arg+'\n@ Line '+linenumber+'\n\t<span class="cf">QUO</span> '+arg);
			return true;
		}
		mconsole('o','sfx');
	}
	else if (operation==='OUT'){
		mconsole('o',arg);
	}
	else if (operation==='OUT'){
		mconsole('o',arg);
	}
	else if (operation==='RPN'){
		console.log(arg);
		var rpnstack = [];
		var currentstring = '';
		var arg = arg.replace("*",specialstate).replace("$",pointer).replace("@",specialtarget);
		// Go through vals
		for (i=0;i<arg.length;i+=1){
			// Check if NaN
			if (rpnstack.length>0 && !Number.isFinite(rpnstack[rpnstack.length-1])){
				console.error('RPN error performing '+arg[i-1]+':\n@ Line '+linenumber+'\n\t'+command+'\n\t    '+Array(i).join(" ")+'^');
				mconsole('e','RPN error performing '+arg[i-1]+':\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg+'\n\t    '+Array(i).join(" ")+'^');
				return true;
			}
			// Work
			if ('1234567890.'.indexOf(arg[i])!==-1){
				currentstring+=arg[i];
			}
			else if (arg[i]===' '){
				console.warn('NOP in RPN\n@ Line '+linenumber+'\n\t'+command);
				mconsole('w','NOP in RPN\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg);
			}
			else if (arg[i]===','){
				rpnstack.push(Number(currentstring));
				currentstring = '';
			}
			else if (arg[i]==='+'){
				rpnstack[rpnstack.length-2] += rpnstack[rpnstack.length-1];
				rpnstack.pop();
			}
			else if (arg[i]==='-'){
				rpnstack[rpnstack.length-2] -= rpnstack[rpnstack.length-1];
				rpnstack.pop();
			}
			else if (arg[i]==='x'){
				rpnstack[rpnstack.length-2] = rpnstack[rpnstack.length-2]*rpnstack[rpnstack.length-1];
				rpnstack.pop();
			}
			else if (arg[i]==='/'){
				rpnstack[rpnstack.length-2] = rpnstack[rpnstack.length-2]/rpnstack[rpnstack.length-1];
				rpnstack.pop();
			}
			else if (arg[i]==='^'){
				rpnstack[rpnstack.length-2] = Math.pow(rpnstack[rpnstack.length-2],rpnstack[rpnstack.length-1]);
				rpnstack.pop();
			}
			else if (arg[i]==='%'){
				rpnstack[rpnstack.length-2] = mod(rpnstack[rpnstack.length-2],rpnstack[rpnstack.length-1]);
				rpnstack.pop();
			}
			else if (arg[i]==='!'){
				rpnstack[rpnstack.length-1] = factorial(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='e'){
				if (currentstring===''){
					currentstring = String(Math.E);
				}
				else {
					currentstring = String(Math.E*Number(currentstring));
				}
			}
			else if (arg[i]==='g'){
				if (currentstring===''){
					currentstring = "0.5772156649015329";
				}
				else {
					currentstring = String(0.5772156649015329*Number(currentstring));
				}
			}
			else if (arg[i]==='p'){
				if (currentstring===''){
					currentstring = String(Math.PI);
				}
				else {
					currentstring = String(Math.PI*Number(currentstring));
				}
			}
			else if (arg[i]==='r'){
				if (currentstring===''){
					currentstring = String(Math.random());
				}
				else {
					currentstring = String(Math.random()*Number(currentstring));
				}
			}
			else if (arg[i]==='R'){
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				rpnstack.push(Math.random()*(b-a)-a);
			}
			else if (arg[i]==='l'){
				rpnstack[rpnstack.length-2] = Math.log(rpnstack[rpnstack.length-2])/Math.log(rpnstack[rpnstack.length-1]);
				rpnstack.pop();
			}
			else if (arg[i]==='L'){
				rpnstack[rpnstack.length-1] = Math.log(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='s'){
				rpnstack[rpnstack.length-1] = Math.sin(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='S'){
				rpnstack[rpnstack.length-1] = Math.asin(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='c'){
				rpnstack[rpnstack.length-1] = Math.cos(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='C'){
				rpnstack[rpnstack.length-1] = Math.acos(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='t'){
				rpnstack[rpnstack.length-1] = Math.tan(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='T'){
				rpnstack[rpnstack.length-1] = Math.atan(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='='){
				if (rpnstack[rpnstack.length-1]===rpnstack[rpnstack.length-2]){
					rpnstack[rpnstack.length-2] = 1;
					rpnstack.pop();
				}
				else {
					rpnstack[rpnstack.length-2] = 0;
					rpnstack.pop();
				}
			}
			else if (arg[i]==='?'){
				if (rpnstack[rpnstack.length-1]!==rpnstack[rpnstack.length-2]){
					rpnstack[rpnstack.length-2] = 1;
					rpnstack.pop();
				}
				else {
					rpnstack[rpnstack.length-2] = 0;
					rpnstack.pop();
				}
			}
			else if (arg[i]==='>'){
				if (rpnstack[rpnstack.length-1]>rpnstack[rpnstack.length-2]){
					rpnstack[rpnstack.length-2] = 1;
					rpnstack.pop();
				}
				else {
					rpnstack[rpnstack.length-2] = 0;
					rpnstack.pop();
				}
			}
			else if (arg[i]==='<'){
				if (rpnstack[rpnstack.length-1]<rpnstack[rpnstack.length-2]){
					rpnstack[rpnstack.length-2] = 1;
					rpnstack.pop();
				}
				else {
					rpnstack[rpnstack.length-2] = 0;
					rpnstack.pop();
				}
			}
			else if (arg[i]==='~'){
				rpnstack[rpnstack.length-1] = -rpnstack[rpnstack.length-1];
			}
			else if (arg[i]==='|'){
				rpnstack[rpnstack.length-1] = Math.abs(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='q'){
				var c = rpnstack.pop();
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				rpnstack.push((-b+Math.pow(b*b-4*a*c,.5))/2/a);
			}
			else if (arg[i]==='Q'){
				var c = rpnstack.pop();
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				rpnstack.push((-b-Math.pow(b*b-4*a*c,.5))/2/a);
			}
			else if (arg[i]==='\''){
				for (j=0;j<rpnstack.length;j+=1){
					rpnstack[j] = rpnstack[j]*(rpnstack.length-1-j);
				}
				rpnstack.pop();
			}
			else if (arg[i]==='"'){
				for (k=0;k<2;k+=1){
					for (j=0;j<rpnstack.length;j+=1){
						rpnstack[j] = rpnstack[j]*(rpnstack.length-1-j);
					}
					rpnstack.pop();
				}
			}
			else if (arg[i]==='#'){
				rpnstack[rpnstack.length-1] = Math.round(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='['){
				rpnstack[rpnstack.length-1] = Math.floor(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]===']'){
				rpnstack[rpnstack.length-1] = Math.ceil(rpnstack[rpnstack.length-1]);
			}
			else if (arg[i]==='h'){
				var c = rpnstack.pop();
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				var s = (a+b+c)/2;
				rpnstack.push(Math.pow(s*(s-a)*(s-b)*(s-c),.5));
			}
			else if (arg[i]==='m'){
				rpnstack = [Math.min.apply(null,rpnstack)];
			}
			else if (arg[i]==='M'){
				rpnstack = [Math.max.apply(null,rpnstack)];
			}
			else if (arg[i]==='n'){
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				rpnstack.push(nCr(a,b));
			}
			else if (arg[i]==='N'){
				var b = rpnstack.pop();
				var a = rpnstack.pop();
				rpnstack.push(nPr(a,b));
			}
			// Shamelessly stolen from GolfScript
			else if (arg[i]==='\\'){
				var temp = rpnstack[rpnstack.length-1];
				rpnstack[rpnstack.length-1] = rpnstack[rpnstack.length-2];
				rpnstack[rpnstack.length-2] = temp;
			}
			else if (arg[i]===';'){
				rpnstack.pop();
			}/*
			else if (arg[i]==='.'){
				rpnstack.push(rpnstack[rpnstack.length-1]);
			}*/
			else if (arg[i]==='('){
				rpnstack[rpnstack.length-1] -= 1;
			}
			else if (arg[i]===')'){
				rpnstack[rpnstack.length-1] += 1;
			}
			else {
				console.error('RPN error performing unindexed operation '+arg[i]+':\n@ Line '+linenumber+'\n\t'+command+'\n\t    '+Array(i).join(" ")+'^');
				mconsole('e','RPN error performing unindexed operation '+arg[i]+':\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg+'\n\t    '+Array(i).join(" ")+'^');
				return true;
			}
			console.log(i,arg[i],rpnstack);
		}
		// Return
		if (rpnstack.length===1){
			if (!Number.isFinite(rpnstack[0])){
				console.error('RPN error performing '+arg[arg.length-1]+':\n@ Line '+linenumber+'\n\t'+command+'\n\t    '+Array(arg.length).join(" ")+'^');
				mconsole('e','RPN error performing '+arg[arg.length-1]+':\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg+'\n\t    '+Array(arg.length).join(" ")+'^');
				return true;
			}
			document.getElementById('x'+pointer).innerHTML = Number(specialtarget)+Number(rpnstack[0]);
		}
		else if (rpnstack.length>1){
			console.error('RPN error, numbers still in stack: '+rpnstack+'\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','RPN error, numbers still in stack: '+rpnstack+'\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg);
			return true;
		}
		else {
			console.error('RPN error, not enough numbers in stack: '+rpnstack+'\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','RPN error, not enough numbers in stack: '+rpnstack+'\n@ Line '+linenumber+'\n\t<span class="cf">RPN</span> '+arg);
			return true;
		}
	}/*
	else if (operation==='RER'){
		document.getElementById('x'+pointer).innerHTML = document.getElementById('x'+pointer).innerHTML.replace( new RegExp(arg1,"gm"),arg2);
	}*/
	else if (operation==='WAV'){
		arg = arg.replace("*",specialstate).replace("$",pointer).replace("@",specialtarget);
		var arg1 = Number(arg.split(",")[0]);
		var arg2 = Number(arg.split(",")[1]);
		var arg3 = arg.split(",")[2];
		// Fixing problems
		if (!isFinite(arg1)){
			console.warn('invalid frequency\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','invalid frequency\n@ Line '+linenumber+'\n\t<span class="cf">WAV</span> '+arg);
			arg1 = 440;
		}
		if (!isFinite(arg2)){
			console.warn('invalid duration\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','invalid duration\n@ Line '+linenumber+'\n\t<span class="cf">WAV</span> '+arg);
			arg2 = 1;
		}
		if ('square sine triangle sawtooth'.indexOf(arg3)===-1){
			console.warn('invalid waveform "'+arg3+'"\n@ Line '+linenumber+'\n\t'+command);
			mconsole('w','invalid waveform "'+arg3+'"\n@ Line '+linenumber+'\n\t<span class="cf">WAV</span> '+arg);
			arg3 = 'sine';
		}
		// Out
		beep(arg1,arg2,arg3);
	}
	else if (operation==='MID'){
		if (arg==='BRT'){
			mochsic(birthday);
			mconsole('o','sfx');
		}
		else {
			console.error('Song "'+arg3+'" not in dictionary\n@ Line '+linenumber+'\n\t'+command);
			mconsole('e','Song "'+arg3+'" not in dictionary\n@ Line '+linenumber+'\n\t<span class="cf">MID</span> '+arg);
			return true;
		}
	}
	else if (operation==='IMG'){
		mconsole('o','<img src="'+arg+'" class="cimg">');
	}
	else if (operation==='INP'){
		programinput = document.getElementById('input').value.split("\n")[inputline];
		mconsole('I',programinput);
		document.getElementById('x'+pointer).innerHTML = programinput;
		inputline+=1;
	}
	else if (operation==='TIM'){
		document.getElementById('x'+pointer).innerHTML = (new Date).getTime()/1000;
	}
	else {
		console.error('Operation not in dictionary: '+command+'\n@ Line '+linenumber+'\n\t'+command);
		mconsole('e','Operation not in dictionary: '+command+'\n@ Line '+linenumber+'\n\t'+command);
		return true;
	}
	document.getElementById('pointing').innerHTML=pointer;
	document.getElementById('x'+pointer).classList.add("pointed");
	return false;
}