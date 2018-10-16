const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');

gulp.task('buildcss', () => {
	let stream = gulp.src('core/staple.css')
		.pipe(plumber())
		.pipe(sourcemaps.init())
			.pipe(cleancss({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
	return stream;
});

gulp.task('buildjs', () => {
	let stream = gulp.src(['core/!(noumenon).js', 'core/noumenon.js'], {base: '.'})
		.pipe(plumber())
		.pipe(sourcemaps.init())
			.pipe(concat('staple.js'))
			.pipe(babel({presets: ['env']}))
			.pipe(uglify({mangle: {reserved: ['require']}}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
	return stream;
});

gulp.task('buildtsd', () => {
	let stream = gulp.src('core/staple.d.ts')
		.pipe(gulp.dest('dist'));
	return stream;
})

gulp.task('build', ['buildcss', 'buildjs', 'buildtsd']);

gulp.task('develop', ['build'], () => {
	gulp.watch('core/*.css', ['buildcss']);
	gulp.watch('core/*.js', ['buildjs']);
	gulp.watch('core/*.d.ts', ['buildtsd']);
});
