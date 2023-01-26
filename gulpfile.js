const { src, dest, series, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'));   //Sass компилятор
const csso = require('gulp-csso');                    //Минификация css
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat');                // Объединение набора файлов в один
const autoprefixer = require('gulp-autoprefixer');   // Добавление вендорных префиксов
const sync = require('browser-sync').create();

// const html = {
//   production: function () {
//     return src('src/**.html')
//       .pipe(include({
//         prefix: '@@'
//       }))
//       .pipe(htmlmin({
//         collapseWhitespace: true
//       }))
//       .pipe(dest('dist'))
//   }
// }

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
};

function scss() {
  return src('src/scss/**scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
};

function clear() {
  return del('dist')
};

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
};

exports.build = series(clear, scss, html);          //Для продакшена
exports.dev = series(clear, scss, html, serve);   //Для разработки
exports.clear = clear;

