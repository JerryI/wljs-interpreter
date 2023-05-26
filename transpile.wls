#!/usr/bin/env wolframscript

Import["https://raw.githubusercontent.com/JerryI/tinyweb-mathematica/master/Tinyweb/Tinyweb.wl"];
server = WEBServer["addr" -> "127.0.0.1:8099", "path" -> "/", "socket-close" -> True];
server // WEBServerStart;
transpile[c_] := WebSocketSend[Global`client, ToExpression[c, InputForm, Hold]];

While[True, Pause[1]];