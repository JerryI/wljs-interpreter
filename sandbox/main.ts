
import {cmEditor, jsEditor} from './lib/monaco/cmEditor'
import { elements, showError, showIframe } from './utils/dom'

import { debounce } from './utils/helpers'

import type { ErrorMessageType, StateType, TranspiledCodeType } from './types'
import { text } from 'stream/consumers'

import JSONCrush from 'jsoncrush'

let state: StateType = 'editing'
let errorMessage: ErrorMessageType = ''
  
let logs : Array<string> = [];

let preCompiled : Object;

let compiled : Object;
let jscompiled: string;

let params = {};

let includes : Array<string> = [];

let logElement : any;

let paused : boolean = false;

const examples = [
  {  
    title: 'Moving balls',
    desc: 'A smooth graphics 2D animation purely in browser',
    url: './simple.txt'  
  },
  {
    title: 'Lines animation',
    desc: 'An example from Wolfram Research conference in S.Piter 2023',
    url: './piter.txt' 
  },  
  {
    title: '3D Graphics',
    desc: 'Water shaders, camera control and SLERP of matrixes',
    url: './boat.txt' 
  },    
  {
    title: 'Meta markers',
    desc: 'An example of evaluating expressions inside already existing container',
    url: './meta.txt' 
  },  
  {
    title: 'Low-level dynamic',
    desc: 'An example of using frontend objects (internal data structure)',
    url: './foexample.txt' 
  },
  {
    title: 'JS - Wolfram communication',
    desc: 'A simple demo with JS function called from WL',
    url: './jssimple.txt' 
  },       
]  

let kernelSocket = {
  status: false,
  connecting: false,
  socket: undefined,
  nextPromise: undefined
}

class Deferred {
  promise : Promise<any>;
  reject = {}
  resolve = {}
  uid : Number;
  
  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject
      this.resolve = resolve
    });
  }
} 


let messageKernelError = 0;
 
const registerConnection  = () : void => {
  if (kernelSocket.connecting) return;

  kernelSocket.connecting = true;

  kernelSocket.socket = new WebSocket("ws://localhost:8099");
  kernelSocket.socket.onopen = function(e) {
    alert("[open] connecting established");
    kernelSocket.status = true;
  }; 

  kernelSocket.socket.onmessage = function(event) {
    kernelSocket.nextPromise(JSON.parse(event.data)); 
  };

  kernelSocket.socket.onclose = function(event) {
    console.log(event);
    kernelSocket.status = false;
    //alert('Connection lost. Please, update the page to see new changes.');
  };

  kernelSocket.socket.onerror = function(event) {
    console.log(event);
    kernelSocket.status = false;
    //alert('Connection lost. Please, update the page to see new changes.');
  };  
}

async function transpileCode(code: string): Promise<TranspiledCodeType> {
  // ignore imports so Babel doesn't transpile it
  if (!kernelSocket.status) {

    if (messageKernelError > 0) registerConnection();

    if (messageKernelError == 2) alert('No connection to Wolfram Kernel is available. Cannot transform WL to JSONExpression offline');
    ++messageKernelError;

    return {
      iframeCode: preCompiled
    };
  } 

  const p = new Deferred();
  kernelSocket.nextPromise = p.resolve;
  kernelSocket.socket.send('transpile["'+code.replace(/(\r\n|\n|\r)/gm, "").replaceAll('\\\"', '\\\\\"').replaceAll('\"', '\\"')+'"]');
 
  const transpiled = await p.promise;
  preCompiled = transpiled;

  return {
    // this is passed to `updateIframe`
    iframeCode: transpiled,
    // this is passed to `updateSource`

  }   
}   

function updateIframe(code: Object, codejs: string): void {
  compiled = code;
  jscompiled = codejs;
  
  const inc = includes.map((e)=>`<script type="module" src="${e}"></script>`).join();
     
  const source = /* html */ `
      <html>
      <head>  
     
        <link rel="stylesheet" href="iframe.css">
        <script>             
        window.console = {
          log: function(str){
              //REM: Forward the string to the top window.
              //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
              window.top.postMessage({kind: 'log', 'text':JSON.stringify(str)}, '*');
          },
          warn: function(str){
            //REM: Forward the string to the top window.
            //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.top.postMessage({kind: 'log', 'text':JSON.stringify(str)}, '*');
          },
          error: function(str){
            //REM: Forward the string to the top window.
            //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.top.postMessage({kind: 'error', 'text':JSON.stringify(str)}, '*');
          }                  
        };
        window.onerror = (a, b, c, d, e) => {

          window.top.postMessage({kind: 'error', 'text': a}, '*');
        };
        function isElement(o){
          return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
        }
        </script>
     
      </head>
      <body>
        <div id="canvas"></div>

        
        <script type="module" src="interpreter.js"></script>
        <script type="module" src="core.js"></script>

        ${inc}
        

        <script type="module">
          let global = {};
          let env = {global: global};
          window.top.postMessage({kind: 'ready'}, '*');

          window.addEventListener("message", async ({ data, source }) => {
            
            //const r = await .catch(error => console.error("JS Error:"+JSON.stringify(error)));
            const r = await eval("(async function () {"+data[0].replaceAll('\"', '\\"')+"})()");


            if (isElement(r)) {
              document.getElementById('canvas').appendChild(r);
            } else {
              console.log(r);
            }

            await interpretate(data[1], env);
          });

        </script>
      </body>
      </html>
    `;
  elements.iframe.srcdoc = source
}

function updateSource(): void {
  const sourceHTML = /* html */ `
      <xmp></xmp>
    `
  elements.source.innerHTML = sourceHTML
  logElement = elements.source.getElementsByTagName('xmp')[0];
}

function log(log:string) {
  logElement.appendChild(document.createTextNode(log+'\n'));

}

function logError(error: string): void {
  const errorHtml = /* html */ `
      <h3>💥 Error</h3>
      <xmp>${error}</xmp>
    `
  elements.errors.innerHTML = errorHtml
}

async function updateUI(): Promise<void> {
  if (paused) return;
  if (state === 'editing') {
    showIframe()
    const code = cmEditor.state.doc.toString()
    const { iframeCode } = await transpileCode(code)
    updateSource()
 
   
    updateIframe(iframeCode, jsEditor.state.doc.toString())


    return
  }

  if (state === 'error') {
    showError()
    logError(errorMessage)
    return
  }

  throw new Error(`State ${state} should not be possible. 💥`)
}

updateSource()
//console.log = log;

elements.editor.addEventListener('keyup', debounce(updateUI))
elements.jseditor.addEventListener('keyup', debounce(updateUI))

window.addEventListener('message', function(event){
  const mess:any = event.data;
  switch(mess.kind) {
    case 'log':
      log(mess.text);
    break;

    case 'error':
      state = 'error'
      errorMessage = mess.text
      updateUI()
      state = 'editing'
    break;

    case 'warning':

    break;

    case 'ready':
      console.log('ready');
      event.source?.postMessage([jscompiled, compiled]);
    break;
  } 
  
});


function loadExample(r: any) {

  cmEditor.dispatch({changes: {
    from: 0,
    to: cmEditor.state.doc.length,
    insert: r.wls
  }})
  jsEditor.dispatch({changes: {
    from: 0,
    to: jsEditor.state.doc.length,
    insert: r.js
  }})
  preCompiled = r?.compiled || [];
  includes = r?.includes || [];

  params = r?.params;
  
  updateUI();

  if (params?.noLogs) {
    elements.source.classList.add('hidden');
    elements.sourceholder.classList.add('shrink');
    elements.output.classList.add('expand');
  } else {
    elements.source.classList.remove('hidden');
    elements.sourceholder.classList.remove('shrink');
    elements.output.classList.remove('expand');
  }
  if (params?.noCode) { 
    elements.code.classList.add('hidden');      
  } else {
    elements.code.classList.remove('hidden');
  }
  
  elements.loading.classList.add('hidden');
}

function openExample(e:string) {
  elements.loading.classList.remove('hidden');
  const f = fetch(e).then((resp)=>{
    resp.text().then((r)=>{
      console.log(r);
      const data = JSON.parse(JSONCrush.uncrush(decodeURIComponent(r)));
      console.log(data);
      loadExample(data);
    });
  });  
}

elements.fullbutton.addEventListener('click', ()=>{
  toggleFull();
});

function toggleFull() {
  elements.code.classList.toggle('hidden');
}

function toggleLogs() {
  elements.source.classList.toggle('hidden');
  elements.sourceholder.classList.toggle('shrink');
  elements.output.classList.toggle('expand');
}

elements.logbutton.addEventListener('click', ()=> {
  toggleLogs();
});

function createExamplesModal() {
  const rows = examples.map((el,i) => {
    return `<tr class="row" id="example-${i}">
      <td>${el.title}</td><td>${el.desc}</td>
    </tr>`
  }).join('');
   
  elements.modal.innerHTML = `
  <h2>Examples</h2><table>
    <tbody>
      ${rows}
    </tbody>
  </table>`;

  elements.modal.classList.add('tall');

  elements.modal.classList.remove('hidden');

  examples.forEach((e, i) => {
    document.getElementById('example-'+i).addEventListener('click', ()=>{
      elements.modal.classList.add('hidden');
      elements.modal.classList.remove('tall');
      openExample(e.url);
      
    })
  });

  const listener = (ev)=>{
    if (ev.target !== elements.modal ) {
      elements.modal.classList.add('hidden');
      elements.modal.innerHTML = ``;
      window.removeEventListener('click', listener);
    }
  };

  setTimeout(() => window.addEventListener('click', listener), 300);  


}

function createIncludesModal() {  
  elements.modal.innerHTML = ``;
  const heading = document.createElement('h2');
  heading.innerText = "Includes";
  elements.modal.appendChild(heading);

  const textArea = document.createElement('textarea');
  textArea.value = includes.join('\n');
  elements.modal.appendChild(textArea);

  const listener = (ev)=>{
    if (ev.target !== elements.modal && ev.target !== textArea && ev.target !== heading) {
      elements.modal.classList.add('hidden');
      elements.modal.innerHTML = ``;
      window.removeEventListener('click', listener);
    }
  };

  setTimeout(() => window.addEventListener('click', listener), 300);

  elements.modal.classList.remove('hidden');

  textArea.onchange = (str) => {
    includes = str.target.value.split('\n');
  }

}

function createExportModal() {  
  elements.modal.innerHTML = ``;
  const heading = document.createElement('h2');
  heading.innerText = "Compressed string";
  elements.modal.appendChild(heading);

  const textArea = document.createElement('textarea');
  textArea.value = encodeURIComponent(JSONCrush.crush(JSON.stringify(
    {
      wls: cmEditor.state.doc.toString(),
      js: jsEditor.state.doc.toString(),
      includes: includes,
      compiled: preCompiled
    }
  )));
  elements.modal.appendChild(textArea);

  const listener = (ev)=>{
    if (ev.target !== elements.modal && ev.target !== textArea && ev.target !== heading) {
      elements.modal.classList.add('hidden');
      elements.modal.innerHTML = ``;
      window.removeEventListener('click', listener);
    }
  };

  setTimeout(() => window.addEventListener('click', listener), 300);

  elements.modal.classList.remove('hidden');
}

function createImportModal() {  
  elements.modal.innerHTML = ``;
  const heading = document.createElement('h2');
  heading.innerText = "Paste a string and close this window";
  elements.modal.appendChild(heading);

  const textArea = document.createElement('textarea');
  textArea.value = '';

  elements.modal.appendChild(textArea);

  let data: any = undefined;

  const listener = (ev)=>{
    if (ev.target !== elements.modal && ev.target !== textArea && ev.target !== heading) {
      elements.modal.classList.add('hidden');
      elements.modal.innerHTML = ``;
      window.removeEventListener('click', listener);

      if (data) {
        loadExample(data);
      }
    }
  };

  setTimeout(() => window.addEventListener('click', listener), 300);

  elements.modal.classList.remove('hidden');

  textArea.onchange = (str) => {
    data = JSON.parse(JSONCrush.uncrush(decodeURIComponent(str.target.value)));
  }  
}

function saveState() {
  localStorage.setItem("wljs-state", JSON.stringify({
    wls: cmEditor.state.doc.toString(),
    js: jsEditor.state.doc.toString(),
    includes: includes,
    compiled: preCompiled
  }));
}


function loadState() {
  const item = localStorage.getItem("wljs-state");
  if (item) {
    const obj = JSON.parse(item);
    loadExample(obj);
  } else {
    openExample('./simple.txt');
  }
}

elements.buttonOpen.addEventListener('click', ()=>createExamplesModal());
elements.buttonIncludes.addEventListener('click', ()=>createIncludesModal());

elements.buttonImport.addEventListener('click', ()=>createImportModal());
elements.buttonExport.addEventListener('click', ()=>createExportModal());

elements.buttonSave.addEventListener('click', ()=>saveState());

elements.buttonPause.addEventListener('click', () => {
  paused = !paused;
  elements.buttonPause.classList.toggle('activated');
});

loadState();






