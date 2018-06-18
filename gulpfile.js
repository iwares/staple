const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');

const builder = function () {
	console.log('building...');

	gulp.src(['core/!(noumenon).js', 'core/noumenon.js'], {base: '.'})
		.pipe(plumber())
		.pipe(sourcemaps.init())
			.pipe(concat('staple.js'))
			.pipe(babel({presets: ['env']}))
			.pipe(uglify({mangle: {reserved: ['require']}}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));

	gulp.src('staple.css')
		.pipe(plumber())
		.pipe(sourcemaps.init())
			.pipe(cleancss({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));

	console.log('ok!');
}

gulp.task('build', builder);

gulp.task('develop', ['build'], () => {
	gulp.watch(['core/*.js', 'staple.css'], builder);
});
