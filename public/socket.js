
const wsconnected = new Event("wsconnected");

var socket = new WebSocket("ws://"+window.location.hostname+':'+window.location.port);
socket.onopen = function(e) {
  console.log("[open] connecting established");
  server.init(socket);
  window.dispatchEvent(wsconnected);

  server.init(socket);
}; 

socket.onmessage = function(event) {
  //create global context
  //callid
  const uid = Date.now() + Math.floor(Math.random() * 100);
  var global = {call: uid};

  interpretate(JSON.parse(event.data), {global: global});
};

socket.onclose = function(event) {
  console.log(event);
  //alert('Connection lost. Please, update the page to see new changes.');
};