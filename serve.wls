#!/usr/bin/env wolframscript

Import["https://raw.githubusercontent.com/JerryI/tinyweb-mathematica/master/Tinyweb/Tinyweb.wl"];
Import["https://raw.githubusercontent.com/JerryI/tinyweb-mathematica/master/WSP/WSP.wl"];

server = WEBServer["addr" -> "127.0.0.1:4949", "path" -> {"public", "src"}, "socket-close" -> True];
server // WEBServerStart;

WSPCache["Off"];

StringTemplate["open http://``/ in your browser"][server["addr"]]//Print;

runCode[c_] := WebSocketSend[Global`client, ToExpression[c, InputForm, Hold]];

While[True, Pause[1]];