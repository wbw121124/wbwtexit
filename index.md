# wbwTexit

wbwTexit 是一个轻量的类 LaTeX 文本排版解析器，目标是在浏览器或 Node.js 环境中将简单的 TeX/LaTeX 风格命令转换为 HTML。它支持基本的文本格式化（如加粗、斜体、下划线）、列表、段落与自定义命令注册，并通过 `katex` 支持数学公式渲染。

## 特性
- 支持常用命令：`\\textbf{}`、`\\textit{}`、`\\underline{}` 等。
- 支持列表：`\\itemize` / `\\enumerate` 与 `\\item`。
- 支持分节命令：`\\section{}`、`\\subsection{}`。
- 支持链接与图片：`\\href[url]{text}`、`\\includegraphics[width=...]{src}`。
- 支持数学渲染：`\\math{...}`（基于 `katex`）。
- 可通过 `registerFunction` 注册自定义命令。

## 设计说明
- 解析器以反斜线 `\\` 开始的命令为单位，命令名后可接可选参数 `[...]` 与必选花括号参数 `{...}`。
- 命令可以嵌套，解析器会在内部递归调用 `parse` 来处理嵌套内容。
- 命令的行为由 `this.functions` 表驱动，可以在运行时注册或覆盖命令。

更多实现细节请参考 `src/index.js`。

