      <xmp></xmp>
    `;fQ.source.innerHTML=e,r=fQ.source.getElementsByTagName("xmp")[0]}async function fH(){if("editing"===fG){fQ.iframe.style.display="block",fQ.errors.style.display="none";let e=fF.state.doc.toString(),{iframeCode:t}=await fX(e);fU(),function(e,t){a=e,n=t;let i=fz.map(e=>`<script type="module" src="${e}"></script>`).join(),o=`
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

        ${i}
        

        <script type="module">
          let global = {};
          let env = {global: global};
          window.top.postMessage({kind: 'ready'}, '*');

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
    `;fQ.errors.innerHTML=t}(f$);return}throw Error(`State ${fG} should not be possible. 💥`)}function fY(e){fF.dispatch({changes:{from:0,to:fF.state.doc.length,insert:e.wls}}),fL.dispatch({changes:{from:0,to:fL.state.doc.length,insert:e.js}}),o=e?.compiled||[],fz=e?.includes||[],fN=e?.params,fH(),fN?.noLogs?(fQ.source.classList.add("hidden"),fQ.sourceholder.classList.add("shrink"),fQ.output.classList.add("expand")):(fQ.source.classList.remove("hidden"),fQ.sourceholder.classList.remove("shrink"),fQ.output.classList.remove("expand")),fN?.noCode?fQ.code.classList.add("hidden"):fQ.code.classList.remove("hidden"),fQ.loading.classList.add("hidden")}function f_(e){fQ.loading.classList.remove("hidden"),fetch(e).then(e=>{e.text().then(e=>{console.log(e);let t=JSON.parse(fB.uncrush(decodeURIComponent(e)));console.log(t),fY(t)})})}fU(),fQ.editor.addEventListener("keyup",fE(fH)),fQ.jseditor.addEventListener("keyup",fE(fH)),window.addEventListener("message",function(e){let t=e.data;switch(t.kind){case"log":var i;i=t.text,r.appendChild(document.createTextNode(i+"\n"));break;case"error":fG="error",f$=t.text,fH(),fG="editing";break;case"warning":break;case"ready":console.log("ready"),e.source?.postMessage([n,a])}}),fQ.fullbutton.addEventListener("click",()=>{fQ.code.classList.toggle("hidden")}),fQ.logbutton.addEventListener("click",()=>{fQ.source.classList.toggle("hidden"),fQ.sourceholder.classList.toggle("shrink"),fQ.output.classList.toggle("expand")}),fQ.buttonOpen.addEventListener("click",()=>(function(){let e=fW.map((e,t)=>`<tr class="row" id="example-${t}">
      <td>${e.title}</td><td>${e.desc}</td>
    </tr>`).join("");fQ.modal.innerHTML=`
  <h2>Examples</h2><table>
    <tbody>
      ${e}
    </tbody>
  </table>`,fQ.modal.classList.remove("hidden"),fW.forEach((e,t)=>{document.getElementById("example-"+t).addEventListener("click",()=>{fQ.modal.classList.add("hidden"),f_(e.url)})})})()),fQ.buttonIncludes.addEventListener("click",()=>(function(){fQ.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Includes",fQ.modal.appendChild(e);let t=document.createElement("textarea");t.value=fz.join("\n"),fQ.modal.appendChild(t);let i=o=>{o.target!==fQ.modal&&o.target!==t&&o.target!==e&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fQ.modal.classList.remove("hidden"),t.onchange=e=>{fz=e.target.value.split("\n")}})()),fQ.buttonImport.addEventListener("click",()=>(function(){let e;fQ.modal.innerHTML="";let t=document.createElement("h2");t.innerText="Paste a string and close this window",fQ.modal.appendChild(t);let i=document.createElement("textarea");i.value="",fQ.modal.appendChild(i);let o=a=>{a.target!==fQ.modal&&a.target!==i&&a.target!==t&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",o),e&&fY(e))};setTimeout(()=>window.addEventListener("click",o),300),fQ.modal.classList.remove("hidden"),i.onchange=t=>{e=JSON.parse(fB.uncrush(decodeURIComponent(t.target.value)))}})()),fQ.buttonExport.addEventListener("click",()=>(function(){fQ.modal.innerHTML="";let e=document.createElement("h2");e.innerText="Compressed string",fQ.modal.appendChild(e);let t=document.createElement("textarea");t.value=encodeURIComponent(fB.crush(JSON.stringify({wls:fF.state.doc.toString(),js:fL.state.doc.toString(),includes:fz,compiled:o}))),fQ.modal.appendChild(t);let i=o=>{o.target!==fQ.modal&&o.target!==t&&o.target!==e&&(fQ.modal.classList.add("hidden"),fQ.modal.innerHTML="",window.removeEventListener("click",i))};setTimeout(()=>window.addEventListener("click",i),300),fQ.modal.classList.remove("hidden")})()),fQ.buttonSave.addEventListener("click",()=>void localStorage.setItem("wljs-state",JSON.stringify({wls:fF.state.doc.toString(),js:fL.state.doc.toString(),includes:fz,compiled:o}))),function(){let e=localStorage.getItem("wljs-state");if(e){let t=JSON.parse(e);fY(t)}else f_("./simple.txt")}();
//# sourceMappingURL=index.af1ba431.js.map