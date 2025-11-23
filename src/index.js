import katex from 'katex';

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
				return `<strong>${this.parse(args2, f)}</strong>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["textit"] = {
			func: (args1, args2, f = null) => {
				return `<em>${this.parse(args2, f)}</em>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["underline"] = {
			func: (args1, args2, f = null) => {
				return `<u>${this.parse(args2, f)}</u>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["sout"] = {
			func: (args1, args2, f = null) => {
				return `<s>${this.parse(args2, f)}</s>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["texttt"] = {
			func: (args1, args2, f = null) => {
				return `<code>${this.parse(args2, f)}</code>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["itemize"] = {
			func: (args1, args2, f = null) => {
				return `<ul>${this.parse(args2, f)}</ul>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["enumerate"] = {
			func: (args1, args2, f = null) => {
				return `<ol>${this.parse(args2, f)}</ol>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["item"] = {
			func: (args1, args2, f = null) => {
				return `<li>${this.parse(args2, f)}</li>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["h1"] = {
			func: (args1, args2, f = null) => {
				return `<h1>${this.parse(args2, f)}</h1>`;
			},
			escape: true, const: true, noargs: false
		};

		// Additional commonly-used functions
		this.functions["section"] = {
			func: (args1, args2, f = null) => {
				return `<h2>${this.parse(args2, f)}</h2>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["subsection"] = {
			func: (args1, args2, f = null) => {
				return `<h3>${this.parse(args2, f)}</h3>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["small"] = {
			func: (args1, args2, f = null) => {
				return `<small>${this.parse(args2, f)}</small>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["href"] = {
			// usage: \href[url]{text}
			func: (args1, args2, f = null) => {
				const url = (args1 && args1.length > 0) ? args1[0] : '#';
				const text = this.parse(args2, f);
				return `<a href="${this.escapeHTML(url)}">${text}</a>`;
			},
			escape: true, const: true, noargs: false
		};

		this.functions["includegraphics"] = {
			// usage: \includegraphics[width=100px]{src}
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
			// render inline/display math using katex
			func: (args1, args2, f = null) => {
				try {
					return katex.renderToString(args2 || '', { throwOnError: false });
				} catch (e) {
					return this.escapeHTML(args2 || '');
				}
			},
			escape: true, const: true, noargs: false
		};
	}

	registerFunction(name, func, escape = false, noargs = false, force = false, functions = this.functions) {
		if ((!force && functions[name]) || typeof func !== "function" ||
			(functions[name] && functions[name].const)) {
			throw new Error(`Function ${name} is already registered or is not a function.`);
		}
		functions[name] = { func: func, escape: escape, noargs: noargs };
		return functions;
	}

	escapeHTML(str) {
		return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
	}

	escapeString(str) {
		return str.replace(/\\\\/g, "\\");
	}

	parseFunction(name, args1, args2, registeredFunctions = this.functions) {
		if (!registeredFunctions[name]) {
			throw new Error(`Function ${name} is not registered.`);
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
				if (registeredFunctions[funcName]) {
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
									if (wbwTexitString[iter] === '{' && !escape) {
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
								throw new Error(`Mismatched braces in function ${funcName}.`);
							}
							if (escape) {
								args2 += '\\';
							}
						}
					}
					let tmp = this.parseFunction(funcName, args1, args2, registeredFunctions);
					if (typeof tmp === 'string' || tmp instanceof String) {
						HTML += tmp;
					} else {
						registeredFunctions = tmp.pkg;
						HTML += tmp.rtn;
					}
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