sail = With[{a = 0.4},
 Partition[
  Partition[
   Table[
     Part[
      Partition[
       Table[{((x + a i)^2 + (y + a j)^2)/3, x + a i, 
          y + a j}, {i, -0.5, 0.5}, {j, -0.5, 0.5}] // Flatten, 
       3], {1, 2, 4, 3}], {x, - a, a, a/3}, {y, -a, a, a/3}] // 
    Flatten, 3], 4]
];

vertices = {{0, -1/2, 1/Sqrt[2]}, {1/2, 0, 0}, {5/6, 
    0, (2*Sqrt[2])/3}, {0, 1/2, 1/Sqrt[2]}, {-5/6, 
    0, (2*Sqrt[2])/3}, {-1/2, 0, 0}};
faces = {{1, 2, 3}, {3, 2, 4}, {1, 3, 4}, {4, 5, 1}, {1, 5, 6}, {1, 6,
     2}, {4, 2, 6}, {4, 6, 5}};

mat = With[{s = 3.14/2},
  {{Cos[s], -Sin[s], 0}, {Sin[s], Cos[s], 
  0}, {0, 0, 1}}
];

pos = {-1,0,-0.2};
vel = {-1,0,0};

FrontEndVirtual[{
  AttachDOM["dom-canvas"],
  Graphics3D[
    {SkyAndWater[], Translate[
    GeometricTransformation[{White, Translate[Polygon /@ sail, {-0.15, 0, 1.5}], 
      LightBlue,  GraphicsComplex[vertices, Polygon[faces]],
      Brown, Cylinder[{{0, 0, 1/Sqrt[2]}, {0, 0, 3/Sqrt[2]}}, 0.03]
    }, mat]
    , pos]}
  , "Lerp"->True, "Lighting"->"None", "Background"->"None"];
}];



While[True,
  Pause[0.2];
  pos = pos + vel;

  vel = Normalize[vel + 0.1 Cross[vel, {0,0,1}]];
]


















