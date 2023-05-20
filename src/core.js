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
      return 'string';
    }
    if (typeof args === 'number') {
      return 'number';
    }
    if (args instanceof Array) {
      return args[0];
    }

    return 'undefined';
  }
  
  core._getRules = function(args, env) {
    let rules = {};
    if (env.hold) {
      args.forEach((el)=>{
        if(el instanceof Array) {
          if (el[0] === 'Rule') {
            rules[interpretate(el[1], {...env, hold:false})] = el[2];
          }
        }
      });
    } else {
      args.forEach((el)=>{
        if(el instanceof Array) {
          if (el[0] === 'Rule') {
            rules[interpretate(el[1], {...env, hold:false})] = interpretate(el[2], env);
          }
        }
      });
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
    ObjectHashMap[key].update(args[1]);
  }

  core.CreateFrontEndObject = function (args, env) {
    const key = interpretate(args[1], env);

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
  
  core.Power = (args, env) => {
    if (!env.numerical) return ["Power", ...args];
    
    const val = interpretate(args[0], env);
    const p   = interpretate(args[1], env);
  
    return Math.pow(val,p);
  }

  core.Plus = (args, env) => {
    if (!env.numerical) return ["Plus", ...args];
    return interpretate(args[0], env) + interpretate(args[1], env);
  }  
  
  core.Rational = function (args, env) {
    if (env.numerical === true) return interpretate(args[0], env)/interpretate(args[1], env);
    
    //return the original form igoring other arguments
    return ["Rational", args[0], args[1]];
  }
  
  core.Times = function (args, env) {
    if (env.numerical === true) return interpretate(args[0], env)*interpretate(args[1], env);
    
    //TODO: evaluate it before sending its original symbolic form
    return ["Times", ...args];
  }

  core.Sin = function (args, env) {
    if (env.numerical === true) return Math.sin(interpretate(args[0], env));
    
    //TODO: evaluate it before sending its original symbolic form
    return ["Sin", ...args];    
  }

  core.Cos = function (args, env) {
    if (env.numerical === true) return Math.cos(interpretate(args[0], env));
    
    //TODO: evaluate it before sending its original symbolic form
    return ["Cos", ...args];    
  }  

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
      console.log('holding...');
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

  core.Rule = function (args, env) {
    //actaully an function generator. can be improved
    const left  = interpretate(args[0], env);
    const right = interpretate(args[1], env);
  
    return new jsRule(left, right);
  };
  
  core.Rule.update = core.Rule;

  core.Function = (args, env) => {
    //void
  }

  core.$Failed = (args, env) => {
    console.error('$Failed encountered');
  }

  core.Pause = async (args, env) => {
    const time = 1000*interpretate(args[0], env);

    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Finished Inner Timeout")
        resolve('resolved');
      }, time);
    })  
  }

  core.CompoundExpression = async (args, env) => {
    //sequential execution
    let content;

    for (const expr of args) {
      content = await interpretate(expr, env);
    }

    return content;
  }

  core.While = async (args, env) => {
    //sequential execution
    const condition = await interpretate(args[0], env);
    //console.log('condition: ' + condition);
    if (condition) {
      await interpretate(args[1], env);
      await interpretate(['While', ...args], env);
    }
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
    
    let ranges = await interpretate(args[1], {...env, hold: true});
    if (!copy.scope) copy.scope = {};

    const it = ranges.shift();
    console.log('variable: '+it);

    console.log('ranges: '+JSON.stringify(ranges));

    let results = [];

    switch(ranges.length) {
      case 1:
        console.log('a list possible');
        ranges[0] = await interpretate(ranges[0], {...env, hold: true});

        console.log(ranges[0]);

        for(let i=0; i<ranges[0].length; i++) {
          let deepcopy = {...copy.scope};
          deepcopy[it] = () => ranges[0][i];

          results.push(await interpretate(args[0], {...copy, scope: deepcopy}));
        }
      break;

      case 2:
        console.log('a numerical range');

        ranges[0] = await interpretate(ranges[0], {...env, numerical:true});
        ranges[1] = await interpretate(ranges[1], {...env, numerical:true});

        for(let i=ranges[0]; i<=ranges[1]; ++i) {
          let deepcopy = {...copy.scope};
          deepcopy[it] = () => i;

          //console.error({...copy, scope: deepcopy});

          results.push(await interpretate(args[0], {...copy, scope: deepcopy}));
        }
      break;

      case 3:
        console.log('a numerical range with defined step');

        ranges[0] = await interpretate(ranges[0], {...env, numerical:true});
        ranges[1] = await interpretate(ranges[1], {...env, numerical:true});
        ranges[2] = await interpretate(ranges[2], {...env, numerical:true});

        for(let i=ranges[0]; i<=ranges[1]; i = i + ranges[2]) {
          let deepcopy = {...copy.scope};
          deepcopy[it] = () => i;

          results.push(await interpretate(args[0], {...copy, scope: deepcopy}));
        }
      break;      
    }

    return results;

  }

  core.JSObject = (args, env) => {
    return args[0];
  }

  core.Set = async (args, env) => {
    const data = await interpretate(args[1], {...env, novirtual: true});
    const name = args[0];

    console.log(name);

    if (name in core) {
      console.log("update");
      //update
      core[name].data = data;

      core[name].instances.forEach((inst) => {
        inst.update();
      });

      

      return;
    }

    //create
    console.log("create");
    core[name] = async (args, env) => {
      console.log('calling our symbol');
      if (env.root && !env.novirtual) core[name].instances.push(env.root); //if it was evaluated insdide the container, then, add it to the tracking list
      if (env.hold) return ['JSObject', core[name].data];

      return core[name].data;
    }

    core[name].update = async (args, env) => {
      if (env.hold) return ['JSObject', core[name].data];
      return core[name].data;
    }    

    core[name].virtual = true;
    core[name].instances = [];

    core[name].data = data;

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
    //console.log('data: '+JSON.stringify(data));
    if (core._typeof(data, env) == 'JSObject') return data[1][p-1];

    return await interpretate(data[p-1], env);
  }  

  core.Part.update = core.Part;

  core.JSObject = (args, env) => {
    return args[0];
  }

  core.JSObject.update = core.JSObject;

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

    const withData = (stop - start)/100000;

    return `Latency: ${empty} ms, with payload: ${withData} ms / expression`;    
  }

