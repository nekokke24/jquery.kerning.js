module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    watch:
      files: ['**/*.coffee']
      tasks: ['coffee','uglify']
    coffee:
      compile:
        files: [
          expand: true
          cwd: 'script/_src/'
          src: ['**/*.coffee']
          dest: 'script/'
          ext: '.js'
        ]
    uglify:
      compress_target:
        options:
          sourceMap: (fileName) ->
            fileName.replace /\.js$/, '.js.map'
        files: [
          expand: true
          cwd: 'script/'
          src: ['**/*.exp.js']
          dest: 'script/'
          ext: '.min.js'
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.registerTask 'default', ['watch']
  return
