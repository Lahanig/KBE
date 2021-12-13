const gulp = require('gulp'),
     rename = require('gulp-rename'),
     less = require('gulp-less'),
     autoprefixer = require('gulp-autoprefixer'),
     sourcemaps = require('gulp-sourcemaps'),
     { series } = require('gulp'),
     browserSync = require('browser-sync').create(),
     fileinclude = require('gulp-file-include'),
     del = require('del');

const css = (done) => {
    
    gulp.src('./src/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            errorLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest('./build/css/') );

    done();
}

const css_build = (done) => {
    
    gulp.src('./src/less/libs/*.css')
        .pipe( gulp.dest('./build/css/libs/') );

    done();
}

const img = (done) => {
    
    gulp.src('./src/img/**/*')
        .pipe( gulp.dest('./build/img/') );

    done();
}

const font = (done) => {
    
    gulp.src('./src/font/**/*')
        .pipe( gulp.dest('./build/font/') );

    done();
}

const html = (done) => {
    
    gulp.src('src/html/[^_]*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('./build/'));

    done();
}

const js = (done) => {
    
    gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('./build/js/'));

    done();
}

const cssdel = (done) => {
    
    del(['./build/css/**/*', '!./build/css/index.min.css', '!./build/css/index.min.css.map', '!./build/css/style.min.css', '!./build/css/style.min.css.map', '!./build/css/libs']);

    done();
}

const lessdel = (done) => {
    
    del(['./src/less/**/*.css', '!./src/less/libs/*.css']);

    done();
}

const sync = (done) => {

    browserSync.init({
        server: {
            baseDir: "./build"
        },
        port: 3000,
        notify: false
    });

    done();
}

const browserReload = (done) => {
    browserSync.reload();
    done();
}

const update_source = () => {
    gulp.watch('./src/**/*', img, font);
}

const update_project = () => {
    gulp.watch('./src/**/*.html', browserReload);
    gulp.watch('./src/less/**/*.less', browserReload);
    gulp.watch('./src/js/**/*.js', browserReload);
}

const update_html = () => {
    gulp.watch('./src/**/*.html', html);
}

const update_js = () => {
    gulp.watch('./src/js/**/*.js', js);
}

const update_css = () => {
    gulp.watch('./src/less/**/*.less', gulp.series(css, lessdel, css_build));
}

gulp.task('default', gulp.parallel(js,
     html,
     css_build,
     update_source,
     img,
     css,
     font,
     cssdel,
     lessdel,
     browserReload,
     update_js,
     update_html,
     update_project,
     sync,
     update_css));

gulp.task('build', gulp.series(cssdel));

gulp.task(html);
gulp.task(js);
gulp.task(css);
gulp.task(lessdel);
gulp.task(img);
gulp.task(font);
gulp.task(css_build);