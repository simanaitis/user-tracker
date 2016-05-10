module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                node: true,
                jquery: true,
                // Force all variable names to use either camelCase style
                // or UPPER_CASE with underscores.
                camelcase: true,
                curly: true,
                // Prohibit use of == and != in favor of === and !==.
                eqeqeq: true,
                // Suppress warnings about == null comparisons.
                eqnull: true,
                // Enforce tab width of 4 spaces.
                indent: 4,
                immed: true,
                // Require capitalized names for constructor functions.
                newcap: true,
                // Enforce use of single quotation marks for strings.
                quotmark: 'single',
                // Prohibit trailing whitespace.
                trailing: true,
                noarg: true,
                sub: true,
                // Enforce line length to 80 characters
                maxlen: 80,
                // Enforce placing 'use strict' at the top function scope
                strict: true,
                browser: true,
                globals: {
                    _: true,
                    $: true,
                    jQuery: true,
                    require: true,
                    define: true,
                    requirejs: true,
                    describe: true,
                    expect: true,
                    it: true
                }
            },
            src: ['src/**/*.js'] // app.js dadet
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                jUnit: {
                    report: true,
                    savePath: './build/reports/jasmine/',
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['spec/'],
            //src: ['build/*.source.js']
        },
        jasmine: {
            pivotal: {
                src: 'build/<%= pkg.name %>.nologs.js',
                options: {
                    vendor: ['vendor/jquery-2.1.0.min.js',
                        'vendor/jasmine-jquery.js',
                        'node_modules/underscore/*.js'
                    ],
                    helpers: ['spec/*Helper.js'],
                    specs: 'spec/*Spec.js',
                    keepRunner: true
                }
            }
        },


         watch: {
            full: {
                files: ['src/*.js', 'app.js','!**/node_modules/**'],
                tasks: ['removelogging', 'jshint', 'jasmine_node'],
                options: {
                    //livereload: true,
                    spawn: false,
                },
            },
            forTesting: {
                files: ['**/*.js', '!**/node_modules/**'],
                tasks: ['removelogging', 'jasmine_node','express:dev'],
                options: {
                    //livereload: true,
                    spawn: false,
                },
            },
            withJSHint: {
                files: ['**/*.js', '!**/node_modules/**'],
                tasks: ['jshint'],
                options: {
                    //livereload: true,
                    spawn: false,
                },
            },
        },
        concat2: {
            sourceFiles: {
                options: {
                    seperator: '\n',
                    banner: '',
                    footer: ''
                },
                src: ['src/*.js'],
                dest: 'build/<%= pkg.name %>.source.js'
            }
        },
        concat: {
            sourceFiles: {
                options: {
                    seperator: '\n',
                    banner: '',
                    footer: ''
                },
                src: ['public/js/*.js'],
                dest: 'build/angular.source.js'
            }
        },
        express: {
            dev: {
              options: {
                script: 'server.js'
              }
          }
        },
        removelogging: {
            testing: {
                src: 'build/<%= pkg.name %>.source.js',
                dest: 'build/<%= pkg.name %>.nologs.js',
                options: {}
            }
        },
        browserify: {
          dist: {
            files: {
              'public/app.browserified.js': ['public/js/app.js']
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');
    // Default task(s).
    grunt.registerTask('default2', function() {
        var tasks = ['concat', 'removelogging', 'jshint', 'express:dev', 'jasmine_node', 'watch:forTesting'];
        // always use force when watching
        grunt.option('force', true);
        grunt.task.run(tasks);
    });
    grunt.registerTask('default', function() {
        var tasks = ['browserify'];
        // always use force when watching
        grunt.option('force', true);
        grunt.task.run(tasks);
    });
};