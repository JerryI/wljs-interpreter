colors = ColorData[3, "ColorList"]//HoldFirstLevel//Unsafe;
point = RandomReal[{-1,1}, {5,2}]//Unsafe;
(* to be able to animate we need a container *)
FrontEndVirtual[{
	(* attach a dom element to draw *)
    AttachDOM["dom-canvas"],
    
    (* our graphics *)
    Graphics[{PointSize[0.1], Table[{colors[[i]]//Evaluate, Point[point[[i]]]}, {i,1,5}]}, "TransitionDuration"->500]
}];

While[True,
	Pause[0.5];
	(* animate the points *)
	point = RandomSample[point];
];