ClearDOM["canvas"];

CreateFrontEndObject[{{0,0},{1,1}}, "point"];
(* to be able to animate we need a container *)
FrontEndVirtual[{
	(* attach a dom element to draw *)
    AttachDOM["canvas"],
    
    (* our graphics *)
    Graphics[{PointSize[0.1], Point[FrontEndRef["point"]]}, "TransitionDuration"->1000]
}];

Pause[1];
(* animate the points *)
SetFrontEndObject["point", {{-1,0},{1,0}}];