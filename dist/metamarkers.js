//helps to find instance from server
var MetaMarkers = {};

core.MetaMarker = async (args, env) => {
  const marker = await interpretate(args[0], env);
  const inst = env.root.instance;

  console.log('instance '+inst+'is marked as '+marker);
  if (marker in MetaMarkers) {
    MetaMarkers[marker][inst] = env;
  } else {
    MetaMarkers[marker] = {};
    MetaMarkers[marker][inst] = env;
  }

  return null;
}

core.MetaMarker.update = (args, env) => {
  //void
}

core.MetaMarker.destroy = async (args, env) => {
  const marker = await interpretate(args[0], env);
  console.log('dispose marker for instance '+env.root.instance);
  //console.log('in the context');
  //console.log(env);
  //console.log(MetaMarkers[marker]);

  delete MetaMarkers[marker][env.root.instance];
}  

core.FindMetaMarker = async (args, env) => {
  const marker = await interpretate(args[0], env);

  if (marker in MetaMarkers) {
    console.log('found one!');
    const arr =  Object.values(MetaMarkers[marker]);
    const list = arr.map((el)=>{
      return ['MetaMarkers', el]
    });

    //console.log('list of markers');
    //console.log(list);

    return list;
  }

  return [];
}

core.First = async (args, env) => {
  const dt = await interpretate(args[0], env);
  return dt[0];
}

//to execute code inside the container (injecting)
core.Placed = async (args, env) => {
  //console.log(args[1]);
  let evaluated = await interpretate(args[1], env);

  if (core._typeof(evaluated) != 'MetaMarkers') {
    evaluated = await interpretate(args[1], env);
    //console.log(evaluated);

    if (core._typeof(evaluated) != 'MetaMarkers') {

      console.error('cannot place as defined');
      console.log(args);

      return null;
    }
  }

  const instanceEnv = evaluated[1];
  
  
  
  //execute inside the container
  console.log('try!');
  //console.log(instanceEnv);
  const copy = {...instanceEnv};
  copy.scope = {...copy.scope, ...env.scope};

  await interpretate(args[0], copy);
  //console.log('done!');
  return null;
}
