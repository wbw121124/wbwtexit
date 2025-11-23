# wbwTexit

wbwTexit 是一个轻量的类 LaTeX 文本排版解析器，旨在将简单的 TeX/LaTeX 风格命令转换为 HTML，用于浏览器或 Node.js 环境。

## 功能亮点

- 支持基本文本格式化：`\textbf{}`、`\textit{}`、`\underline{}`、`\sout{}`、`\texttt{}`。
- 支持列表环境：`\itemize`、`\enumerate` 与 `\item`。
- 支持分节：`\section{}`、`\subsection{}`。
- 支持链接与图片：`\href[url]{text}`、`\includegraphics[width=...]{src}`。
- 支持数学渲染：`\math{...}`（使用 `katex` 渲染）。
- 支持运行时注册自定义命令：`registerFunction(name, func, escape, noargs, force, functions)`。

## 安装

仓库已经包含 `package.json`，项目依赖中包含 `katex`：

```cmd
npm install
```

（如果你只是运行测试，已有的依赖应足够。）

## 快速开始（Node）

示例：在项目根执行：

```cmd
node test\test.js
```

测试脚本会载入 `src/index.js` 并运行若干断言，示例用法：

```js
const { wbwTexit } = require('./dist/index.cjs'); // 或直接 import 源码
const t = new wbwTexit();
const html = t.parse('\\textbf{Hello} and \\math{1+1}');
console.log(html);
```

## 用法说明

- 命令语法：`\\name[opt1,opt2]{content}`。可选参数用中括号，多个用逗号分隔；必选参数用花括号包裹。
- 嵌套命令会被递归解析。
- `registerFunction` 可以注册或覆盖函数。示例：

```js
t.registerFunction('shout', (args1, args2) => args2.toUpperCase(), true, false, false, t.functions);
console.log(t.parse('\\shout{hello}')); // HELLO
```

## 注意事项

- `katex` 渲染需要在 Node 环境或浏览器中正确加载样式（若在浏览器中使用，请引入 KaTeX CSS）。
- 当前实现面向轻量用途，并非完整 LaTeX 兼容实现。

## 贡献

欢迎提交 issue 与 PR。请在 PR 中附带可重复的测试用例。 

---

作者：wbw121124
