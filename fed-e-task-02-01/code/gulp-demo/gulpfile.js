// 实现这个项目的构建任务
const { src, dest, parallel, series, watch } = require("gulp");
const del = require("del");
const browserSync = require("browser-sync");
const loadPlugins = require("gulp-load-plugins");
const { notify } = require("browser-sync");

//自动加载所有gulp插件
const plugins = loadPlugins();
//开发服务器
const bs = browserSync.create();

const data = {
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
};

//每次导入之前清空一次
const clean = () => {
  return del(["dist", "temp"]);
};

//转化scss -> css
//如果文件是_开头，我们认为是这被依赖的文件，不进行转
const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"));
};

//脚本处理 实现向下兼容
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"));
};

//swig
//html模版编译
const page = () => {
  return src("src/**.html", { base: "src" })
    .pipe(plugins.swig())
    .pipe(dest("temp"));
};

//压缩图片
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

//压缩字体
const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

//复制public中的文件
const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

//配置服务器
const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  // watch("src/assets/images/**", image)
  // watch("src/assets/fonts/**", font)
  // watch("public/**", extra)
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  bs.init({
    notify: false,
    port: 8080,
    files: "dist/**", //监听的对象。可以用 .pipe(bs.reload( {stream: true}))以流的方式推（在么个事件后面）

    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules", //构建临时路由映射（只有本地好使）
      },
    },
  });
};

//src有一些东西是要用node_modules里面的文件。这会导致launch之后找不到文件。我们要用useref来解决这个问题
//node_modules找到源文件之后复制也行，但是太low了
const useref = () => {
  return src("temp/*.html", { base: "temp" })
    .pipe(plugins.useref({ searchPath: ["temp", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(
      plugins.if(
        /\.html$/,
        plugins.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest("dist"));
};

//合并任务
const compile = parallel(style, script, page);
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);
const develop = series(compile, serve);

module.exports = {
  compile,
  build,
  serve,
  useref,
};
