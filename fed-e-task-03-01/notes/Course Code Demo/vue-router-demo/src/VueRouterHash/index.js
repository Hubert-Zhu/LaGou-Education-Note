let _Vue = null

//这tm是什么东西给？
export default class VueRouter{
    static install(Vue){
        // 1. 判断当前插件是否已经被安装
        if( VueRouter.install.installed ){
            return
        }

        Vue.install.installed = true
        // 2. 把Vue构造函数记录到全局变量
        _Vue = Vue

        // 3. 把创建Vue实例的时候传入的router对象注入到Vue实例上
        // 混入
        _Vue.mixin({
            beforeCreate (){
                _Vue.prototype.$router = this.$options.router
                this.$options.router.init()
            }
        })
    }

    constructor(options){
        this.options = options
        this.routeMap = {}
        this.data = _Vue.observable({
            current: '/'
        })
    }

    init(){
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }

    createRouteMap(){
        //遍历所有的路由规则，把路由规则解析成键值对的形式 存储到routeMap中
        this.options.route.forEach( route => {
            this.routeMap[route.path] = route.component
        })
    }

    initComponents(Vue){
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h){
                return h('a',{
                    attrs:{
                        href: '#' + this.to
                    },
                    on:{
                        click: this.clickHandler
                    }
                },[this.$slot.default])
            },
            methods:{
                clickHandler(e){
                    history.pushState({}, '', '#' + this.to)
                    this.$router.data.current = this.to
                    e.preventDefault()
                }
            }
        })


        const self = this
        Vue.component('router-view', {
            render(h){
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    initEvent() {
        window.addEventListener('popstate',() => {
            this.data.current = windows.location.pathname
        })

        window.addEventListener('hashchange',()=>{
            this.data.current = window.location.hash.slice(1)
        })
        
    }




}