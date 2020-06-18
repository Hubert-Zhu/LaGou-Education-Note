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
let ex1 = () => {
    return maybe.map((arr) => fp.map(fp.add(1), arr))
}

/* 三 练习2 */
let ex2 = () => {
    return xs.map((arr)=>fp.first(arr))
}

/* 三 练习3 */
let ex3 = () => {
    let str = safeProp('name', user)//Maybe._value = "Albert"
    return str.map(function (args) { return fp.first(args.split("")) })
}

/* 三 练习4 */
let ex4 = function (n) {
    return n ? parseInt(n) : undefined
}

/* 四 */

//状态
const PENDING = 'pending'
const FULFUILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {

	//构造函数，开始构建MyPromise如果有问题直接reject
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
        while (this.successCallback.length) {
            this.successCallback.shift()();
        }
    }

    reject = (reason) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED
        this.reason = reason
        while (this.failCallback.length) {
            this.failCallback.shift()();
        }

    }
    
    then(successCallback, failCallback) {

    	//让结果更顺利的传递，例如then-catch的时候，可以顺利传递到catch中
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : reason => { throw reason };

        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFUILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value)
                        //检查是否自己返回了自己
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
    //resolve快捷方法
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
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise










