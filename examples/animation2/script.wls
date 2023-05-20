ClearDOM["canvas"];

point = RandomReal[{-1,1}, {2,2}]//Unsafe;
(* to be able to animate we need a container *)
FrontEndVirtual[{
	(* attach a dom element to draw *)
    AttachDOM["canvas"],
    
    (* our graphics *)
    Graphics[{PointSize[0.1], Point[point]}, "TransitionDuration"->1000]
}];

Pause[1];
(* animate the points *)
point = RandomReal[{-1,1}, {5,2}]//Unsafe;