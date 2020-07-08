const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");
const mozjpeg = require("imagemin-mozjpeg");
const browserSync = require("browser-sync").create();

module.exports = (grunt) => {
  grunt.initConfig({
    clean: {
      release: ["dist","temp"],
    },
    sass: {
      options: {
        implementation: sass,
      },
      main: {
        files: {
          "temp/assets/styles/main.css": "src/assets/styles/main.scss",
        },
      },
    },
    babel: {
      options: {
        presets: ["@babel/preset-env"],
      },
      main: {
        files: {
          "temp/assets/scripts/main.js": "src/assets/scripts/main.js",
        },
      },
    },
    swigtemplates: {
      options: {
        defaultContext: {
          menus: [
            {
              name: "Home",
              icon: "aperture",
              link: "index.html",
            },
            {
              name: "Features",
              link: "features.html",
            },
            {
              name: "About",
              link: "about.html",
            },
            {
              name: "Contact",
              link: "#",
              children: [
                {
                  name: "Twitter",
                  link: "https://twitter.com/w_zce",
                },
              ],
            },
          ],
          pkg: require("./package.json"),
          date: new Date(),
        },
      },
      production: {
        dest: "temp",
        src: ["src/**/**.html"],
      },
    },
    imagemin: {//image+font
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "src/assets/",
            src: ["{fonts,images}/*"],
            dest: "dist/",
          },
        ],
      },
    },
    copy: {
      main: {
        files: [
          // includes files within path
          { expand: true, src: ["public/*"], dest: "dist/" },
        ],
      },
    },
    watch: {
      sass:{
        files: 'src/assets/styles/*.scss',
        tasks: ['sass']
      },
      script:{
        files: 'src/assets/scripts/*.js',
        tasks: ['babel']
      },
      page:{
        files:"src/*.html",
        tasks: ['swigtemplates']
      },
      imagefontmin:{
        files:["src/assets/images/**","src/assets/fonts/**"],
        tasks:['imagefontmin']
      },
      extra:{
        files:"public/**",
        task:['copy']
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['dist/**']
        },
        options: {
          watchTask: true,
          server: './app'
        }
      }
    },
    useref: {
      // specify which files contain the build blocks
      html: "dist/**/*.html",
      // explicitly specify the temp directory you are working in
      // this is the the base of your links ( "/" )
      // temp: "dist/",
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: [
          {
            expand: true,
            cwd: "temp",
            src: "**/*.html",
            dest: "dist",
          },
        ],
      },
    },
    uglify: {
      my_target: {
        files: {
          "dist/assets/scripts/main.min.js": "temp/assets/scripts/main.js",
        },
      },
    },
    cssmin: {
      target: {
        files: [
          {
            expand: true,
            cwd: "temp/assets/styles",
            src: ["*.css", "!*.min.css"],
            dest: "dist/assets/styles",
            ext: ".min.css",
          },
        ],
      },
    },
    // concurrent: {
    //   target1: ["imagefontmin", "copy"],
    // },
  });

  loadGruntTasks(grunt);
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask("imagefontmin", ["imagefontmin"]);

  grunt.registerTask('serve',['browserSync','watch']);
  grunt.registerTask('userefPack', ['useref', 'uglify', 'cssmin','htmlmin'])
  grunt.registerTask("compile", ["sass", "babel", "swigtemplates"]);
  grunt.registerTask("build", ["clean", "compile", "userefPack",'imagemin',"copy"]);
  grunt.registerTask("develop", ["compile", "serve"]);
};
