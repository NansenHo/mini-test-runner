# Mini Test Runner

This is a mini test runner for learning test.

## :hammer_and_wrench: Quickstart

```bash
# clone this project
git clone https://github.com/NansenHo/mini-test-runner.git
cd mini-test-runner

# install packages
pnpm install

# run all tests
pnpm run test-all
```

## :pushpin: Tasks

- [x] `test`
- [x] `it`
- [x] `run`
- [x] `test.only`
- [x] `expect.toBe`
- [ ] `expect.toEqual`
- [x] `beforeAll`
- [x] `beforeEach`
- [x] `afterAll`
- [x] `afterEach`
- [x] `describe` 只实现一层
- [x] `自动执行所有符合命名规范 "*.spec.js" 测试脚本`
  - [x] 获取到所有测试脚本
  - [x] 执行所有脚本
- [x] `自动执行 run()`

## :memo: Notes

### 读取文件和文件内容

#### 拿到所有命名为 `*.spec.js` 的文件

1. 安装 [glob](https://github.com/isaacs/node-glob)

   > glob 是一个用于匹配文件路径模式的 Node.js 库。
   >
   > glob 使用类似于 Unix shell 中的 **"globbing"** 机制（文件名通配机制），为开发者提供了一个简单的方式来查找符合特定模式的所有文件。
   >
   > glob 提供了同步和异步方法，使其在各种场景下都非常实用。
   >
   > 在构建工具、测试框架以及其他需要文件查找功能的工具中，这个库经常被使用。

   ```bash
   pnpm i glob
   ```

2. 引入 glob 并拿到所有 `*.spec.js` 文件

   ```js
   import { glob } from "glob";

   const files = glob.sync("**/*.spec.js");
   console.log(files);
   // [ first.spec.js second.spec.js ]
   ```

   - `**` 会匹配任何数量的目录或子目录。
   - `*.spec.js` 会匹配任何以 `.spec.js` 结尾的文件。

#### 读取文件内容

我们使用 Node.js 的 `fs/promises` 模块。

##### `fs` 模块

`fs` 是 Node.js 的核心模块。

`fs` 模块的大多数方法都有异步和同步两个版本。

异步方法的最后一个参数总是一个回调函数，回调函数的第一个参数是一个可能出现的错误对象。
例如，`fs.readFile()` 是用于异步读取文件的方法。

`fs` 模块也提供了同步版本的方法，这些方法的名称通常以 `Sync` 结尾。
例如 `fs.readFileSync()`。

##### `fs/promises` 模块

在 Node.js 的 `v10.0.0` 中，为 `fs` 模块引入了 `fs/promises` 子模块。

`fs/promises` 子模块提供了基于 Promise 的文件系统操作。

开发者可以使用原生的 JavaScript Promises 来处理文件系统操作，而不再需要回调或使用第三方库来实现 Promise 化。

使用 `fs/promises`，我们可以使用 `async`/`await` 语法来处理文件系统的异步操作，从而使代码更加简洁和直观。

```js
import fs from "fs/promises";

const fileContent = await fs.readFile("first.spec.js", "utf-8");
console.log(fileContent);
```

尽管 `fs` 模块仍然是 Node.js 中进行文件操作的主要方式，但 `fs/promises` 提供了一个更现代、更简洁的方法，特别是在处理大量异步操作时。

### 打包

当我们读取了测试文件内容，直接放到函数 `new Function(fileContent)()` 里执行时，发现报错了。

原因是 `import` 语句无法在函数体内被执行。

所以我们需要将 `test`, `describe`, `expect`... 所有 `import` 过的函数，和测试代码打包到一起。

这样就不需要 `import` 操作了。

#### esbuild 的优势

1. esbuild 使用 Go 编写，利用并行计算和原生代码的优势，实现了非常高的构建速度。比 Rollup, Webpack 快几个数量级。

2. esbuild 不仅仅是一个转译器，它也是一个打包器，可以将多个文件和模块打包成一个或多个输出文件。

3. esbuild 提供了一个简明直接的 API，方便集成到各种工作流和工具中。

4. esbuild 提供了一个插件系统，允许开发者扩展其功能。

5. esbuild 支持 tree shaking，这有助于删除未使用的代码，从而优化输出文件的大小。

6. esbuild 支持代码分割和利用 ECMAScript 的动态 `import()` 语法进行延迟加载。

7. esbuild 内置 CSS 和图像支持，可以直接导入 CSS、图像和其他资产，而无需额外的加载器或插件。

#### 具体步骤

1. 安装 [esbuild](https://esbuild.github.io/)

   ```bash
   pnpm i esbuild
   ```

2. 导入 esbuild 里的 `build` 方法

   `build` 方法是一个 `promise`。我们可以传入打包的配置。

   ```js
   import { build } from "esbuild";
   ```

3. 封装一个自己的 build 方法

   ```js
   async function runModule(fileContent) {
     const result = await build({
       stdin: {
         contents: fileContent,
         resolveDir: path.join(process.cwd(), "tests"),
       },
       write: false, // 是否将结果写入磁盘，而不是直接返回
       bundle: true, // 是否将所有输入文件打包成一个输出文件。
       target: "esnext",
     });
     // console.log(result);

     const builtCode = result.outputFiles[0].text;
     // console.log(builtCode);

     new Function(builtCode)();
   }
   ```

   `write` 配置项默认为 `true`，esbuild 会将构建结果写入磁盘（例如，到 `outDir` 或 `outfile` 指定的位置）。

   如果为 `false`，则不会写入磁盘，而是将结果返回到 JavaScript API 的调用者。

   这对于那些想要进一步处理构建输出或只是在内存中使用它的场景（例如某些开发服务器）非常有用。
