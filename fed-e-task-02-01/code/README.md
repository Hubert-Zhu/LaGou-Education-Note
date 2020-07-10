视频 有时间补上

## NodeJS完成手脚架
#### 
我这里做的手脚架很简单，只是简单的做了一个template文件夹，里面有index.html, style.css, index.js。只是十分简单的文件架构。启动手脚架用
```
cd NodeScaffloding-demo
node node-cli.js
```


## Gulp完成自动化构建
#### 
主要的任务有complies, build，develop。
compile中：转化sass变css，用babel做向下兼容，解析html中的ejs添加上我们想要的的data。
build中：文件初始化清理；compile，压缩html、css、js、图片、字体；最后进行public文件拷贝

## Grunt完成自动化构建
#### 
跟上面一摸一样
