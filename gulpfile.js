'use strict';

var _ = require('lodash');
var del = require('del');
var gulp = require('gulp');
var lazypipe = require('lazypipe');
var nodemon = require('nodemon');
var runSequence = require('run-sequence');
var merge2 = require('merge2');

var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

const serverPath = 'server';
const builtPath = 'built';
const builtPathSrc = 'built/server';
const paths = {
    server: {
        scripts: [`${serverPath}/**/*!(*.spec|*.integration).ts`],
        builtScripts: [`${builtPath}/**/*.js`],
        json: [`${serverPath}/**/*.json`],
        test: {
            integration: `${builtPath}/**/*.integration.spec.js`,
            unit: `${builtPath}/**/*.spec.js`
        }
    },
    dist: 'dist'
};

/********************
 * main Tasks
 ********************/
// npm script: "server": "rimraf built && tsc && nodemon --debug built"
// toDo: poder correr nodemon y tsc -w en simultaneo

gulp.task('serve', cb => {
    runSequence(
        // ['typescript'],
        ['start:server'],
        // 'watch',
        cb);
});

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'test:unit',
        'test:integration',
        cb);
});

/********************
 * Reusable pipelines
 ********************/
let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    });

let istanbul = lazypipe()
    .pipe(plugins.babelIstanbul.writeReports)
    .pipe(plugins.babelIstanbul.enforceThresholds, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        }
    });


/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`--debug ${builtPath} --delay 2`).on('log', onServerLog);
});

gulp.task('test:unit', () => {
    return gulp.src(paths.server.test.unit).pipe(mocha());
    // return gulp.src(paths.server.test.unit).pipe(mocha()).pipe(istanbul());
});

gulp.task('test:integration', () => {
    return gulp.src(paths.server.test.integration).pipe(mocha());
    // return gulp.src(paths.server.test.integration).pipe(mocha()).pipe(istanbul());
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));

gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));

gulp.task('clean:built', () => del(['built/**/*'], { dot: true }));

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));

/********************
 * Env
 ********************/
gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${serverPath}/config/local.env`);
    } catch (e) {
        localConfig = {};
    }
    plugins.env({
        vars: localConfig
    });
});

/********************
 * Coverage
 ********************/
gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
        // Covering files
        .pipe(plugins.babelIstanbul())
        // Force `require` to return covered files
        .pipe(plugins.babelIstanbul.hookRequire());
});


/*gulp.task('watch', () => {
    plugins.watch(paths.server.scripts, function () {
        gulp.run('typescript');
    });
});

gulp.task('copy:server', () => {
    return gulp.src(['package.json'], { cwdbase: true }).pipe(gulp.dest(paths.dist));
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`).on('log', onServerLog);
});

let lintServerScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

gulp.task('build', cb => {
    runSequence(
        'clean:dist',
        'clean:tmp',
        [
            'copy:server',
            'transpile:server'
        ],
        cb);
});

gulp.task('serve:dist', cb => {
    runSequence(
        'build',
        'env:all',
        'env:prod',
        ['start:server:prod'],
        cb);
});

*/
