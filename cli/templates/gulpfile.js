const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const cleancss = require('gulp-clean-css');

const browser = require('browser-sync').create();

const path = require('path');
const fs = require('fs');

const timestamp = new Date().getTime();

const dst = 'dist';

const buildlibs = function (args) {
	let src = args.path;
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);

	if (!args.silent)
		console.log('    libs: ' + src);

	let stream = gulp.src(src,{base:'.'});

	stream = stream.pipe(gulp.dest(dst));

	return stream;
}

const buildassets = function (args) {
	let src = args.path;
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);

	if (!args.silent)
		console.log('   asset: ' + src);

	let stream = gulp.src(src,{base:'src'});

	stream = stream.pipe(gulp.dest(dst));

	return stream;
}

const buildjs = function (args) {
	let src = args.path;
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);

	if (!args.silent)
		console.log('      js: ' + src);

	let stream = gulp.src(src,{base:'src'});
	if (!args.strict)
		stream = stream.pipe(plumber());
	stream = stream.pipe(sourcemaps.init());
	stream = stream.pipe(babel({presets:['env'], plugins:["transform-es2015-modules-amd"]}));
	stream = stream.pipe(uglify());
	stream = stream.pipe(sourcemaps.write('.'));

	stream = stream.pipe(gulp.dest(dst));

	return stream;
}

const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json'));

const buildts = function (args) {
	let src = args.path;
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);

	if (!args.silent)
		console.log('      ts: ' + src);

	let stream = gulp.src(src,{base:'src'});
	if (!args.strict)
		stream = stream.pipe(plumber());
	stream = stream.pipe(sourcemaps.init());
    stream = stream.pipe(typescript(tsconfig.compilerOptions));
	stream = stream.pipe(babel({presets:['env']}));
	stream = stream.pipe(uglify());
	stream = stream.pipe(sourcemaps.write('.'));

	stream = stream.pipe(gulp.dest(dst));

	return stream;
}

const buildcss = function (args) {
	let src = args.path;
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);

	if (!args.silent)
		console.log('     css: ' + src);

	let stream = gulp.src(src,{base:'src'});
	if (!args.strict)
		stream = stream.pipe(plumber());
	stream = stream.pipe(sourcemaps.init());
	stream = stream.pipe(cleancss({compatibility: 'ie8'}));
	stream = stream.pipe(sourcemaps.write('.'));

	stream = stream.pipe(gulp.dest(dst));

	return stream;
}

gulp.task('buildnodelibs', function () {
	const globs = [
		'node_modules/babel-polyfill/dist/polyfill.min.js',
		'node_modules/requirejs/require.js',
		'node_modules/staple.js/dist/*',
## IF jQuery ##
		'node_modules/jquery/dist/*.min.*',
## ELSE ##
## FI jQuery ##
## IF artTemplate ##
		'node_modules/art-template/lib/template-web.js',
## ELSE ##
## FI artTemplate ##
## IF weUI ##
		'node_modules/weui/dist/style/weui.min.css',
## ELSE ##
## FI weUI ##
	]

	let stream = gulp.src(globs, {base: 'node_modules'}).pipe(gulp.dest(dst + '/libs'));

	return stream;
});

gulp.task('buildlibs', function () {
	return buildlibs({path: 'libs/**/*', strict: true, silent: true});
});

gulp.task('buildassets', function () {
	return buildassets({path: 'src/**/*.!(js|ts|css)', strict: true, silent: true});
});

gulp.task('buildjs', function () {
	return buildjs({path: 'src/**/*.js', strict: true, silent: true});
});

gulp.task('buildts', function () {
	return buildts({path: 'src/**/*.ts', strict: true, silent: true});
});

gulp.task('buildcss', function () {
	return buildcss({path: 'src/**/*.css', strict: true, silent: true});
});

gulp.task('start', ['build'], function() {
	var taskId = undefined;
	browser.init({ server: { baseDir: dst } });
	gulp.watch(dst + '/**/*', function() {
		if (taskId)
			clearTimeout(taskId);
		taskId = setTimeout(browser.reload.bind(browser), 400);
	});

	gulp.watch('libs/**/*', buildlibs);
	gulp.watch('src/**/*.!(js|ts|css)', buildassets);
	gulp.watch('src/**/*.js', buildjs);
	gulp.watch('src/**/*.ts', buildts);
	gulp.watch('src/**/*.css', buildcss);
});

gulp.task('build', ['buildnodelibs', 'buildlibs', 'buildassets', 'buildjs', 'buildts', 'buildcss']);

gulp.task('default', ['start']);
