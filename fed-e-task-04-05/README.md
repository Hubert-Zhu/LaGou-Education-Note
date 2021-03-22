
# 简答题 
## 1.通过该项目，请简要说明 typescript 比 javascript 的优势在哪？

1. 静态类型检查，可维护性更强
2. 可以在编译找到项目的数据bug
3. 因为有接口和类型，让新加入的开发人员更容易上手


## 2. 请简述一下支付流程
发送支付请求到服务器（携带支付信息） ==> 服务器接收请求，向支付平台发送请求(携带支付信息，和支付结束后的跳转地址) ==> 支付平台相应，返回付款结果 ==> 根据返回结果生成返回给客户端的结果 => 客户端对应返回来的结果进行相应的页面跳转

## 3. react-redux 的主要作用是什么，常用的 api 有哪些，什么作用？

1. react-react 提供了Hooks API来操纵Redux管理工具
2. 具体API有
   1. useSelector 用来获取数据
   2. useDiapatch 用来获取dispatch来 dispatch action
   3. useStore 获取整个store


## 4. .redux 中的异步如何处理？

通过中间件例如 redux-sage 或者 redux-thunk来管理异步。

在store构建的时候，对特定的action进行监听，触发特定的异步方程（Generator）。

将监听回来的结果，进行dispatch，可能触发下一轮异步请求，或者reducer内的方程进行处理。

最终根据action 和 payload 更新state