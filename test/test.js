(async () => {
	const assert = require('assert');
	const path = require('path');
	const { pathToFileURL } = require('url');

	const fileUrl = pathToFileURL(path.resolve(__dirname, '..', 'src', 'index.js')).href;
	const mod = await import(fileUrl);
	const wbwTexit = mod.wbwTexit;

	const t = new wbwTexit();

	try {
		// escapeHTML
		assert.strictEqual(t.escapeHTML('<&>"\''), '&lt;&amp;&gt;&quot;&#39;');

		// escapeString
		assert.strictEqual(t.escapeString('\\\\'), '\\');

		// basic parse
		assert.strictEqual(t.parseToHTML('hello'), 'hello');

		// simple formatting
		assert.strictEqual(t.parseToHTML('\\textbf{bold}'), '<strong>bold</strong>');
		assert.strictEqual(t.parseToHTML('\\textit{it}'), '<em>it</em>');
		assert.strictEqual(t.parseToHTML('\\newline'), '<br>');

		// nested formatting
		const nested = t.parseToHTML('\\textbf{bold \\textit{and} more}');
		assert.strictEqual(nested, '<strong>bold <em>and</em> more</strong>');

		// register and use custom function
		t.registerFunction('shout', (args1, args2) => args2.toUpperCase(), true, false, false, t.functions);
		assert.strictEqual(t.parseToHTML('\\shout{hello}'), 'HELLO');

		// newly added functions
		assert.strictEqual(t.parseToHTML('\\section{Title}'), '<h2>Title</h2>');
		assert.strictEqual(t.parseToHTML('\\subsection{Sub}'), '<h3>Sub</h3>');
		assert.strictEqual(t.parseToHTML('\\small{tiny}'), '<small>tiny</small>');
		assert.strictEqual(t.parseToHTML('\\href[http://example.com]{link}'), '<a href="http://example.com">link</a>');
		assert.strictEqual(t.parseToHTML('\\includegraphics[width=100px]{/img.png}'), '<img src="/img.png" style="width:100px;"/>');

		const mathOut = t.parseToHTML('\\math{1+1}');
		assert.ok(typeof mathOut === 'string' && mathOut.length > 0 && mathOut.includes('katex'));

		// unknown function should throw
		assert.throws(() => t.parseToHTML('\\unknown{a}'), /is not registered/);

		// mismatched braces should throw
		assert.throws(() => t.parseToHTML('\\textbf{a'), /Mismatched braces/);

		console.log('All tests passed');
	} catch (err) {
		console.error('Test failed:', err && err.stack ? err.stack : err);
		process.exit(1);
	}

	// 生成html的demo
	const demoInput = `\\section{Welcome}
This is a \\textbf{bold} statement with a \\href[http://example.com]{link}.\\newline
Here is an image: \\includegraphics[width=200px]{http://placekitten.com/200/300}\\newline
And some small text: \\small{This is small}\\newline
And some math: \\math{E=mc^2}\\newline
And a subsection:\\newline
\\subsection{Introduction}
This is the introduction section. Here is some \\textit{italic} text.
\\newline
\\newline
And more text...\\newline
The quick brown fox jumps over the lazy dog.\\char{128515}`;
	const demoOutput = t.parseToHTML(demoInput);
	// 输出demo.html
	const fs = require('fs');
	const demoHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>wbwTexit Demo</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
</head>
<body>
${demoOutput}
</body>
</html>`;
	fs.writeFileSync(path.resolve(__dirname, 'demo.html'), demoHtml, 'utf-8');
	console.log('Demo HTML generated at test/demo.html');

	// explicit success
	process.exit(0);

})().catch(err => {
	console.error('Failed to run tests:', err && err.stack ? err.stack : err);
	process.exit(1);
});

