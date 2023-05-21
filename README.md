# Minimal Wolfram Language Interpreter (WLJS) 
*written with love in Javascript*

***Early Development Stage!***

__This is a core component of [Wolfram JS Frontend](https://github.com/JerryI/wolfram-js-frontend) project__
but one can use it independently as well



## Please, see [Docs](docs/Introduction.md)
---

It includes two parts
- `interpeter.js` - a set of functions, that executes the commands and maintain binding between variables
- `core.js` - core library (support for `List`, `Rule` and etc...)

## Examples
You need to have only `wolframscript` and any modern browser installed 
> Wolfram Kernel only runs HTTP server and provides the convertation from WL language syntax to JSON representation, since there is no freeware WL parser on the internet so far. All computations happends inside your browser
```bash
cd wljs-interpreter
wolframscript -f serve.wls
```

*This is not meant for heavy computations, but rather for interpreting the results produced by Wolfram Engine / Mathematica in your browser or making standalone notebooks*

*Symbolic computing is not possible*

## Extensions
This repository provides only the minimum-necessary set of functions, to bring `Graphics` and `Graphics3D` (or if you are using [Wolfram JS Frontend](https://github.com/JerryI/wolfram-js-frontend) you need set of sliders and other building blocks for GUI) you should consider to use it together with the following packages

- [wljs-graphics-d3](https://github.com/JerryI/wljs-graphics-d3)
- [wljs-graphics3d-threejs](https://github.com/JerryI/Mathematica-ThreeJS-graphics-engine)
- [wljs-inputs](https://github.com/JerryI/wljs-inputs)

Just simply include `dist/kernel.js` file into the web-page as a module using CDN (JSDelivr, StaticIO). Some of [build-in examples]((#examples)) already uses those packages. NO installation needed.

## Partially supported native WL expressions
There is no aim to recreate all Wolfram Language functions, you can think about this interpreter more like as a bridge between `Javascript` ecosystem and `Wolfram Language`. The interpreter can easily be expanded via packages or explicitly defined functions inside the HTML page. One can write your own symbols based on the application you have.

- `Association`
- `CompoundExpression`
- `Cos`
- `Evaluate`
- `Length`
- `List`
- `N`
- `Part`
- `Pause`
- `Plus`
- `Power`
- `Print`
- `RandomSample`
- `Rational`
- `Rule`
- `Set`
- `Sin`
- `Table`
- `Times`
- `True`
- `Tuples`
- `While`

and many more functions, which are more specific to work __together with JS, DOM and dynamic expressions__. Please, see [Docs](docs/Introduction.md) for more information as well as [Wolfram Language JS Frontend](https://github.com/JerryI/wolfram-js-frontend) page.

__To help maintain this project [kirill.vasin@uni-a.de](https://www.paypal.com/donate/?hosted_button_id=BN9LWUUUJGW54) [PayPal](https://www.paypal.com/donate/?hosted_button_id=BN9LWUUUJGW54) Thank you 🍺__

## License

Project is released under the GNU General Public License (GPL).