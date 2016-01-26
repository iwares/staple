#!/usr/bin/env node

var UglifyJS = require('uglify-js'),
	FS = require('fs'),
	Path = require('path');

var dir = Path.dirname(process.argv[1]);
process.chdir(dir);

var modules = FS.readdirSync(Path.join(dir, 'modules')),
	sources = [];

for (var i = 0, module; module = modules[i]; ++i) {
	if (Path.extname(module) != '.js')
		return;
	sources.push(Path.join('modules', module));
}

sources.push('noumenon.js');
sources.push('staple.js');

var result = UglifyJS.minify(sources, {
	compress : {
		sequences : true,
		properties : true,
		dead_code : true,
		drop_debugger : true,
		unsafe : false,
		conditionals : true,
		comparisons : true,
		evaluate : true,
		booleans : true,
		loops : true,
		unused : true,
		hoist_funs : true,
		hoist_vars : false,
		if_return : true,
		join_vars : true,
		cascade : true,
		side_effects : true,
		warnings : true,
		negate_iife : true,
		pure_getters : false,
		pure_funcs : null,
		drop_console : true,
		keep_fargs : false,
		keep_fnames : false,
	},
	mangle : {
		except : [
			'$super',
			'require'
		]
	}
});

FS.writeFileSync('staple.min.js', result.code, 'utf8');
