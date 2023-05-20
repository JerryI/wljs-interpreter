const main = document.getElementById('dom-canvas');

core.ClearDOM = async (args, env) => {
	const key = interpretate(args[0], env);
  	const old = document.getElementById(key);
  	if (old) old.remove();
  
    let el = document.createElement('div');
  	el.id = key;
	
  	main.appendChild(el);
  	return null;
}

return '';