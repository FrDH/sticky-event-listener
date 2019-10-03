/*
	Tasks:

	$ gulp 			: Runs the "js" task.
	$ gulp watch	: Starts a watch on the "js" task.

*/

const { src, dest, watch, series, parallel } = require('gulp');

const rename = require('gulp-rename');
const typescript = require('gulp-typescript');
const webpack = require('webpack-stream');

//  Dirs
const inputDir = 'src';
const outputDir = 'dist';

/** JS transpile task */
const jsTtranspile = () => {
    return src([
        inputDir + '/**/*.d.ts', // Include all typings.
        inputDir + '/**/*.ts' // Include the needed ts files.
    ])
        .pipe(
            typescript({
                target: 'es5',
                module: 'es6'
            })
        )
        .pipe(rename('sticky-event-listener.esm.js'))
        .pipe(dest(outputDir));
};

/** JS Pack task */
const jsPack = () => {
    return src(outputDir + '/sticky-event-listener.esm.js')
        .pipe(
            webpack({
                // mode: 'development',
                mode: 'production',
                output: {
                    filename: 'sticky-event-listener.js'
                },
                optimization: {
                    minimize: false
                }
            })
        )
        .pipe(dest(outputDir));
};

/*
    $ gulp js
*/
const js = cb => {
    series(jsTtranspile, jsPack)(cb);
};

/*
	$ gulp
*/
exports.default = js;

/*
	$ gulp watch
*/
exports.watch = cb => {
    watch(inputDir + '/**/*.ts', js);
    cb();
};
