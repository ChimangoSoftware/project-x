'use strict';

var _ = require('lodash');
var del = require('del');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var lazypipe = require('lazypipe');
var nodemon = require('nodemon');
var runSequence = require('run-sequence');
var merge2 = require('merge2');

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
            integration: `${serverPath}/**/*.integration.js`,
            unit: `${serverPath}/**/*.spec.js`
        }
    },
    karma: 'karma.conf.js',
    dist: 'dist'
};

/********************
 * Reusable pipelines
 ********************/

let lintServerScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
    .pipe(plugins.jshint, `${serverPath}/.jshintrc-spec`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

/*let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        optional: ['runtime']
    })
    .pipe(plugins.sourcemaps.write, '.');*/

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
 * main Tasks
 ********************/
gulp.task('serve', cb => {
    runSequence(
        ['typescript'],
        ['start:server'],
        'watch',
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

gulp.task('test:server', cb => {
    runSequence(
        'env:all',
        'env:test',
        'mocha:unit',
        'mocha:integration',
        'mocha:coverage',
        cb);
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));

/********************
 * Build
 ********************/

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

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
}


/********************
 * private Tasks
 ********************/

gulp.task('typescript', ['clean:built'], function () {

    var tsProject = plugins.typescript.createProject('./tsconfig.json');
    var tsResult = gulp.src(paths.server.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject));

    return merge2([
        tsResult.js.pipe(plugins.sourcemaps.write("./", { sourceRoot: `${__dirname}/server` })).pipe(gulp.dest("built"))
    ]);
});

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`-w ${builtPath} ${builtPath} --delay 2`).on('log', onServerLog);
});

gulp.task('watch', () => {
    plugins.watch(paths.server.scripts, function () {
        gulp.run('typescript');
    });
});

gulp.task('copy:server', () => {
    return gulp.src(['package.json'], { cwdbase: true }).pipe(gulp.dest(paths.dist));
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    nodemon(`-w --debug ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`).on('log', onServerLog);
});

gulp.task('mocha:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha());
});

gulp.task('mocha:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha());
});

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));
gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }));
gulp.task('clean:built', () => del(['built/**/*'], { dot: true }));

/*gulp.task('transpile:server', () => {
    return gulp.src(_.union(paths.server.scripts, paths.server.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});*/

//gulp.task('lint:scripts', cb => runSequence(['lint:scripts:server'], cb));


/*gulp.task('lint:scripts:server', () => {
    return gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, blob => '!' + blob)))
        .pipe(lintServerScripts());
});
*/

/*gulp.task('lint:scripts:serverTest', () => {
    return gulp.src(paths.server.test)
        .pipe(lintServerTestScripts());
});*/

/*gulp.task('jscs', () => {
    return gulp.src(_.union(paths.server.scripts))
        .pipe(plugins.jscs())
        .pipe(plugins.jscs.reporter());
});*/

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
gulp.task('env:test', () => {
    plugins.env({
        vars: { NODE_ENV: 'test' }
    });
});
gulp.task('env:prod', () => {
    plugins.env({
        vars: { NODE_ENV: 'production' }
    });
});

/********************
 * Coverage
 ********************/
gulp.task('mocha:coverage', cb => {
    runSequence(
        'coverage:pre',
        'env:all',
        'env:test',
        'coverage:unit',
        'coverage:integration',
        cb);
});

gulp.task('coverage:pre', () => {
    return gulp.src(paths.server.scripts)
    // Covering files
        .pipe(plugins.babelIstanbul())
    // Force `require` to return covered files
        .pipe(plugins.babelIstanbul.hookRequire());
});

// Creating the reports after tests ran
gulp.task('coverage:unit', () => {
    return gulp.src(paths.server.test.unit)
        .pipe(mocha())
        .pipe(istanbul());

});

// Creating the reports after tests ran
gulp.task('coverage:integration', () => {
    return gulp.src(paths.server.test.integration)
        .pipe(mocha())
        .pipe(istanbul());
});