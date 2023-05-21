//just for autosaving the input from the user
const e = localStorage.getItem('wl');
if(!e) {
	localStorage.setItem('wl', '');
} else {
	codeInput.getDoc().setValue(e);
};

window.saved = (str) => {
	localStorage.setItem('wl', str);
};

return null;