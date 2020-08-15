let project_folder="dist";
let source_folder = "#src";

let path = {
   build: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      fonts: project_folder + "/fonts/",
   },
   src: {
      html: source_folder + "/*.html",
      css: source_folder + "/scss/style.scss",
      js: source_folder + "/js/js.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: source_folder + "/fonts/*.ttf",
   },
   watch: {
      html: source_folder + "/**/*.html",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
   },
   clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
gulp = require ('gulp'),
browsersyns = require("browser-sync").create();

function browserSyns(params) {
   browsersyns.init({
      server:{
         baseDir: "./" + project_folder + "/"
      },
      port: 3000,
      notify:false
   })
}

function html() {
   return src(path.src.html)
      .pipe(dest(path.build.html))
      .pipe(browsersyns.stream())
}

let build = gulp.series(html);
let watch = gulp.parallel(browserSyns);

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
