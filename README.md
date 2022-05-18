# Webpack

## Getting started
There are problems with managing JavaScript projects without Webpack:

-   It is not immediately apparent that the script depends on an external library.
-   If a dependency is missing, or included in the wrong order, the application will not function properly.
-   If a dependency is included but not used, the browser will be forced to download unnecessary code.

The [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) statements have been standardized in [ES2015](https://babeljs.io/docs/en/learn/). They are supported in most of the browsers at this moment, however there are some browsers that don't recognize the new syntax. But don't worry, webpack does support them out of the box.

Note that webpack will not alter any code other than `import` and `export` statements. **Warning!** If you are using other [ES2015 features](http://es6-features.org/), make sure to [use a transpiler](https://webpack.js.org/loaders/#transpiling) such as [Babel](https://babeljs.io/) via webpack's [loader system](https://webpack.js.org/concepts/loaders/).

## Asset Management

Module loaders can be chained. Each loader in the chain applies transformations to the processed resource. A chain is executed in **reverse** order. The first loader passes its result (resource with applied transformations) to the next one, and so forth. Finally, webpack expects JavaScript to be returned by the last loader in the chain.

**Warning!** In case of `["styled-loader", "css-loader"]` , CSS will be insterted in `<head>` of your html file, not as a separate CSS file.

Use`asset-resource` to transform files into URL.

## Code Splitting

Although using multiple entry points per page is allowed in webpack, it should be avoided when possible in favor of a single entry point with multiple imports: `entry: { page: ['./analytics', './app'] }`. This results in a better optimization and consistent execution order when using `async` script tags.

The [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/) allows us to extract common dependencies into an existing entry chunk or an entirely new (vendor) chunk. With the [`optimization.splitChunks`](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks) configuration option in place, we should now see the duplicate dependency removed from every entry.

## Caching

Adding `[contenthash]` to a bundle won't make any sence until the runtime and vendor chunks are separated, because they change their `moduleIds` regularly. You also need to set `moduleIds: "deterministic"`.

## Build Perfomance

**General**:
1. Stay up to date (webpack, npm, node.js);
2. Loaders (apply loaders to the minimal number of modules necessary, use `include`);
3. Bootstrap (each additional loader/plugin has a bootup time);
4. Resolving:
-   Minimize the number of items in  `resolve.modules`,  `resolve.extensions`,  `resolve.mainFiles`,  `resolve.descriptionFiles`, as they increase the number of filesystem calls.
-   Set  `resolve.symlinks: false`  if you don't use symlinks (e.g.  `npm link`  or  `yarn link`).
-   Set  `resolve.cacheWithContext: false`  if you use custom resolving plugins, that are not context specific.
5. Smaller = Faster (try to keep chunks small);
6. Worker Pool (check `thread-loader`);
7. Persistent cache (use `cache` option in webpack config, clear cache directory on `postinstall`);
8. TypeScript Loader (use `transpileOnly: true` and `ForkTsCheckerWebpackPlugin` for type checking in parallel)

**Development**:
9. Compoile in Memory;
10. Devtool (use `evanl-cheap-module-source-map`);
11. Avoid Production Specific Tooling (`TerserPlugin`, `[fullhash]/[chunkhash]/[contenthash], AggressiveSplittingPlugin, AggressiveMerginPlugin, ModuleConcatenationPlugin`);
12.   Avoid Extra Optimization Steps
```
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
```
13. Output Without Path Info (this puts garbage collection pressure on projects that bundle thousands of modules)
```
output: {
	pathinfo: false
}
```

**Production**:
14. Minimize Amount Of Babel Presets And Plugins
15. Turn Off Source Maps

## Tree Shaking

A "side effect" is defined as code that performs a special behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.

To make Webpack clear unused code, we should add...
```
// package.json
sideEffects: false
```
...to inform Webpack that it can safely prune unused exports.

Note that any imported file is subject to tree shaking. This means if you use something like `css-loader` in your project and import a CSS file, it needs to be added to the side effect list so it will not be unintentionally dropped in production mode:
```
// index.js
import global.css
// package.json
 "sideEffects": ["*.css"]
```

In order to take advantage of  _tree shaking_, you must...

-   Use ES2015 module syntax (i.e.  `import`  and  `export`).
-   Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of the popular Babel preset `@babel/preset-env` - see the  [documentation](https://babeljs.io/docs/en/babel-preset-env#modules)  for more details).
-   Add a  `"sideEffects"`  property to your project's  `package.json`  file.
-   Use the  [`production`](https://webpack.js.org/configuration/mode/#mode-production)  `mode`  configuration option to enable  [various optimizations](https://webpack.js.org/configuration/mode/#usage)  including minification and tree shaking.

You can imagine your application as a tree. The source code and libraries you actually use represent the green, living leaves of the tree. Dead code represents the brown, dead leaves of the tree that are consumed by autumn. In order to get rid of the dead leaves, you have to shake the tree, causing them to fall.

## Production

In _development_, we want strong source mapping and a localhost server with live reloading or hot module replacement. In _production_, our goals shift to a focus on minified bundles, lighter weight source maps, and optimized assets to improve load time. With this logical separation at hand, we typically recommend writing **separate webpack configurations** for each environment.

Many libraries will key off the `process.env.NODE_ENV` variable to determine what should be included in the library. For example, when `process.env.NODE_ENV` is not set to `'production'` some libraries may add additional logging and testing to make debugging easier. However, with `process.env.NODE_ENV` set to `'production'` they might drop or add significant portions of code to optimize how things run for your actual users.

Technically, `NODE_ENV` is a system environment variable that Node.js exposes into running scripts. It is used by convention to determine dev-vs-prod behavior by server tools, build scripts, and client-side libraries. Contrary to expectations, `process.env.NODE_ENV` is not set to `'production'`  **within** the build script `webpack.config.js`, see [#2537](https://github.com/webpack/webpack/issues/2537). Thus, conditionals like `process.env.NODE_ENV === 'production' ? '[name].[contenthash].bundle.js' : '[name].bundle.js'` within webpack configurations do not work as expected.

Most code minification is done by setting bundle mode by production mode. It enables `Terser Plugin`.

## Lazy Loading

Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially involves splitting your code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code. This speeds up the initial load of the application and lightens its overall weight as some blocks may never even be loaded.

```
// print.js
export default () => console.log('lazy loaded');

// index.js
...
button.onclick = (event) => {
	import(/* webpackChunkName: 'print' */ './print')
		.then((module) => {
			const print = module.default;
			print();
		})
};
```

## ECMAScript Modules

Node.js established a way of explicitly setting the module type of files by using a property in the `package.json`. Setting `"type": "module"` in a package.json does force **ALL FILES** below this package.json to be ECMAScript Modules. Setting `"type": "commonjs"` will instead force them to be CommonJS Modules.

In addition to that, files can explicitly set the module type by using `.mjs` or `.cjs` extension. `.mjs` will force them to be ESM, `.cjs` force them to be CommonJs.

**By default webpack will automatically detect whether A FILE is an ESM or a different module system.**

## Typescript

`ts-loader`  uses  `tsc`, the TypeScript compiler, and relies on your  `tsconfig.json`  configuration. Make sure to avoid setting  [`module`](https://www.typescriptlang.org/tsconfig#module)  to "CommonJS", or webpack won't be able to  [tree-shake your code](https://webpack.js.org/guides/tree-shaking).

Note that if you're already using  [`babel-loader`](https://github.com/babel/babel-loader)  to transpile your code, you can use  [`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript)  and let Babel handle both your JavaScript and TypeScript files instead of using an additional loader. Keep in mind that, contrary to  `ts-loader`, the underlying  [`@babel/plugin-transform-typescript`](https://babeljs.io/docs/en/babel-plugin-transform-typescript)  plugin does not perform any type checking. (look for `ForkTsCheckerWebpackPlugin`).

To make imports keep `import _ from 'lodash';` syntax in TypeScript, set `"allowSyntheticDefaultImports" : true` and `"esModuleInterop" : true` in your **tsconfig.json** file.

**Warning!** To use non-code assets with TypeScript, we need to defer the type for these imports. This requires a  `custom.d.ts`(or any other name)  file which signifies custom definitions for TypeScript in our project. Let's set up a declaration for  `.svg`  files:

**custom.d.ts**

```
declare module '*.svg' {
  const content: any;
  export default content;
}
```

Here we declare a new module for SVGs by specifying any import that ends in  `.svg`  and defining the module's  `content`  as  `any`. We could be more explicit about it being a URL by defining the type as string. The same concept applies to other assets including CSS, SCSS, JSON and more.

## Public Path

The [`publicPath`](https://webpack.js.org/configuration/output/#outputpublicpath) configuration option can be quite useful in a variety of scenarios. It allows you to specify **the base path for all the assets within your application**.

There are a few use cases in real applications where this feature becomes especially neat. Essentially, every file emitted to your `output.path` directory will be referenced from the `output.publicPath` location. This includes child chunks (created via [code splitting](https://webpack.js.org/guides/code-splitting/)) and any other assets (e.g. images, fonts, etc.) that are a part of your dependency graph.

