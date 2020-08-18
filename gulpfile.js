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
      html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
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

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersyns = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  group_media = require("gulp-group-css-media-queries"),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  webp = require("gulp-webp"),
 // webphtml = require('gulp-webp-html'); на этом шаге перестало работать
    
  

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
     .pipe(fileinclude())
     //.pipe(webphtml()) //здесь перестает работать.
     .pipe(dest(path.build.html))
     .pipe(browsersyns.stream())
}

function css() {
   return src(path.src.css)
     .pipe(
       scss({
         outputStyle: "expanded",
       })
     )
     .pipe(group_media())
     .pipe(
       autoprefixer({
         overrideBrowserslist: ["last 5 versions"],
         cascade: true,
       })
     )
     .pipe(dest(path.build.css))
     .pipe(clean_css())
     .pipe(
       rename({
         extname: ".min.css",
       })
     )
     .pipe(dest(path.build.css))
     .pipe(browsersyns.stream())
     
}

function js() {
   return src(path.src.js)
     .pipe(fileinclude())
     .pipe(dest(path.build.js))
     .pipe(uglify())
     .pipe(
       rename({
         extname: ".min.js",
       })
     )
     .pipe(dest(path.build.js))
     .pipe(browsersyns.stream())
}

function images() {
  return src(path.src.img)
   .pipe(
     webp({
         quality: 70
    })
  )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
         imagemin({
           progressive: true,
           svgoPlugins: [{ removeViewBox: false }],
           interlaced: true,
           optimizationLevel: 3, // 0 to 7
         })
       )
       .pipe(dest(path.build.img))
       .pipe(browsersyns.stream())
}

function watchFiles(params) {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
}

function clean(params) {
   return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js,css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSyns);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;