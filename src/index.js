import katex from 'katex';

const Packages = {
	copytex: {
		func: (args1, args2, f = null) => {
			return `<script>!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}("undefined"!=typeof self?self:this,(function(){return function(){"use strict";var e={};const t={inline:["$","$"],display:["$$","$$"]};var n=function(e,n){void 0===n&&(n=t);const o=e.querySelectorAll(".katex-mathml + .katex-html");for(let e=0;e<o.length;e++){const t=o[e];t.remove?t.remove():t.parentNode&&t.parentNode.removeChild(t)}const r=e.querySelectorAll(".katex-mathml");for(let e=0;e<r.length;e++){const t=r[e],o=t.querySelector("annotation");o&&(t.replaceWith?t.replaceWith(o):t.parentNode&&t.parentNode.replaceChild(o,t),o.innerHTML=n.inline[0]+o.innerHTML+n.inline[1])}const l=e.querySelectorAll(".katex-display annotation");for(let e=0;e<l.length;e++){const t=l[e];t.innerHTML=n.display[0]+t.innerHTML.substr(n.inline[0].length,t.innerHTML.length-n.inline[0].length-n.inline[1].length)+n.display[1]}return e};function o(e){const t=e instanceof Element?e:e.parentElement;return t&&t.closest(".katex")}return document.addEventListener("copy",(function(e){const t=window.getSelection();if(t.isCollapsed||!e.clipboardData)return;const r=e.clipboardData,l=t.getRangeAt(0),i=o(l.startContainer);i&&l.setStartBefore(i);const a=o(l.endContainer);a&&l.setEndAfter(a);const s=l.cloneContents();if(!s.querySelector(".katex-mathml"))return;const c=Array.prototype.map.call(s.childNodes,(e=>e instanceof Text?e.textContent:e.outerHTML)).join("");r.setData("text/html",c),r.setData("text/plain",n(s).textContent),e.preventDefault()})),e=e.default}()}));</script>`;
		},
		escape: true, noargs: true
	}
};

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
				return { pkg: f, rtn: "" };
			},
			escape: false, const: true, noargs: false
		}

		for (let char of ['{', '}', '[', ']', '\\', ',', ' ']) {
			this.functions[char] = {
				func: (args1, args2, dontneed = null) => {
					return { pkg: dontneed, rtn: char };
				},
				escape: false, const: true, noargs: true
			}
		}

		this.functions["text"] = {
			func: (args1, args2, dontneed = null) => {
				return this.escapeHTML(args2);
			},
			escape: false, const: true, noargs: false
		};

		this.functions["space"] = {
			func: (args1, args2, dontneed = null) => { return ' '; },
			escape: false, const: true, noargs: true
		};

		this.functions["p"] = {
			func: (args1, args2, f = null) => {
				return `<p>${this.parseToHTML(args2, f)}</p>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["newline"] = {
			func: (args1, args2, dontneed = null) => { return '<br>'; },
			escape: false, const: true, noargs: true
		};

		this.functions["hspace"] = {
			func: (args1, args2, dontneed = null) => {
				return `<span style='with:${args2} !important'></span>`;
			},
			escape: false, const: true, noargs: false
		};

		this.functions["textbf"] = {
			func: (args1, args2, f = null) => {
				return `<strong>${this.parseToHTML(args2, f)}</strong>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["textit"] = {
			func: (args1, args2, f = null) => {
				return `<em>${this.parseToHTML(args2, f)}</em>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["underline"] = {
			func: (args1, args2, f = null) => {
				return `<u>${this.parseToHTML(args2, f)}</u>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["sout"] = {
			func: (args1, args2, f = null) => {
				return `<s>${this.parseToHTML(args2, f)}</s>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["texttt"] = {
			func: (args1, args2, f = null) => {
				return `<code>${this.parseToHTML(args2, f)}</code>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["itemize"] = {
			func: (args1, args2, f = null) => {
				return `<ul>${this.parseToHTML(args2, f)}</ul>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["enumerate"] = {
			func: (args1, args2, f = null) => {
				return `<ol>${this.parseToHTML(args2, f)}</ol>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["item"] = {
			func: (args1, args2, f = null) => {
				return `<li>${this.parseToHTML(args2, f)}</li>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["h1"] = {
			func: (args1, args2, f = null) => {
				return `<h1>${this.parseToHTML(args2, f)}</h1>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["section"] = {
			func: (args1, args2, f = null) => {
				return `<h2>${this.parseToHTML(args2, f)}</h2>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["subsection"] = {
			func: (args1, args2, f = null) => {
				return `<h3>${this.parseToHTML(args2, f)}</h3>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["small"] = {
			func: (args1, args2, f = null) => {
				return `<small>${this.parseToHTML(args2, f)}</small>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["href"] = {
			func: (args1, args2, f = null) => {
				const url = (args1 && args1.length > 0) ? args1[0] : '#';
				const text = this.parseToHTML(args2, f);
				return `<a href="${this.escapeHTML(url)}">${text}</a>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["includegraphics"] = {
			func: (args1, args2, f = null) => {
				let style = '';
				if (args1 && args1.length > 0) {
					for (const opt of args1) {
						const parts = opt.split('=');
						if (parts[0].trim() === 'width' && parts[1]) {
							style += `width:${parts[1].trim()};`;
						}
					}
				}
				const src = this.escapeHTML(args2.trim());
				return `<img src="${src}" style="${style}"/>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["math"] = {
			func: (args1, args2, f = null) => {
				try {
					return katex.renderToString(args2 || '', { throwOnError: false });
				} catch (e) {
					return this.escapeHTML(args2 || '');
				}
			},
			escape: true, const: true, noargs: false
		};

		this.functions["displaymath"] = {
			func: (args1, args2, f = null) => {
				try {
					return katex.renderToString(args2 || '', { displayMode: true, throwOnError: false });
				}
				catch (e) {
					return this.escapeHTML(args2 || '');
				}
			},
			escape: true, const: true, noargs: false
		};

		this.functions["pparse"] = {
			func: (args1, args2, f = null) => {
				const result = this.parse(args2, f);
				return { pkg: result.functions, rtn: result.html };
			},
			escape: true, const: true, noargs: false
		};

		this.functions["parse"] = {
			func: (args1, args2, f = null) => {
				const result = this.parseToHTML(args2, f);
				return result;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["char"] = {
			func: (args1, args2, dontneed = null) => {
				const code = args2.replace(/[^a-zA-Z_#]/g, '').trim();
				return `&${code};`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["textcolor"] = {
			func: (args1, args2, f = null) => {
				const color = args1[0] || 'black';
				return `<span style="color:${color}">${this.parseToHTML(args2, f)}</span>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["fontsize"] = {
			func: (args1, args2, f = null) => {
				const size = args1[0] || '1em';
				return `<span style="font-size:${size}">${this.parseToHTML(args2, f)}</span>`;
			},
			escape: true, const: true, noargs: false
		};

		this.vars = {};

		this.functions["var"] = {
			func: (args1, args2, f = null) => {
				if (!args2 || args2 === '')
					return '';
				if (args2[0] == '$')
					return this.escapeHTML(String(this.vars[args2]));
				return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\var\` 中]</span>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["vars"] = {
			func: (args1, args2, f = null) => {
				return `<span style="color: red">[\`\\vars\` 不安全]</span>`;
				if (!args2 || args2 === '')
					return '';
				if (args2[0] == '$')
					return String(this.vars[args2]);
				return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\vars\` 中]</span>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["setp"] = {
			func: (args1, args2, f) => {
				let tmp = this.parse(args2, f).html;
				tmp = tmp.replace('&lt;', '<').replace('&gt;', '>').
					replace('&quot;', '"').replace('&#39;', '\'').
					replace('&amp;', '&');
				for (let i = 0; i < args1.length; i++) {
					if (!args2 || args1[i][0] != '$')
						return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\setp\` 中]</span>`;
					this.vars[args1[i]] = tmp;
				}
				return '';
			},
			escape: true, const: true, noargs: false
		};

		this.functions["set"] = {
			func: (args1, args2, f = null) => {
				let tmp = args2;
				if ((tmp[0] >= '0' && tmp[0] <= '9') ||
					tmp[0] == '+' || tmp[0] == '-') {
					tmp = Number(tmp.replace(/[^0-9.eE+-]/g, '').trim())
				}
				else if (tmp[0] == '"' && tmp[tmp.length - 1] == '"')
					tmp = tmp.slice(1, tmp.length - 1);
				else
					return '<span style="color: red">[\`\\set\` 函数输入值非数字或以 \`\"\` 开头、结尾的字符串]</span>'
				for (let i = 0; i < args1.length; i++) {
					if (!args2 || args1[i][0] != '$')
						return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\set\` 中]</span>`;
					this.vars[args1[i]] = tmp;
				}
				return '';
			},
			escape: true, const: true, noargs: false
		};

		this.functions["add"] = {
			func: (args1, args2, f = null) => {
				if (args1.length < 2)
					return;
				if (args1[0][0] != '$')
					return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\add\` 中]</span>`;
				let tmp = this.escapeVar(args1[1]);
				for (let i = 2; i < args1.length; i++) {
					tmp = tmp + this.escapeVar(args1[i]);
				}
				this.vars[args1[0]] = tmp;
				return '';
			},
			escape: true, const: true, noargs: false
		}

		this.functions["div"] = {
			func: (args1, args2, f = null) => {
				if (args1.length < 2)
					return;
				if (args1[0][0] != '$')
					return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\add\` 中]</span>`;
				let tmp = this.escapeVar(args1[1]);
				for (let i = 2; i < args1.length; i++) {
					tmp = tmp / this.escapeVar(args1[i]);
				}
				this.vars[args1[0]] = tmp;
				return '';
			},
			escape: true, const: true, noargs: false
		}

		this.functions["del"] = {
			func: (args1, args2, f = null) => {
				if (args1.length < 2)
					return;
				if (args1[0][0] != '$')
					return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\add\` 中]</span>`;
				let tmp = this.escapeVar(args1[1]);
				for (let i = 2; i < args1.length; i++) {
					tmp = tmp - this.escapeVar(args1[i]);
				}
				this.vars[args1[0]] = tmp;
				return '';
			},
			escape: true, const: true, noargs: false
		}

		this.functions["times"] = {
			func: (args1, args2, f = null) => {
				if (args1.length < 2)
					return;
				if (args1[0][0] != '$')
					return `<span style="color: red">[变量请以 \`$\` 开头，在 \`\\add\` 中]</span>`;
				let tmp = this.escapeVar(args1[1]);
				for (let i = 2; i < args1.length; i++) {
					tmp = tmp * this.escapeVar(args1[i]);
				}
				this.vars[args1[0]] = tmp;
				return '';
			},
			escape: true, const: true, noargs: false
		}
	}

	escapeVar(tmp) {
		if ((tmp[0] >= '0' && tmp[0] <= '9') ||
			tmp[0] == '+' || tmp[0] == '-') {
			tmp = Number(tmp.replace(/[^0-9.eE+-]/g, '').trim())
		}
		else if (tmp[0] == '"' && tmp[tmp.length - 1] == '"')
			tmp = tmp.slice(1, tmp.length - 1);
		else if (tmp[0] == '$')
			tmp = this.vars[tmp];
		else
			tmp = '';
		return tmp;
	};

	registerFunction(name, func, escape = false, noargs = false, force = false, functions = this.functions) {
		if ((!force && functions[name]) || typeof func !== "function" ||
			(functions[name] && functions[name].const)) {
			throw new Error(`Function ${name} is already registered or is not a function.`);
		}
		functions[name] = { func: func, escape: escape, noargs: noargs };
		return functions;
	}

	escapeHTML(str) {
		const escapeMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return str.replace(/[&<>"']/g, char => escapeMap[char]);
	}

	escapeString(str) {
		return str.replace(/\\\\/g, "\\");
	}

	parseFunction(name, args1, args2, registeredFunctions = this.functions) {
		if (!registeredFunctions[name]) {
			return { pkg: registeredFunctions, rtn: `[未知命令: \\${name}]` };
		}
		const fn = registeredFunctions[name];
		return fn.func(args1, (fn.escape ? this.escapeString(args2) : args2), registeredFunctions);
	}

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
				if (registeredFunctions.hasOwnProperty(funcName)) {
					if (!registeredFunctions[funcName].noargs) {
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
						if (iter < length && wbwTexitString[iter] === '{') {
							iter++;
							let escape = false, keepEscapes = registeredFunctions[funcName].escape, bracketCount = 1;
							while (iter < length && (bracketCount > 0)) {
								if (wbwTexitString[iter] === '\\' && !escape) {
									escape = true;
								} else {
									if (wbwTexitString[iter] === '{' && !escape && keepEscapes) {
										bracketCount++;
									} else if (wbwTexitString[iter] === '}' && !escape) {
										bracketCount--;
									}
									if (bracketCount > 0) {
										if (escape) args2 += '\\';
										args2 += wbwTexitString[iter];
									}
									escape = false;
								}
								iter++;
							}
							if (bracketCount !== 0) {
								return { pkg: registeredFunctions, rtn: HTML + `[括号不匹配: \\${funcName}]` };
							}
							if (escape) {
								args2 += '\\';
							}
						}
					}
					let tmp = '';
					try {
						tmp = this.parseFunction(funcName, args1, args2, registeredFunctions);
					} catch (e) {
						tmp = `<span style="color: red">[错误：${String(e)}]</span>`
					}
					if (typeof tmp === 'string' || tmp instanceof String) {
						HTML += tmp;
					} else {
						registeredFunctions = tmp.pkg;
						HTML += tmp.rtn;
					}
				}
				else {
					HTML += `<span style="color: red">[未知命令: \`\\${funcName}\`]</span>`;
				}
			}
			else {
				if (wbwTexitString[iter] !== '\n')
					HTML += this.escapeHTML(wbwTexitString[iter]);
				iter++;
			}
		}
		return {
			html: HTML,
			functions: registeredFunctions
		};
	}

	parseToHTML(element, registeredFunctions = this.functions) {
		return this.parse(
			typeof element === 'string' || element instanceof String ? element : element.innerText,
			registeredFunctions
		).html;
	}
}

export { wbwTexit };
