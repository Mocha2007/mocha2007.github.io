

/* globals Newgrounds */
/* exported unlockMedal */
'use strict';

// newgrounds api bullshit
// https://bitbucket.org/newgrounds/newgrounds.io-for-javascript-html5/src/default/
// eslint-disable-next-line new-cap
const ngio = new Newgrounds.io.core('50305:QVq4Lget', 'RuPv3HTuC95QUinN9/FmEw==');

function onLoggedIn(){
	console.log('Welcome ' + ngio.user.name + '!');
}

function onLoginFailed(){
	console.log('There was a problem logging in: ' . ngio.login_error.message);
}

function onLoginCancelled(){
	console.log('The user cancelled the login.');
}

/*
 * Before we do anything, we need to get a valid Passport session.  If the player
 * has previously logged in and selected 'remember me', we may have a valid session
 * already saved locally.
 */
function initSession(){
	ngio.getValidSession(function(){
		if (ngio.user){
			/*
             * If we have a saved session, and it has not expired,
             * we will also have a user object we can access.
             * We can go ahead and run our onLoggedIn handler here.
             */
			onLoggedIn();
		}
		else {
			/*
             * If we didn't have a saved session, or it has expired
             * we should have been given a new one at this point.
             * This is where you would draw a 'sign in' button and
             * have it execute the following requestLogin function.
             */
			requestLogin();
		}
	});
}

/*
 * Call this when the user clicks a 'sign in' button from your game.  It MUST be called from
 * a mouse-click event or pop-up blockers will prevent the Newgrounds Passport page from loading.
 */
function requestLogin(){
	ngio.requestLogin(onLoggedIn, onLoginFailed, onLoginCancelled);
	/* you should also draw a 'cancel login' buton here */
}

initSession();

/* vars to record any medals and scoreboards that get loaded */
let medals; // todo scoreboards;

/* handle loaded medals */
function onMedalsLoaded(result){
	if (result.success) medals = result.medals;
}

/* handle loaded scores
function onScoreboardsLoaded(result){
	if (result.success) scoreboards = result.scoreboards;
}*/

/* load our medals and scoreboards from the server */
ngio.queueComponent('Medal.getList', {}, onMedalsLoaded);
// ngio.queueComponent('ScoreBoard.getBoards', {}, onScoreboardsLoaded);
ngio.executeQueue();


/* You could use this function to draw the medal notification on-screen */
function onMedalUnlocked(medal){
	console.log('MEDAL GET:', medal.name);
}

function unlockMedal(medalName){
	/* If there is no user attached to our ngio object, it means the user isn't logged in and we can't unlock anything */
	if (!ngio.user) return;
	for (let i = 0; i < medals.length; i++){
		const medal = medals[i];
		/* look for a matching medal name */
		if (medal.name === medalName){
			/* we can skip unlocking a medal that's already been earned */
			if (!medal.unlocked){
				/* unlock the medal from the server */
				console.log('Attempting to unlock', medal);
				ngio.callComponent('Medal.unlock', {id: medal.id}, function(result){
					if (result.success) onMedalUnlocked(result.medal);
				});
			}
			return;
		}
	}
}

// eslint-disable-next-line no-unused-vars
function debugUnlock(){
	ngio.callComponent('Medal.unlock', {id: medals[0].id}, console.log);
}

// todo scoreboards