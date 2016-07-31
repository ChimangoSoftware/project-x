'use strict';

const _ = require('lodash');
const del = require('del');
const gulp = require('gulp');
const lazypipe = require('lazypipe');
const nodemon = require('nodemon');
const runSequence = require('run-sequence');
const merge2 = require('merge2');
const path = require('path');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

const tsProject = plugins.typescript.createProject('tsconfig.json');

const backend = 'backend';
const buildPath = 'build';
const paths = {
    server: {
        scripts: 'src/**/*.ts',
        builtScripts: [`${buildPath}/**/*.js`],
        json: [`${backend}/**/*.json`],
        test: {
            integration: `${buildPath}/src/**/*.integration.spec.js`,
            unit: `${buildPath}/src/**/*.spec.js`
        }
    },
    dist: 'dist'
};

/********************
 * Start
 ********************/

gulp.task('start', cb => {
    // plugins.shell(['cd ../frontend && npm start']);
    runSequence(
        'clean:build',
        'typescript',
        'start:server',
        'watch',
        cb);
});

gulp.task('typescript', () => {
    let tsResult = tsProject.src(paths.server.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript(tsProject));

    return tsResult
        .js
        .pipe(plugins.sourcemaps.write('.', {
            sourceRoot: (file) => {
                // file.cwd >  'C:\Users\nicosampler\developer\project-x\backend'
                const backendPath = file.cwd;
                const srcBackendPath = path.join(backendPath, 'src');
                const currentFile = file.sourceMap.file;
                const fullPathFile = path.join(srcBackendPath, currentFile);
                const relativePath = path.relative(path.dirname(fullPathFile), backendPath);
                return path.join(relativePath, 'src');
            }
        }))
        .pipe(gulp.dest(buildPath));
})

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    nodemon(`--debug ${buildPath} --delay 2`).on('log', onServerLog);
});

gulp.task('watch', () => {
    plugins.watch(paths.server.scripts, () => {
        gulp.run('typescript');
    });
});

/********************
 * Test
 ********************/

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

gulp.task('clean:build', () => del(['build/**/*'], { dot: true }));

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }));

/********************
 * Env
 ********************/
gulp.task('env:all', () => {
    let localConfig;
    try {
        localConfig = require(`./${backend}/config/local.env`);
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

/*
gulp.task('copy:server', () => {
    return gulp.src(['package.json'], { cwdbase: true }).pipe(gulp.dest(paths.dist));
});

gulp.task('start:server:prod', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    nodemon(`-w ${paths.dist}/${backend} ${paths.dist}/${backend}`).on('log', onServerLog);
});

let lintServerScripts = lazypipe()
    .pipe(plugins.jshint, `${backend}/.jshintrc`)
    .pipe(plugins.jshint.reporter, 'jshint-stylish');

let lintServerTestScripts = lazypipe()
    .pipe(plugins.jshint, `${backend}/.jshintrc-spec`)
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
