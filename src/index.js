const Packages = {};
class wbwTexit {
	constructor() {
		this.functions = {};
		this.functions["usepackage"] = {
			func: (args1, args2, f) => {
				for (let pkg of args1) {
					if (Packages.hasOwnProperty(pkg)) {
						f = this.registerFunction(pkg, Packages[pkg].func,
							Packages[pkg].escape, Packages[pkg].noargs, true, f);
					}
				}
				return {
					pgk: f,
					rtn: ""
				};
			},
			escape: false,
			const: true,
			noargs: false
		}
		// 转义括号、反斜杠等特殊字符
		for (let char of ['{', '}', '[', ']', '\\', ',', ' ']) {
			this.functions[char] = {
				func: (args1, args2, dontneed = null) => {
					return {
						pk: dontneed,
						rtn: char,
					};
				},
				escape: false,
				const: true,
				noargs: true
			}
		}
		// 换行（newline）
		this.functions["newline"] = {
			func: (args1, args2, dontneed = null) => {
				return '<br>';
			},
			escape: false,
			const: true,
			noargs: true
		};
		// 任意长度空格（hspace）
		this.functions["hspace"] = {
			func: (args1, args2, dontneed = null) => {
				return `<span style='with:${args2} !important'></span>`;
			},
			escape: false,
			const: true,
			noargs: false
		};
		// 加粗（bold）
		this.functions["textbf"] = {
			func: (args1, args2, f = null) => {
				return `<strong>${this.parse(args2, f)}</strong>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 斜体（italic）
		this.functions["textit"] = {
			func: (args1, args2, f = null) => {
				return `<em>${this.parse(args2, f)}</em>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 下划线（underline）
		this.functions["underline"] = {
			func: (args1, args2, f = null) => {
				return `<u>${this.parse(args2, f)}</u>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 删除线（sout）
		this.functions["sout"] = {
			func: (args1, args2, f = null) => {
				return `<s>${this.parse(args2, f)}</s>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 行内代码（texttt）
		this.functions["texttt"] = {
			func: (args1, args2, f = null) => {
				return `<code>${this.parse(args2, f)}</code>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 无序列表（itemize）
		this.functions["itemize"] = {
			func: (args1, args2, f = null) => {
				return `<ul>${this.parse(args2, f)}</ul>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 有序列表（enumerate）
		this.functions["enumerate"] = {
			func: (args1, args2, f = null) => {
				return `<ol>${this.parse(args2, f)}</ol>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
		// 列表项（item）
		this.functions["item"] = {
			func: (args1, args2, f = null) => {
				return `<li>${this.parse(args2, f)}</li>`;
			},
			escape: true,
			const: true,
			noargs: false
		};
	}
	// 注册一个函数
	registerFunction(name, func, escape = false, noargs = false, force = false, functions = this.functions) {
		if ((!force && functions[name]) || typeof func !== "function" ||
			(functions[name] && functions[name].const)) {
			throw new Error(`Function ${name} is already registered or is not a function.`);
		}
		functions[name] = {
			func: func,
			escape: escape,
			noargs: noargs
		};
	}
	// 转义成HTML实体
	escapeHTML(str) {
		return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
	}
	// 反斜杠转义
	escapeString(str) {
		return str.replace(/\\\\/g, "\\");
	}
	// 解析一个函数
	parseFunction(name, args1, args2, registeredFunctions = this.functions) {
		if (!this.functions[name]) {
			throw new Error(`Function ${name} is not registered.`);
		}
		return this.functions[name].func(args1, (
			this.functions[name].escape ? this.escapeString(args2) : args2), registeredFunctions);
	}
	// 解析函数
	parse(wbwTexitString, registeredFunctions = this.functions) {
		let HTML = '';
		let iter = 0;
		const length = wbwTexitString.length;
		while (iter < length) {
			if (wbwTexitString[iter] === '\\') {
				let funcName = '';
				iter++;
				let f = true;
				while (iter < length && (/[a-zA-Z]/.test(wbwTexitString[iter]) || f)) {
					funcName += wbwTexitString[iter];
					if (!(/[a-zA-Z]/.test(wbwTexitString[iter]))) {
						iter++;
						break;
					}
					iter++;
					f = false;
				}
				let args1 = [];
				let args2 = '';
				if (registeredFunctions[funcName]) {
					if (!registeredFunctions[funcName].noargs) {
						// 解析第一个参数组
						while (iter < length && wbwTexitString[iter] === ' ') {
							iter++;
						}
						if (iter < length && wbwTexitString[iter] === '[') {
							iter++;
							let escape = false, arg = '';
							while (iter < length && (wbwTexitString[iter] !== ']' || escape)) {
								if (wbwTexitString[iter] === '\\' && !escape) {
									escape = true;
								} else if (wbwTexitString[iter] === ',' && !escape) {
									args1.push(arg.trim());
									arg = '';
								} else {
									arg += wbwTexitString[iter];
									escape = false;
								}
								iter++;
							}
							if (arg.length > 0)
								args1.push(arg.trim());
							iter++;
						}
						// 解析第二个参数
						if (iter < length && wbwTexitString[iter] === '{') {
							iter++;
							let escape = false, f = registeredFunctions[funcName].escape, bracketCount = 1;
							while (iter < length && (bracketCount > 0)) {
								if (wbwTexitString[iter] === '\\' && !escape) {
									escape = true;
								} else {
									if (wbwTexitString[iter] === '{' && !escape) {
										bracketCount++;
									} else if (wbwTexitString[iter] === '}' && !escape) {
										bracketCount--;
									}
									if (bracketCount > 0) {
										if (!f && escape)
											args2 += '\\';
										args2 += wbwTexitString[iter];
									}
									escape = false;
								}
								iter++;
							}
							if (bracketCount !== 0) {
								throw new Error(`Mismatched braces in function ${funcName}.`);
							}
							if (escape && !f) {
								args2 += '\\';
							}
						}
					}
					HTML += this.parseFunction(funcName, args1, args2, registeredFunctions);
				}
				else {
					throw new Error(`Function ${funcName} is not registered.`);
				}
			}
			else {
				HTML += this.escapeHTML(wbwTexitString[iter]);
				iter++;
			}
		}
		return HTML;
	}
};

export { wbwTexit };