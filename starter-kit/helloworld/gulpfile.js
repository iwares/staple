const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const artinclude  = require('gulp-art-include');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const cleancss = require('gulp-clean-css');

const browser = require('browser-sync').create();

const path = require('path');

const timestamp = new Date().getTime();

const buildhtmls = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('    html: ' + src);

	let temp = gulp.src(src,{base:'src'});
	if (!args.strict)
		temp = temp.pipe(plumber());
	temp = temp.pipe(artinclude({ data : { timestamp : timestamp } }));

	temp = temp.pipe(gulp.dest(dst));
}

const buildcss = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('     css: ' + src);

	let temp = gulp.src(src,{base:'src'});
	if (!args.strict)
		temp = temp.pipe(plumber());
	if (dst == 'release')
		temp = temp.pipe(cleancss({compatibility: 'ie8'}));

	temp = temp.pipe(gulp.dest(dst));
}

const buildjsamd = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('      js: ' + src);

	let temp = gulp.src(src,{base:'src'});
	if (!args.strict)
		temp = temp.pipe(plumber());
	temp = temp.pipe(sourcemaps.init());
	temp = temp.pipe(babel({presets:['env'],plugins:["transform-es2015-modules-amd"]}));
	if (dst == 'release')
		temp = temp.pipe(uglify({mangle:{reserved:['require', '$super']}}));
	temp = temp.pipe(sourcemaps.write('.'));

	temp = temp.pipe(gulp.dest(dst));
}

const buildjs = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('      js: ' + src);

	let temp = gulp.src(src,{base:'src'});
	if (!args.strict)
		temp = temp.pipe(plumber());
	temp = temp.pipe(sourcemaps.init());
	temp = temp.pipe(babel({presets:['env']}));
	if (dst == 'release')
		temp = temp.pipe(uglify({mangle:{reserved:['require', '$super']}}));
	temp = temp.pipe(sourcemaps.write('.'));

	temp = temp.pipe(gulp.dest(dst));
}

const buildphps = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('   asset: ' + src);

	let temp = gulp.src(src,{base:'src'});

	temp = temp.pipe(gulp.dest(dst));
}

const buildjsons = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('    json: ' + src);

	let temp = gulp.src(src,{base:'src'});
	temp = temp.pipe(replace(/\{\{timestamp\}\}/g, timestamp));

	temp = temp.pipe(gulp.dest(dst));
}

const buildimages = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('   image: ' + src);

	let temp = gulp.src(src,{base:'src'});

	temp = temp.pipe(gulp.dest(dst));
}

const buildassets = function (args) {
	let src = args.path, dst = this.toString();
	if (path.isAbsolute(src))
		src = path.relative(path.resolve('.'), src);
	console.log('   asset: ' + src);

	let temp = gulp.src(src,{base:'src'});

	temp = temp.pipe(gulp.dest(dst));
}

const buildlibs = function (dst) {
	console.log('   asset: node_modules/babel-polyfill');
	gulp.src('node_modules/babel-polyfill/dist/polyfill.min.js', {base:'node_modules'})
		.pipe(gulp.dest(dst + '/libs'));
	console.log('   asset: node_modules/requirejs');
	gulp.src('node_modules/requirejs/require.js', {base:'node_modules'})
		.pipe(gulp.dest(dst + '/libs'));
	console.log('   asset: staple');
	gulp.src('../../dist/*', {base:'../..'})
		.pipe(gulp.dest(dst + '/libs/staple'));
}

const build = function (dst) {
	buildhtmls.call(dst, {path:'src/**/*.html',strict:true});
	buildphps.call(dst, {path:'src/**/*.php',strict:true});
	buildjsons.call(dst, {path:'src/**/*.json',strict:true});
	buildjsamd.call(dst, {path:'src/!(libs)/**/*.js',strict:true});
	buildjsamd.call(dst, {path:'src/application.js',strict:true});
	buildcss.call(dst, {path:'src/!(libs)/**/*.css',strict:true});
	buildassets.call(dst, {path:'src/@(libs|images|fonts)/**/*',strict:true});

	buildlibs(dst);
};

gulp.task('develop', ['build-develop'], function() {
	const dst = 'debug';

	var taskId = undefined;
	browser.init({ server: { baseDir: dst } });
	gulp.watch(dst + '/**/*', function() {
		if (taskId)
			clearTimeout(taskId);
		taskId = setTimeout(browser.reload.bind(browser), 400);
	});

	gulp.watch('src/**/*.html', buildhtmls.bind(dst));
	gulp.watch('src/**/*.htm', buildhtmls.bind(dst, {path:'src/**/*.html'}));
	gulp.watch('src/**/*.php', buildphps.bind(dst));
	gulp.watch('src/**/*.json', buildjsons.bind(dst));
	gulp.watch('src/!(libs)/**/*.js', buildjsamd.bind(dst));
	gulp.watch('src/application.js', buildjsamd.bind(dst));
	gulp.watch('src/!(libs)/**/*.css', buildcss.bind(dst));
	gulp.watch('src/@(libs|images|fonts)/**/*', buildassets.bind(dst));
});

gulp.task('build', build.bind(this, 'release'));

gulp.task('build-develop', build.bind(this, 'debug'));

gulp.task('default', ['develop']);
