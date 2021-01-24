
# 简答题 
## 1.请简述 React 16 版本中初始渲染的流程

1. 初始化渲染：将React元素渲染到页面中，分为两个阶段Render阶段和Commit阶段
   1. render阶段：负责创建Fiber数据结构并未Fiber节点打上标记，标记“当前节点Fiber节点DOM操作”
   2. commit阶段：负责根据Fiber节点标记（effectTage）进行相应的DOM操作


## 2. 为什么 React 16 版本中 render 阶段放弃了使用递归
递归无法中途停止。如果遇到组件数量庞大的情况，组件会一直递归到渲染完成。JavaScript为单线程，递归会一直占用主线程，导致主线程无法在处理其他任务。如果这时候用户进行交互操作，会导致浏览器不反应等不好的用户体验。也会导致页面卡顿，加载慢等问题。

## 3. 请简述 React 16 版本中 commit 阶段的三个子阶段分别做了什么事情

1. 第一子阶段：
   1. DOM操作前；渲染（render）结束后；
   2. 如果fiber对象理由Snapshot的这个effectTag的话，调用类组件中的getSnapShotBeforeUpdate方法
2. 第二子阶段
   1. DOM操作中
   2. 根据EffectTag执行DOM操作（插入，更新，看情况来服务端渲染，删除）
   3. 如果是初次渲染，所有组件以及内部内容一次性添加到页面里面
3. 第三阶段
   1. DOM操作后
   2. 此时的effectTag已经被重置为，表示DOM操作已经完成
   3. 调用生命周期函数和Hook函数
   4. 渲染完成之后的回调函数 做最后的处理


## 4. 请简述 workInProgress Fiber 树存在的意义是什么

背景以及为什么：更新时候，我们要清除掉原有的网页，然后进行渲染新的网页。当页面过于庞大是的时候，就会出现原有网页被清除，但是新的页面却没有渲染完成，从而导致白屏的用户体验问题。

解决方案：双缓存技术（借鉴于canvas动画）。基础架构包含current Fiber 和workInProgressFiber

workInProgress Fiber的意义：current Fiber可以暂时不被删除，浏览器仍有显示。后台workInProgress Fiber在后台渲染构建，当完成的一瞬间，改变fiberRootNode指向。指向workInProgress Fiber, 从而完成无明显视觉间断的更新。