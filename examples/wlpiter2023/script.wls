logo    = WindowScope["logo"];
piter   = WindowScope["piter"];
colors  = RandomSample[WindowScope["colors"]];

FrontEndVirtual[{
    AttachDOM["dom-canvas"];
    Graphics[Table[{colors[[i]]//Evaluate, Line[logo[[i]]]}, {i, 1, Length[logo]}], "TransitionDuration"->1000, "PlotRange"->{{2.14718, 1897.8}, {-1235.18, -14.849}}]
}];

While[True,
    Pause[2];
    FlipSymbols[logo, piter, RandomSample];
];