      <xmp></xmp>
    `;fQ.source.innerHTML=e,r=fQ.source.getElementsByTagName("xmp")[0]}async function f_(){if(!fj){if("editing"===fG){fQ.iframe.style.display="block",fQ.errors.style.display="none";let e=fF.state.doc.toString(),{iframeCode:t}=await fH(e);fY(),function(e,t){a=e,n=t;let i=fW.map(e=>`<script type="module" src="${e}"></script>`).join(),o=`
      <html>
      <head>  
     
        <link rel="stylesheet" href="iframe.css">
        <script>             
        window.console = {
          log: function(str){
              //REM: Forward the string to the top window.
              //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
              window.parent.postMessage({kind: 'log', 'text':JSON.stringify(str)}, '*');
          },
          warn: function(str){
            //REM: Forward the string to the top window.
            //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.parent.postMessage({kind: 'log', 'text':JSON.stringify(str)}, '*');
          },
          error: function(str){
            //REM: Forward the string to the top window.
            //REM: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
            window.parent.postMessage({kind: 'error', 'text':JSON.stringify(str)}, '*');
          }                  
        };
        window.onerror = (a, b, c, d, e) => {

          window.parent.postMessage({kind: 'error', 'text': a}, '*');
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

        ${i}
        

        <script type="module">
          let global = {};
          let env = {global: global};
          window.parent.postMessage({kind: 'ready'}, '*');

          window.addEventListener("message", async ({ data, source }) => {
            
            //const r = await .catch(error => console.error("JS Error:"+JSON.stringify(error)));
            const r = await eval("(async function () {"+data[0].replaceAll('"', '\\"')+"})()");


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
    `;fQ.iframe.srcdoc=o}(t,fL.state.doc.toString());return}if("error"===fG){fQ.iframe.style.display="none",fQ.errors.style.display="block",function(e){let t=`
      <h3>💥 Error</h3>
      <xmp>${e}</xmp>
    `;fQ.errors.innerHTML=t}(f$);return}throw Error(`State ${fG} should not be possible. 💥`)}}function fK(e){if(fF.dispatch({changes:{from:0,to:fF.state.doc.length,insert:e.wls}}),fL.dispatch({changes:{from:0,to:fL.state.doc.length,insert:e.js}}),o=e?.compiled||[],fW=e?.includes||[],fz=e?.params,f_(),fN){fQ.loading.classList.add("hidden");return}fz?.noLogs?(fQ.source.classList.add("hidden"),fQ.sourceholder.classList.add("shrink"),fQ.output.classList.add("expand")):(fQ.source.classList.remove("hidden"),fQ.sourceholder.classList.remove("shrink"),fQ.output.classList.remove("expand")),fz?.noCode?fQ.code.classList.add("hidden"):fQ.code.classList.remove("hidden"),fQ.loading.classList.add("hidden")}function fJ(e){fQ.loading.classList.remove("hidden"),fetch(e).then(e=>{e.text().then(e=>{console.log(e);let t=JSON.parse(fB.uncrush(decodeURIComponent(e)));console.log(t),fK(t)})})}function f0(){console.log("toggle full"),fQ.code.classList.toggle("hidden")}function f2(){console.log("toggle logs"),fQ.source.classList.toggle("hidden"),fQ.sourceholder.classList.toggle("shrink"),fQ.output.classList.toggle("expand")}fY(),fQ.editor.addEventListener("keyup",fE(f_)),fQ.jseditor.addEventListener("keyup",fE(f_)),window.addEventListener("message",function(e){let t=e.data;switch(t.kind){case"log":var i;i=t.text,r.appendChild(document.createTextNode(i+"\n"));break;case"error":fG="error",f$=t.text,f_(),fG="editing";break;case"warning":break;case"ready":console.log("ready"),e.source?.postMessage([n,a])}}),fQ.fullbutton.addEventListener("click",()=>{f0()}),fQ.logbutton.addEventListener("click",()=>{f2()}),fQ.buttonOpen.addEventListener("click",()=>(function(){let e=fq.map((e,t)=>`<tr class="row" id="example-${t}">
      <td>${e.title}</td><td>${e.desc}</td>
    </tr>`).join("");fQ.modal.innerHTML=`
  <h2>Examples</h2><table>
    <tbody>
      ${e}
    </tbody>
  </table>`,fQ.modal.classList.add("tall"),fQ.modal.classList.remove("hidden"),fq.forEach((e,t)=>{document.getElementById("example-"+t).addEventListener("click",()=>{fQ.modal.classList.add("hidden"),fQ.modal.classList.remove("tall"),fJ(e.url)})});let t=e=>{e.target!==fQ.modal&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",t))};setTimeout(()=>window.addEventListener("click",t),300)})()),fQ.buttonIncludes.addEventListener("click",()=>(function(){fQ.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Includes",fQ.modal.appendChild(e);let t=document.createElement("textarea");t.value=fW.join("\n"),fQ.modal.appendChild(t);let i=o=>{o.target!==fQ.modal&&o.target!==t&&o.target!==e&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fQ.modal.classList.remove("hidden"),t.onchange=e=>{fW=e.target.value.split("\n")}})()),fQ.buttonImport.addEventListener("click",()=>(function(){let e;fQ.modal.innerHTML="";let t=document.createElement("h2");t.innerText="Paste a string and close this window",fQ.modal.appendChild(t);let i=document.createElement("textarea");i.value="",fQ.modal.appendChild(i);let o=a=>{a.target!==fQ.modal&&a.target!==i&&a.target!==t&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",o),e&&fK(e))};setTimeout(()=>window.addEventListener("click",o),300),fQ.modal.classList.remove("hidden"),i.onchange=t=>{e=JSON.parse(fB.uncrush(decodeURIComponent(t.target.value)))}})()),fQ.buttonExport.addEventListener("click",()=>(function(){fQ.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Compressed string",fQ.modal.appendChild(e);let t=document.createElement("textarea");t.value=encodeURIComponent(fB.crush(JSON.stringify({wls:fF.state.doc.toString(),js:fL.state.doc.toString(),includes:fW,compiled:o}))),fQ.modal.appendChild(t);let i=o=>{o.target!==fQ.modal&&o.target!==t&&o.target!==e&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fQ.modal.classList.remove("hidden")})()),fQ.buttonSave.addEventListener("click",()=>void localStorage.setItem("wljs-state",JSON.stringify({wls:fF.state.doc.toString(),js:fL.state.doc.toString(),includes:fW,compiled:o}))),fQ.buttonPause.addEventListener("click",()=>{fj=!fj,fQ.buttonPause.classList.toggle("activated")}),function(){if(function(){window.location.search;let e=new URL(window.location.href),t={};return e.searchParams.forEach((i,o,a)=>{console.log(o,i,e.searchParams===a),t[o]=i}),console.log(t),console.log("checked!"),"true"==t.full&&(f0(),fN=!0),"false"==t.logs&&(f2(),fN=!0),!!t.example&&(fJ("./"+t.example),!0)}())return;let e=localStorage.getItem("wljs-state");if(e){let t=JSON.parse(e);fK(t)}else fJ("./simple.txt")}();
//# sourceMappingURL=index.9c22f8a5.js.map