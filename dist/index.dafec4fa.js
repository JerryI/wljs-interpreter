      <xmp></xmp>
    `;fM.source.innerHTML=e,r=fM.source.getElementsByTagName("xmp")[0]}async function fH(){if(!fz){if("editing"===fE){fM.iframe.style.display="block",fM.errors.style.display="none";let e=fA.state.doc.toString(),{iframeCode:t}=await fX(e);fU(),function(e,t){a=e,n=t;let i=fN.map(e=>`<script type="module" src="${e}"></script>`).join(),o=`
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
    `;fM.iframe.srcdoc=o}(t,fF.state.doc.toString());return}if("error"===fE){fM.iframe.style.display="none",fM.errors.style.display="block",function(e){let t=`
      <h3>💥 Error</h3>
      <xmp>${e}</xmp>
    `;fM.errors.innerHTML=t}(fI);return}throw Error(`State ${fE} should not be possible. 💥`)}}function fY(e){if(fA.dispatch({changes:{from:0,to:fA.state.doc.length,insert:e.wls}}),fF.dispatch({changes:{from:0,to:fF.state.doc.length,insert:e.js}}),o=e?.compiled||[],fN=e?.includes||[],f$=e?.params,fH(),fG){fM.loading.classList.add("hidden");return}f$?.noLogs?(fM.source.classList.add("hidden"),fM.sourceholder.classList.add("shrink"),fM.output.classList.add("expand")):(fM.source.classList.remove("hidden"),fM.sourceholder.classList.remove("shrink"),fM.output.classList.remove("expand")),f$?.noCode?fM.code.classList.add("hidden"):fM.code.classList.remove("hidden"),fM.loading.classList.add("hidden")}function f_(e){fM.loading.classList.remove("hidden"),fetch(e).then(e=>{e.text().then(e=>{console.log(e);let t=JSON.parse(fB.uncrush(decodeURIComponent(e)));console.log(t),fY(t)})})}function fK(){console.log("toggle full"),fM.code.classList.toggle("hidden")}function fJ(){console.log("toggle logs"),fM.source.classList.toggle("hidden"),fM.sourceholder.classList.toggle("shrink"),fM.output.classList.toggle("expand")}fU(),fM.editor.addEventListener("keyup",fL(fH)),fM.jseditor.addEventListener("keyup",fL(fH)),window.addEventListener("message",function(e){let t=e.data;switch(t.kind){case"log":var i;i=t.text,r.appendChild(document.createTextNode(i+"\n"));break;case"error":fE="error",fI=t.text,fH(),fE="editing";break;case"warning":break;case"ready":console.log("ready"),e.source?.postMessage([n,a])}}),fM.fullbutton.addEventListener("click",()=>{fK()}),fM.logbutton.addEventListener("click",()=>{fJ()}),fM.buttonOpen.addEventListener("click",()=>(function(){let e=fj.map((e,t)=>`<tr class="row" id="example-${t}">
      <td>${e.title}</td><td>${e.desc}</td>
    </tr>`).join("");fM.modal.innerHTML=`
  <h2>Examples</h2><table>
    <tbody>
      ${e}
    </tbody>
  </table>`,fM.modal.classList.add("tall"),fM.modal.classList.remove("hidden"),fj.forEach((e,t)=>{document.getElementById("example-"+t).addEventListener("click",()=>{fM.modal.classList.add("hidden"),fM.modal.classList.remove("tall"),f_(e.url)})});let t=e=>{e.target!==fM.modal&&(fM.modal.classList.add("hidden"),fM.modal.innerHTML="",window.removeEventListener("click",t))};setTimeout(()=>window.addEventListener("click",t),300)})()),fM.buttonIncludes.addEventListener("click",()=>(function(){fM.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Includes",fM.modal.appendChild(e);let t=document.createElement("textarea");t.value=fN.join("\n"),fM.modal.appendChild(t);let i=o=>{o.target!==fM.modal&&o.target!==t&&o.target!==e&&(fM.modal.classList.add("hidden"),fM.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fM.modal.classList.remove("hidden"),t.onchange=e=>{fN=e.target.value.split("\n")}})()),fM.buttonImport.addEventListener("click",()=>(function(){let e;fM.modal.innerHTML="";let t=document.createElement("h2");t.innerText="Paste a string and close this window",fM.modal.appendChild(t);let i=document.createElement("textarea");i.value="",fM.modal.appendChild(i);let o=a=>{a.target!==fM.modal&&a.target!==i&&a.target!==t&&(fM.modal.classList.add("hidden"),fM.modal.innerHTML="",window.removeEventListener("click",o),e&&fY(e))};setTimeout(()=>window.addEventListener("click",o),300),fM.modal.classList.remove("hidden"),i.onchange=t=>{e=JSON.parse(fB.uncrush(decodeURIComponent(t.target.value)))}})()),fM.buttonExport.addEventListener("click",()=>(function(){fM.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Compressed string",fM.modal.appendChild(e);let t=document.createElement("textarea");t.value=encodeURIComponent(fB.crush(JSON.stringify({wls:fA.state.doc.toString(),js:fF.state.doc.toString(),includes:fN,compiled:o}))),fM.modal.appendChild(t);let i=o=>{o.target!==fM.modal&&o.target!==t&&o.target!==e&&(fM.modal.classList.add("hidden"),fM.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fM.modal.classList.remove("hidden")})()),fM.buttonSave.addEventListener("click",()=>void localStorage.setItem("wljs-state",JSON.stringify({wls:fA.state.doc.toString(),js:fF.state.doc.toString(),includes:fN,compiled:o}))),fM.buttonPause.addEventListener("click",()=>{fz=!fz,fM.buttonPause.classList.toggle("activated")}),function(){if(function(){window.location.search;let e=new URL(window.location.href),t={};return e.searchParams.forEach((i,o,a)=>{console.log(o,i,e.searchParams===a),t[o]=i}),console.log(t),console.log("checked!"),"true"==t.full&&(fK(),fG=!0),"false"==t.logs&&(fJ(),fG=!0),!!t.example&&(f_("./"+t.example),!0)}())return;let e=localStorage.getItem("wljs-state");if(e){let t=JSON.parse(e);fY(t)}else f_("./simple.txt")}();
//# sourceMappingURL=index.dafec4fa.js.map