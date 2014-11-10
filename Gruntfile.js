module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {
          'test': {
            command: 'mocha-phantomjs -R dot http://localhost:8000/test/unit/index.html',
            options: {
              stdout: true,
              stderr: true
            }
          }
        },

        mochaTest: {
            test: {
                options: {
                  reporter: 'spec',
                  clearRequireCache: true,
                },
                src: ['test/**/*.js']
            },
        },

        mocha_phantomjs: {
          all: {
            options: {
              urls: ['http://localhost:8001/test/unit/index.html']
            }
          }
          // all: ['/test/**/*.html']
        },

        watch: {
          js: {
            options: {
              spawn: true,
              interrupt: true,
              debounceDelay: 250,
              livereload: true
            },
            files: ['Gruntfile.js', 'requireConfig', 'src/**/*.js', 'test/**/*.js'],
            tasks: ['test']
          }
        },


        connect: {
          server: {
            options: {
              port: 8001,
              hostname: '*',
            }
          }
        },

        open : {
          tests: {
            path: 'http://127.0.0.1:8001/test/unit/index.html',
            app: 'Google Chrome'
          },
          // build: {
          //   path : 'http://google.com/',
          //   app: 'Firefox'
          // },
          file : {
            path : '/etc/hosts'
          },
          custom: {
            path : function () {
              return grunt.option('path');
            }
          }
        }

    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');


    grunt.registerTask('default', ['connect', 'open:tests', 'watch', 'mocha_phantomjs']);
    grunt.registerTask('test', ['mocha_phantomjs']);
};