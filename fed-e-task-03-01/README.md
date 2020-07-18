# 简答题 
## 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
#### 
初始化参数
初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始编译
根据配置，识别入口文件；
逐层识别模块依赖（包括 Commonjs、AMD、或 ES6 的 import 等，都会被识别和分析）；
Webpack 主要工作内容就是分析代码，转换代码，编译代码，最后输出代码；
输出最后打包后的代码。


## Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
#### 
Loader专注实现资源模块加载。Plugin解决项目的其他i自动化作用，比如清楚dist目录，拷贝静态文件至输出目录，压缩输出代码。
Loader本质就是一个函数，在该函数中对接收到的内容（参数）进行转换，返回转换后的结果。多个loader可以一块处理文件（链式调用）。最终输出的时候需要时JavaScript，因为Webpack只认识JavaScript。Loader 运行在 Node.js 中，我们可以调用任意 Node.js 自带的 API 或者安装第三方模块进行调用。Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串。Loader 是无状态的，我们不应该在 Loader 中保留状态


Plugin：
compiler暴露了和Webpack整个生命周期相关的钩子compilation。暴露了与模块和依赖有关的粒度更小的事件钩子。
插件需要在其原型上绑定apply方法，才能访问 compiler 实例传给每个插件的 compiler 。 compilation对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件找出合适的事件点去完成想要的功能（有一点不清楚）
