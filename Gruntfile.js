module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-war');
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      war: {
          target: {
              options: {
                  war_dist_folder: '../', 
                  war_name: 'portalMobileWAR'
              },
              files: [
                  {
                      expand: true,
                      cwd: 'www',
                      src: ['**'],
                      dest: ''
                  }
              ]
          }
      }
  });

  grunt.registerTask('default', ['war']);
};