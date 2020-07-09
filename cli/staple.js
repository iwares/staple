#!/usr/bin/env node

const readline = require('readline-sync');
const fs = require('fs');
const path = require('path');

function printUsage () {
	console.log('Useage: staple init');
}

if (process.argv[2] != 'init')
	return printUsage();

const cwd = process.cwd();
const files = fs.readdirSync(cwd);
if (files.length)
	return console.error('Can not init project: current folder is not empty.');

const cwdpath = path.parse(cwd);
const defaultName = cwdpath.base;

let projectName = readline.question('project name: (' + defaultName + ') ') || defaultName;
let version = readline.question('version: (1.0.0) ') || '1.0.0';
let description = readline.question('description: ');
let author = readline.question('author: ');
let jQuery = readline.question('use jquery: (yes) ').toLowerCase() || 'yes';
jQuery = (jQuery == 'yes' || jQuery == 'y');
let artTemplate = readline.question('use art template: (yes) ').toLowerCase() || 'yes';
artTemplate = (artTemplate == 'yes' || artTemplate == 'y');
let weUI = readline.question('use weui: (yes) ').toLowerCase() || 'yes';
weUI = (weUI == 'yes' || weUI == 'y');
let typescript = readline.question('use typescript: (yes) ').toLowerCase() || 'yes';
typescript = (typescript == 'yes' || weUI == 'y');

console.log('');
console.log('creating project "' + projectName + '" ...');

function output(file, content, options) {
	fs.writeFileSync(file, content, options);
}

function strip(content, jQuery, artTemplate, weUI) {
	return content.replace(/## IF jQuery ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI jQuery ##\r?\n/g, (raw, content1, content2) => {
		return jQuery ? content1 : content2;
	}).replace(/## IF artTemplate ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI artTemplate ##\r?\n/g, (raw, content1, content2) => {
		return artTemplate ? content1 : content2;
	}).replace(/## IF weUI ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI weUI ##\r?\n/g, (raw, content1, content2) => {
		return weUI ? content1 : content2;
	}).replace(/\$\{projectName\}/g, projectName);
}

let packageJson = JSON.parse(fs.readFileSync(__dirname + '/templates/package.json', 'utf-8'));

packageJson.name = projectName;
packageJson.version = version;
packageJson.description = description;
packageJson.author = author;

if (jQuery)
	packageJson.devDependencies['jquery'] = '^3.3.1';
if (jQuery && typescript)
	packageJson.devDependencies['@types/jquery'] = '^3.3.10';
if (artTemplate)
	packageJson.devDependencies['art-template'] = '^4.12.2';
if (weUI)
	packageJson.devDependencies['weui'] = '^1.1.3';

output('package.json', JSON.stringify(packageJson, null, 2));

const folders = [
	'src',
	'src/components',
	'src/images',
	'src/pages',
	'src/strings',
];

for (let folder of folders) {
	if (!fs.existsSync(folder))
		fs.mkdirSync(folder, 0o755);
}

const plains = [
	'src/components/message-dialog.html',
	'src/components/message-dialog.tjs',
	'src/pages/about.html',
	'src/pages/about.tjs',
	'src/pages/home.html',
	'src/pages/home.tjs',
	'src/strings/master.tjs',
	'src/application.css',
	'src/application.tjs',
	'src/index.html',
	'gulpfile.js',
	'staple.d.ts',
	'tsconfig.json',
]

const arguments = {
	projectName: projectName,
	version: version,
	description: description,
	author: author,
}

for (let plain of plains) {
	if (plain.endsWith('.tjs'))
		plain = plain.replace('.tjs', typescript ? '.ts' : '.js');

	let content = fs.readFileSync(__dirname + '/templates/' + plain, 'utf-8').replace(/\$\{([A-Za-z]+)\}/g, (raw, argument) => {
		return arguments[argument] || '';
	}).replace(/## IF jQuery ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI jQuery ##\r?\n/g, (raw, content1, content2) => {
		return jQuery ? content1 : content2;
	}).replace(/## IF artTemplate ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI artTemplate ##\r?\n/g, (raw, content1, content2) => {
		return artTemplate ? content1 : content2;
	}).replace(/## IF weUI ##\r?\n([\s\S]*?)## ELSE ##\r?\n([\s\S]*?)## FI weUI ##\r?\n/g, (raw, content1, content2) => {
		return weUI ? content1 : content2;
	});

	output(plain, content, 'utf-8');
}

const binaries = [
	'src/images/application.png',
]

for (binary of binaries) {
	let content = fs.readFileSync(__dirname + '/templates/' + binary, 'binary');
	output(binary, content, 'binary');
}

console.log('done.');
console.log('');
console.log('run "npm install" to install dependencies.');
console.log('then run "npm start" to start.')
