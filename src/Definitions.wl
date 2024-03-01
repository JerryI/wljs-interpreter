BeginPackage["Notebook`Interpreter`"]

Alert::usage = "Alert[s_String] shows a modal alert window on browser's window [Web Only]"
Offload::usage = "Offload[_] to keep it from evaluation on Kernel"

AttachDOM::usage = "AttachDOM[id_String] attach DOM with a given Id to the container (if evaluated from inside) [Web Only]"
WindowScope::usage = "WindowScope[name_String] gets Javascript object from the global scope [Web Only]"
Static::usage = "Static[expr_] prevents dynamic updates of a symbol [Web Only]"

EndPackage[]