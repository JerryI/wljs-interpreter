//helps to find instance from server
var MetaMarkers = {};

core.MetaMarker = (args, env) => {
  const marker = interpretate(args[0], env);
  const inst = env.root.instance;

  console.log('instance '+inst+'is marked as '+marker);
  if (marker in MetaMarkers) {
    MetaMarkers[marker][inst] = env.root;
  } else {
    MetaMarkers[marker] = {};
    MetaMarkers[marker][inst] = env.root;
  }

  return inst;
}

core.MetaMarker.update = (args, env) => {
  //void
}

core.MetaMarker.destroy = (args, env) => {
  const marker = interpretate(args[0], env);
  console.log('dispose marker for instance '+env.root.instance);
  console.log('in the context');
  console.log(env);
  console.log(MetaMarkers[marker]);

  delete MetaMarkers[marker][env.root.instance];
}  

core.FindMetaMarker = (args, env) => {
  const marker = interpretate(args[0], env);

  if (marker in MetaMarkers) {
    console.log('found one!');
    const arr =  Object.keys(MetaMarkers[marker]);
    const list = arr.map((el)=>{
      return ['FrontEndInstance', el]
    });

    console.log('list of instances');
    console.log(list);

    return list;
  }

  return [];
}

core.First = (args, env) => {
  const dt = interpretate(args[0], env);
  if (dt instanceof Array) return dt[0];
  return ['First', dt];
}

//to execute code inside the container (injecting)
core.Placed = (args, env) => {
  console.log(args[1]);
  let evaluated = args[1];

  if (core._typeof(evaluated) != 'FrontEndInstance') {
    evaluated = interpretate(args[1], env);
    console.log(evaluated);

    if (core._typeof(evaluated) != 'FrontEndInstance') {

      console.error('cannot place as defined');
      console.log(args);

      return null;
    }
  }

  const instanceId = interpretate(evaluated[1], env);
  console.log('instance id: '+instanceId);

  console.log(InstancesHashMap[instanceId]);
  
  //execute inside the container
  return interpretate(args[0], {...InstancesHashMap[instanceId].env});
}
