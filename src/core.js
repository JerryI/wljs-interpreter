var core = {};
core.name = "Core Context";
interpretate.contextExpand(core);

core.DefaultWidth = 600;

core.ConsoleLog = [];

core.GarbageCollected = async (args, env) => {
    if ('element' in env) {
      env.element.innerText = '- Garbage -';
    }
    console.log('garbage collected');
}

core.True = (args, env) => {
  return true;
}

core.False = (args, env) => {
  return false;
}

core.FrontEndExecutable = async (args, env) => {
    const key = interpretate(args[0], env);
    //creates an instance with its own separate env
    //we need this local context to create stuff and then, destory it if it necessary
    console.log("FEE: creating an object with key "+key);
    //new local scope, global is the same
    const obj = new ExecutableObject(key, env);
    
    const result = await obj.execute()
    return result;  
  };
  
  core.FrontEndExecutable.update = async (args, env) => {
    const key = interpretate(args[0], env);
    return await env.global.stack[key].execute();
  };
  
  core.FrontEndExecutable.destroy = async (args, env) => {
    const key = interpretate(args[0], env);
    await env.global.stack[key].dispose();
  };
  
  core._typeof = function(args, env) {
    if (typeof args === 'string') {
      if (args.charAt(0) === "'")
        return 'string';
      
      //if (core[args].virtual) return 'variable';
      return 'idunno'
    }
    if (typeof args === 'number') {
      return 'number';
    }
    if (args instanceof Array) {
      return args[0];
    }

    return 'undefined';
  }
  
  core._getRules = async function(args, env) {
    let rules = {};
    if (env.hold) {
      for (const el of args) {
        if(el instanceof Array) {
          if (el[0] === 'Rule') {
            rules[interpretate(el[1], {...env, hold:false})] = el[2];
          }
        }
      };
    } else {
      for (const el of args) {
        if(el instanceof Array) {
          if (el[0] === 'Rule') {
            rules[interpretate(el[1], {...env, hold:false})] = await interpretate(el[2], env);
          }
        }
      };
    }

    return rules; 
  }
  
  core.FireEvent = function(args, env) {
    const key  = interpretate(args[0], env);
    const data = interpretate(args[1], env);
  
    server.emitt(key, data);
  }
  
  core.KernelFire = function(args, env) {
    const data = interpretate(args[0], env);
  
    server.talkKernel(data);
  }
  
  core.KernelEvaluate = function(args, env) {
    const data = interpretate(args[0], env);
  
    server.askKernel(data);
  }
  
  
  core.PromiseResolve = (args, env) => {
    const uid = interpretate(args[0], env);
    console.log('promise resolved!');
    server.promises[uid].resolve(args[1]);
    delete server.promises[uid];
  }
  
  core.UpdateFrontEndExecutable = function (args, env) {
    const key = interpretate(args[0], env);
    var data  = JSON.parse(interpretate(args[1], env));
    
    ObjectHashMap[key].update(data);
  }
  
  core.FrontEndDispose = function (args, env) {
    //no need anymore
    console.log('garbage removed');
  }

  core.FrontEndVirtual = (args, env) => {
    console.log('virtual function was created');
    const obj = new ExecutableObject('virtual-'+uuidv4(), env, args[0]);
    let virtualenv = obj.assignScope();

    return interpretate(args[0], virtualenv);
  }
  
  core.SetFrontEndObject = function (args, env) {
    const key = interpretate(args[0], env);
    if (!(key in ObjectHashMap)) { console.warn('not found'); return; }
    ObjectHashMap[key].update(args[1]);
  }

  core.CreateFrontEndObject = function (args, env) {
    const key = interpretate(args[0], env);

    if (key in ObjectHashMap) {
      console.warn('already exists!');
      ObjectHashMap[key].update(args[1]);
    }

    const ob =  new ObjectStorage(key); 
    ob.cached = true; 
    ob.cache = args[0];
  }  

  core.FlipFrontEndObjects = async function (args, env) {
    const key1 = interpretate(args[0], env);
    const key2 = interpretate(args[1], env);

    const clone = structuredClone(await ObjectHashMap[key1].get());
    ObjectHashMap[key1].update(await ObjectHashMap[key2].get());
    ObjectHashMap[key2].update(clone);
  }

  core.FlipSymbols = async function (args, env) {
    const key1 = args[0];
    const key2 = args[1];

    if (args.length > 2) {
      console.log('applying function '+args[2]);
      const temp = await interpretate([args[2], key1], {...env, novirtual: true});
      core[key1].data = core[key2].data;
      core[key2].data = temp;
    } else {
      const temp = core[key1].data;
      core[key1].data = core[key2].data;
      core[key2].data = temp;
    }



    core[key1].instances.forEach((inst) => {
      inst.update();
    });

    core[key2].instances.forEach((inst) => {
      inst.update();
    });    
  }  

  core.Unsafe = async function (args, env) {
    return await interpretate(args[0], {...env, unsafe: true});
  }
  
  core.FrontEndExecutableHold = core.FrontEndExecutable;
  //to prevent codemirror 6 from drawing it
  core.FrontEndRef = core.FrontEndExecutable;
  //another alias
  core.FrontEndExecutableWrapper = core.FrontEndExecutable;
  //hold analogue for the backend
  core.FrontEndOnly = (args, env) => {
    return interpretate(args[0], env);
  };
  
  core.FrontEndOnly.update = (args, env) => {
    return interpretate(args[0], env);
  };
  
  core.FrontEndOnly.destroy = (args, env) => {
    interpretate(args[0], env);
  };

  core.FHold = core.FrontEndOnly;
  //AHHAHAHAH
  core.Hold = core.FrontEndOnly;
  
  core.Power = async (args, env) => {
    //if (!env.numerical) return ["Power", ...args];
    
    const val = await interpretate(args[0], env);
    const p   = await interpretate(args[1], env);
  
    return Math.pow(val,p);
  }

  core.Plus = async (args, env) => {
    let x = await interpretate(args[0], env);
    let y = await interpretate(args[1], env);

    const typeX = typeof x;
    const typeY = typeof y;

    if (typeX === 'number' && typeof typeY !== 'number') {
      return sumNestedArrayByScalar(y, x)
    }

    if (typeY === 'number' && typeof typeX !== 'number') {
      return sumNestedArrayByScalar(x, y)
    }    

    if (typeY !== 'number' && typeof typeX !== 'number') {
      return calculateNestedArraySum(x,y)
    }
    //TODO: evaluate it before sending its original symbolic form
    return x + y;
  }  

  core.Plus.update = core.Plus;
  
  core.Rational = function (args, env) {
    if (env.numerical === true) return interpretate(args[0], env)/interpretate(args[1], env);
    
    //return the original form igoring other arguments
    return ["Rational", args[0], args[1]];
  }

  function multiplyNestedArrayByScalar(arr, scalar) {
    if (Array.isArray(arr)) {
      return arr.map((item) => multiplyNestedArrayByScalar(item, scalar));
    } else {
      return arr * scalar;
    }
  }

  function calculateNestedArraySum(arr1, arr2) {  
    // Base case: if both inputs are numbers, return their sum

  
  const result = [];

  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      // If both elements are arrays, recursively calculate nested sum
      result.push(calculateNestedArraySum(arr1[i], arr2[i]));
    } else if (!Array.isArray(arr1[i]) && !Array.isArray(arr2[i])) {
      // If both elements are numbers, add them
      result.push(arr1[i] + arr2[i]);
    } else {
      // Mismatched types, throw an error
      throw new Error('Mismatched element types in nested arrays.');
    }
  }

  return result;
  }  

  function sumNestedArrayByScalar(arr, scalar) {
    if (Array.isArray(arr)) {
      return arr.map((item) => sumNestedArrayByScalar(item, scalar));
    } else {
      return arr + scalar;
    }
  }  
  
  core.Times = async function (args, env) {
    //if (env.numerical === true) return (await interpretate(args[0], env)) * (await interpretate(args[1], env));
    let x = await interpretate(args[0], env);
    let y = await interpretate(args[1], env);

    const typeX = typeof x;
    const typeY = typeof y;

    if (typeX === 'number' && typeof typeY !== 'number') {
      return multiplyNestedArrayByScalar(y, x)
    }

    if (typeY === 'number' && typeof typeX !== 'number') {
      return multiplyNestedArrayByScalar(x, y)
    }    

    //TODO: evaluate it before sending its original symbolic form
    return x * y;
  }

  core.Times.update = core.Times;

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  core.RandomReal = async (args, env) => {
    const range = await interpretate(args[0], env);
    
    if (args.length > 1) {
      let size = await interpretate(args[1], env);
      let arr = [];

    if (size[0]) {
      for (let j=0; j<size[0]; ++j) {
        const sub = [];
        for (let i=0; i<size[1]; ++i) {
          sub.push(getRandomArbitrary(...range));
        }
        arr.push(sub);
      }
      
      return arr;
    } else {
      for (let i=0; i<size; ++i) {
        arr.push(getRandomArbitrary(...range));
      }
      return arr;
    }
  } 
    return getRandomArbitrary(...range);
  

  }

  core.Sin = async function (args, env) {
    return Math.sin(await interpretate(args[0], env));    
  }

  core.Cos = async function (args, env) {
    return Math.cos(await interpretate(args[0], env));    
  }

  core.Cos.update = core.Cos
  core.Cos.destroy = () => {}

  core.Sin.update = core.Sin
  core.Sin.destroy = () => {}

  core.Tuples = async (args, env) => {
    const array = await interpretate(args[0], env);
    const subsetSize = interpretate(args[1], env);

    const result = [];
  
    function generateSubsets(index, currentSubset) {
      if (currentSubset.length === subsetSize) {
        result.push(currentSubset);
        return;
      }
  
      for (let i = 0; i < array.length; i++) {
        generateSubsets(i, [...currentSubset, array[i]]);
      }
    }
  
    generateSubsets(0, []);
  
    return result;
  }  

  core.Tuples.update = core.Tuples;
  core.Tuples.destroy = (args, env) => { interpretate(args[0], env) }
  
  core.EventListener = (args, env) => {
    console.error('Event listener for general cases is not supported! Please, use it with Graphics or other packages');
  }

  core.List = async function (args, env) {
    let copy, e, i, len, list;
    list = [];
  
    if (env.hold === true) {
      //console.log('holding...');
      for (i = 0, len = args.length; i < len; i++) {
        e = args[i];

        list.push(e);
      }
      return list;
    }
    
    copy = Object.assign({}, env);
    for (i = 0, len = args.length; i < len; i++) {
      e = args[i];

      list.push(await interpretate(e, copy));
    }

    return list;
  };
  
  core.List.destroy = (args, env) => {
    var copy, i, len, list;
    for (i = 0, len = args.length; i < len; i++) {
      interpretate(args[i], env);
    }
  };
  
  core.List.update = core.List;
  
  core.Association = function (args, env) {
    return core._getRules(args, env);
  };


  core.Function = (args, env) => {
    //void
  }

  core.$Failed = (args, env) => {
    console.error('$Failed encountered');
  }

  core.Pause = async (args, env) => {
    const time = 1000*(await interpretate(args[0], env));

    return new Promise(resolve => {
      setTimeout(() => {
        //console.log("Finished Inner Timeout")
        resolve('resolved');
      }, time);
    })  
  }

  core.Normalize = async (args, env) => {
    const data = await interpretate(args[0], env);
    console.log(data);

    let length = 0.0;
    for (let i=0; i<data.length; ++i) {
      length += data[i]*data[i];
    }


    return (data.map((e)=>e/length));
  }

  core.Cross = async (args, env) => {
    const x = await interpretate(args[0], env);
    const y = await interpretate(args[1], env);

    return [y[2]*x[1] - y[1]*x[2], -y[2]*x[0]+y[0]*x[2], y[1]*x[0] - y[0]*x[1]];
  }

  core.CompoundExpression = async (args, env) => {
    //sequential execution
    let content;

    for (const expr of args) {
      content = await interpretate(expr, env);
    }

    return content;
  }

  core.CompoundExpression.destroy = async (args, env) => {
    for (const expr of args) {
      await interpretate(expr, env);
    }    
  }

  core.While = async (args, env) => {
    //sequential execution
    const condition = await interpretate(args[0], env);
    //console.log('condition: ' + condition);
    if (condition) {

      //creating virtual objects is fobidden in cycles
      await interpretate(args[1], {...env, novirtual: true});
      await interpretate(['While', ...args], env);
    }
  } 

  core.If = async (args, env) => {
    const cond = await interpretate(args[0], env);
    if (cond) {
      return await interpretate(args[1], env);
    } else {
      if (args.length > 2) return await interpretate(args[2], env);
      return null;
    }
  }

  core.Less = async (args, env) => {
    if ((await interpretate(args[0], env)) < (await interpretate(args[1], env))) return true; else return false;
  }

  core.Greater = async (args, env) => {
    if ((await interpretate(args[0], env)) > (await interpretate(args[1], env))) return true; else return false;
  }  

  core.Equals = async (args, env) => {
    if ((await interpretate(args[0], env)) === (await interpretate(args[1], env))) return true; else return false;
  }  
  
  
  core.Alert = (args, env) => {
    alert(interpretate(args[0], env));
  }

  core.Print = async (args, env) => {
    console.log('Out:\t'+JSON.stringify(await interpretate(args[0], env)));
  }  

  core.N = (args, env) => {
    const copy = {...env, numerical: true};
    return interpretate(args[0], copy);
  }

  core.AttachDOM = (args, env) => {
    //used to attach dom element to the containirized function
    if (!env.root) {
      console.warn('Using AttachDOM on pure function is not recommended. Consider to use virtual or real containers instead!');
    }

    const id = interpretate(args[0], env);
    env.element = document.getElementById(id);
    return id;
  }

  core.WindowScope = async (args, env) => {
    const key = interpretate(args[0]);
    return window[key];
  }

  core.Evaluate = async (args, env) => {
    const i = await interpretate(args[0], env);

    return await interpretate(i, env);
  }

  core.RandomSample = async (args, env) => {
    //TODO: needs perfomance optimization. do not evaluate deeper than
    let list = await interpretate(args[0], {...env});

    _shuffle(list);

    return list;
  }

  function _shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  core.Table = async (args, env) => {
    let copy = Object.assign({}, env);
    copy.hold = false;
    
    let listOfRanges = [];

    for (let ranges of args.slice(1)) {
      listOfRanges.push({ranges: await interpretate(ranges, {...env, hold: true})});
      //just to get a JS array of WL objects //hah kinda strange combination
    }

    if (!copy.scope) copy.scope = {};
    let deepcopy = {...copy.scope};

    //first stage - assign the first values
    for (let i=0; i<listOfRanges.length; ++i) {
      //console.warn(listOfRanges[i]);
      listOfRanges[i].id =  listOfRanges[i].ranges.shift();
      //console.log('variable: '+listOfRanges[i].id);

      switch(listOfRanges[i].ranges.length) {
        case 1:
          const a = await interpretate(listOfRanges[i].ranges[0], {...env, numerical:true, novirtual:true, hold:false});
          if (a instanceof Array) {
            //array instead of a number
            listOfRanges[i].ranges = [1, a.length];
            listOfRanges[i].array = a;

            break;
          }
          
          const newranges = [1, a];   
          listOfRanges[i].ranges = newranges;       
        
        break;

        case 2:
          //console.log('a numerical range');
  
          listOfRanges[i].ranges[0] = await interpretate(listOfRanges[i].ranges[0], {...env, novirtual:true, numerical:true, hold:false});
          listOfRanges[i].ranges[1] = await interpretate(listOfRanges[i].ranges[1], {...env, novirtual:true, numerical:true, hold:false});
        break;
  
        case 3:
          //console.log('a numerical range with defined step');
  
          listOfRanges[i].ranges[0] = await interpretate(listOfRanges[i].ranges[0], {...env, novirtual:true, numerical:true, hold:false});
          listOfRanges[i].ranges[1] = await interpretate(listOfRanges[i].ranges[1], {...env, novirtual:true, numerical:true, hold:false});
          listOfRanges[i].ranges[2] = await interpretate(listOfRanges[i].ranges[2], {...env, novirtual:true, numerical:true, hold:false});
        break;      
      }      
    }

    //console.log(JSON.stringify(listOfRanges));


    const iterate = async (r0, f, level) => { 
      const result = [];
      const r = {...r0};

      //console.log('range: '+JSON.stringify(r));

      switch(r.ranges.length) {
      case 2:
        if (r.array) {

          for(let i=r.ranges[0]; i<=r.ranges[1]; i++) {
            //console.log('iterator '+r.id+' = '+i);
            deepcopy[r.id] = () => r.array[i-1];
            result.push(await f(level+1));
          }

          break;
        }

        for(let i=r.ranges[0]; i<=r.ranges[1]; i++) {
          //console.log('iterator '+r.id+' = '+i);
          deepcopy[r.id] = () => i;
          result.push(await f(level+1));
        }
      break;

      case 3:
        for(let i=r.ranges[0]; i<=r.ranges[1]; i=i+r.ranges[2]) {
          //console.log('iterator '+r.id+' = '+i);
          deepcopy[r.id] = () => i;
          result.push(await f(level+1));
        }
      break;
      }
      return result;
    };  

    let m;
    m = (level) => {
      //console.log('go deeper');
      if (level === listOfRanges.length) return interpretate(args[0], {...copy, scope: {...deepcopy}}); 
      //console.log('next nested');
      return iterate(listOfRanges[level], m, level);
    }

    const table = await iterate(listOfRanges[0], m, 0);

    if (env.hold) {
      //env.hold = false;
      return ["JSObject", table]; 
    }
    return table;

  }

  core.Table.update = core.Table

  core.Table.destroy = (args, env) => {
    args.forEach((a) => {
      interpretate(a, env);
    })
  }

  core.JSObject = (args, env) => {
    return args[0];
  }

  core.Set = async (args, env) => {
    const data = await interpretate(args[1], {...env, novirtual: true});
    const name = args[0];

    //console.log(name);

    if (name in core) {
      //console.log("update");
      //update
      core[name].data = data;

      for (const inst of Object.values(core[name].instances)) {
        inst.update();
      };    

      return;
    }

    //create
    console.log("create");
    core[name] = async (args, env) => {
      //console.log('calling our symbol...');
      if (env.root && !env.novirtual) core[name].instances[env.root.uid] = env.root; //if it was evaluated insdide the container, then, add it to the tracking list
      if (env.hold) return ['JSObject', core[name].data];

      return core[name].data;
    }

    core[name].update = async (args, env) => {
      if (env.hold) return ['JSObject', core[name].data];
      return core[name].data;
    }    

    core[name].virtual = true;
    core[name].instances = {};

    core[name].data = data;

  }

  core.Set.destroy = (args, env) => {
    interpretate(args[1], env);
  }

  core.SetDelayed = async (args, env) => {
    //just copy Set without intepreteate()

  } 

  core.Length = async (args, env) => {
    const l = (await interpretate(args[0], {...env, novirtual:true})).length;

    console.log('length: '+l);
    return l;
  }

  core.Part = async (args, env) => {
    const p = await interpretate(args[1], env);
    //console.log('taking part '+p);
    const data = await interpretate(args[0], {...env, hold:true});

    //console.log(JSON.stringify(data));

    if (p instanceof Array) {
      
      if (core._typeof(data, env) == 'JSObject') return p.map(i => data[1][i-1]);
      return await interpretate(p.map(i => data[1][i-1]), env);
    } else {

      
      //console.log('data: '+JSON.stringify(data));
      if (core._typeof(data, env) == 'JSObject') return data[1][p-1];
      return await interpretate(data[p-1], env);
    }
  }  

  core.Part.update = core.Part;

  core.JSObject = (args, env) => {
    return args[0];
  }

  core.JSObject.update = core.JSObject;

  core.FrontUpdateSymbol = (args, env) => {
    const name = interpretate(args[0], env);
    console.log("update");
    //update
    core[name].data = args[1];

    console.log('instance list');
    console.log(core[name].instances);

    for (const inst of Object.values(core[name].instances)) {
      inst.update();
    };    
  }

  /*core.RGBColor =  async (args, env) => {
    const color = [];
    for (const col of args) {
      color.push(await interpretate(col, env));
    }
    
    color.unshift('RGBColor');
    console.log('color:' + JSON.stringify(color));
    return color;

    return new UnevaluedSymbl() aka JS object
  }*/

  core.Flatten = async (args, env) => {
    //always reset hold if it is there, that it wont propagate
    const result = (await interpretate(args[0], {...env, hold:false})).flat(Infinity);
    if (env.hold) return ['JSObject', result];
    return result;
  }

  core.Partition = async (args, env) => {
    const perChunk = await interpretate(args[1], {...env, hold:false});
    const inputArray = await interpretate(args[0], {...env, hold:false});

    const result = inputArray.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index/perChunk)
    
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
    
      resultArray[chunkIndex].push(item)
    
      return resultArray
    }, []);


    if (env.hold) return ['JSObject', result];
    return result;
  }  

  core.HoldFirstLevel = async (args, env) => {
    return await interpretate(args[0], {...env, hold:true});
  } 

  core.CheckLatencyToHost = async (args, env) => {
    let start = performance.now();
    let r = await server.askKernel('Table[i, {i, 100000}];');
    let stop = performance.now();

    const empty = stop - start;

    start = performance.now();
    r = await server.askKernel('Table[i, {i, 100000}]');
    stop = performance.now();

    const withData = 800200/(stop - start);

    return `Latency: ${empty} ms, with payload: ${withData} bytes / ms`;    
  }

  core.Benchmark = async (args, env) => {
    let host = await server.askKernel('Table[Sqrt[Sin[i]], {i, 0.0, 100000.0}] // RepeatedTiming // First');
   
    let start, stop;
    let front = [];

    for (let i=0; i<10; ++i) {
      start = performance.now();
      await interpretate(['Table', ['Sqrt', ['Sin', 'i']], ['List', 'i', 0.0, 100000.0]], env);
      stop = performance.now();

      front.push((stop - start)/1000);
    }

    const average = host/(front.reduce((a, b) => a + b, 0) / front.length);
    const max = host/Math.max(...front);

    return `Average frontend speed ${average} with the slowest ${max}`;    
  }  

core.With = async (args, env) => {
  const params = await interpretate(args[0], {...env, hold:true});

  console.log(JSON.stringify(params));
  
  let scope;
  if (env.scope) scope = {...env.scope}; else scope = {};

  const copy = {...env, scope: scope};
  for (const p of params) {
    const r = await interpretate(p[2], env);
    copy.scope[p[1]] = () => r;
  }

  return await interpretate(args[1], copy);
} 

core.With.update = core.With

core.With.destroy = (args, env) => {
  //destroy params
  interpretate(args[0], env);

  //destory args
  interpretate(args[1], env);
}

core.Map = async (args, env) => {
  const func = args[0];
  const array = await interpretate(args[1], {...env, hold:false}); 
  console.log(array);

  const result = [];

  for (const el of array) {
    result.push(await interpretate([func, ['JSObject', el]], {...env, hold:false}));
  }

  if (env.hold) return ["JSObject", result];
  return result;
}

core.White = (args, env) => {
  return interpretate(['RGBColor', 1, 1, 1], env);
}

core.LightBlue = (args, env) => {
  return interpretate(['RGBColor', 0.87, 0.94, 1], env);
}

core.Brown = (args, env) => {
  return interpretate(['RGBColor', 0.6, 0.4, 0.2], env);
}

core.Sqrt = async (args, env) => {
  return Math.sqrt(await interpretate(args[0], env));
}

core.Rule = async (args, env) => {
  const key = await interpretate(args[0], env);
  const val = await interpretate(args[1], env)
  if (env.Association) {
    env.Association[key] = val;
    return;
  } else {
    return {key: val};
  }
}

core.Pi = () => Math.PI
core.Pi.update = () => Math.PI

window.core = core;

