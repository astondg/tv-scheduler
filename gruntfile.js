module.exports = function (grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Concatenation of JS
        concat: {
            dist: {
                options: {
                    separator: '\n\r',
                    banner: '/*\nConcatinated JS file \n' +
                            'Author: Aston Gilliland \n' +
                            'Created Date: <%= grunt.template.today("yyyy-mm-dd") %>' +
                            '\n */ \n'
                },
                // select the files to concatenate
                src: [
                    'js/app/app.js',
                    'js/app/controllers/*.js',
                    'js/app/directives/*.js',
                    'js/app/services/*.js'
                ],
                // the resulting JS file
                dest: 'js/app.js'
            }
        },

        // Minification of JS
        uglify: {
            options: {
                //  banner for inserting at the top of the result
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            build: {
                src: ['js/app.js'],
                dest: 'js/app.min.js'
            }
        },

        // Copy css files
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'less', src: ['*.css'], dest: 'css/', filter: 'isFile' }
                ]
            }
        },

        // Watch changes to JS & CSS
        watch: {
            scripts: {
                files: [
                    'js/app/*.js',
                    'js/app/controllers/*.js',
                    'js/app/directives/*.js',
                    'js/app/services/*.js'
                ],
                tasks: ['concat', 'uglify'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['less/site.css'],
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },
            views: {
                files: [
                    'index.html',
                    'views/*.html',
                    'partials/*.html'
                ],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'copy']);

};