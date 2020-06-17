/*简答题 
谈谈你是如何理解JS异步编程的？
    JavaScript本身是单线程的。当我们要处理A、B两件事情并得到结果的时候，我们主线程（执行栈）只能先做A，等A做完之后才开始做B。
    但有一旦A的请求需要等待，这就出了大问题，这时候CPU也没有在工作，因为没有在处理任务。异步编程提供了一个很好的方案，对于某些需要响应，
    或者需要时间等待的任务，我们先将他们挂在“任务对列上”（主线程之外）。这时候我们就可以让事件等待响应。一旦事件可以执行之后，我们就把
    它放入“任务队列之中“。在执行栈清空之后，他们这些在任务队列就会立马被主线程回调且执行。
EventLoop和消息队列？
    EventLoop是一种运行机制，他让主线程在清空的时候检查消息队列，如果消息队列有任务，它会将其放在主线程上运行。
    消息队列也叫任务队列。他们一般都放着挂异步的任务。一般这放在这个这里的任务都需要等待（比如链接、setTimeOut等），当等待结束
    可以被执行的时候，我们就把它们放入任务队列中。等待执行栈清空，它们就可以被回调。
什么是宏任务什么是微任务？
    它们都是异步任务。一般eventloop都是先执行一个宏任务，在执行完完成之后，检查是否有微任务。如果有，则执行微任务。如果没有，则开启一个新的
    宏任务
*/

/*代码题 一、使用Promise改进代码*/

const promise = new Promise((resolve, reject) => {
    setTimeout(function () {
        let a = 'hello'
        resolve(a)
    }, 10)
})
promise.then((value) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            let b = 'lagou'
            resolve(value + b)
        }, 10);
    })
}).then((value) => {
    setTimeout(function () {
        let c = 'I ❤ U'
        console.log(value + c)
    }, 10)
})

/* 二 练习1 */
let isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)

/* 二 练习2 */
let isFirstName = fp.flowRight(fp.prop('name'), fp.first)
let result = isFirstName(cars)

/* 二 练习3 */
let averageDollarValue = fp.flowRight(_avergae, fp.map(funciton(car){ return car.dollar_value }))

/* 二 练习4 */
const sanitizeNames = fp.map((str) => fp.flowRight(_underscore, fp.toLower(str)))

/* 三 练习1 */
let ex1 = (args) => {
    return maybe.map(function (args) {
        fp.map(fp.add(1), args)
    })
}

/* 三 练习2 */
let ex2 = (xs) => {
    return xs.map(fp.first)
}

/* 三 练习3 */
let ex3 = (user) => {
    let str = safeProp('name', user)//Maybe._value = "Albert"
    return str.map(function (args) { return fp.first(args.split("")) })
}

/* 三 练习4 */
let ex4 = function (n) {
    return n ? parseInt(n) : undefined
}

/* 四 */
const PENDING = 'pending'
const FULFUILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }
    
    status = PENDING
    value = undefined  //成功之后的值
    reason = undefined //失败之后的值
    successCallback = []//成功的回调
    failCallback = []//失败的回调

    resolve = (value) => {
        if (this.status !== PENDING) return;
        this.status = FULFUILLED
        this.value = value
        //this.successCallback && this.successCallback(this.value)//如果成功回调存在 就调用
        while (this.successCallback.length) {
            this.successCallback.shift()();
        }
    }

    reject = (reason) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED
        this.reason = reason
        //this.failCallback && this.successCallback(this.reason)
        while (this.failCallback.length) {
            this.failCallback.shift()();
        }

    }
    
    then(successCallback, failCallback) {
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => { throw reason };
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFUILLED) {

                setTimeout(() => {
                    try {
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                        console.log(promise2 === x);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                        console.log(promise2 === x);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)

            } else {
                //等待 将成功回调和失败回调存储起来

                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)

                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)

                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })

        return promise2
    }

    finally(callback){
        return this.then((value)=>{
            return MyPromise.resolve(callback().then(()=>value))
        }, (reason)=>{
            return MyPromise.resolve(callback().then(()=>{throw reason}))
        })
    }
    catch (failCallback){
        return this.then(undefined, failCallback)
    }
    static all (array) {
        let result = []
        let index = 0
        
        return new MyPromise((resolve, reject)=>{
            function addData(key, value){
                result[key] = value
                index++
                if(index === array.length){
                    resolve(result)
                }
            }

            for (let i = 0; i < array.length; i++){
                let curreent = array[i]
                if(curreent instanceof MyPromise){
                    curreent.then((value)=>{
                        addData(i, value)
                    }, (reason)=>{
                        reject(reason)
                    })
                }else{
                    addData(i, array[i])
                }
            }
            resolve(result)
        })
    }
    static resolve (value) {
        if(value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value))
    }
    
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Changing cycle detected for promise #<Promise>'))
    }

    if (x instanceof MyPromise) {
        //x.then((value)=>{resolve(value)},(error)=>{reject(error)})
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise










