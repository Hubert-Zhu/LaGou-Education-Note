# 简答题 
## 谈谈你是如何理解JS异步编程的？
#### JavaScript本身是单线程的。当我们要处理A、B两件事情并得到结果的时候，我们主线程（执行栈）只能先做A，等A做完之后才开始做B。但有一旦A的请求需要等待，这就出了大问题，这时候CPU也没有在工作，因为没有在处理任务。异步编程提供了一个很好的方案，对于某些需要响应，或者需要时间等待的任务，我们先将他们挂在“任务对列上”（主线程之外）。这时候我们就可以让事件等待响应。一旦事件可以执行之后，我们就把它放入“任务队列之中“。在执行栈清空之后，他们这些在任务队列就会立马被主线程回调且执行。
## EventLoop和消息队列？
#### EventLoop是一种运行机制，他让主线程在清空的时候检查消息队列，如果消息队列有任务，它会将其放在主线程上运行。
#### 消息队列也叫任务队列。他们一般都放着挂异步的任务。一般这放在这个这里的任务都需要等待（比如链接、setTimeOut等），当等待结束，可以被执行的时候，我们就把它们放入任务队列中。等待执行栈清空，它们就可以被回调。
## 什么是宏任务什么是微任务？
#### 它们都是异步任务。一般eventloop都是先执行一个宏任务，在执行完完成之后，检查是否有微任务。如果有，则执行微任务。如果没有，则开启一个新的宏任务
