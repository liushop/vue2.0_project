var vm = new Vue({
    el: "#app",
    data: {
        //商品
        goodsList: [],
        //总金额
        sumMoney: 0,
        //总付款金额
        totalMoney: 0,
        //全选
        checkAllFlag: false,
        //删除对话框状态
        delFlag: false,
        //点击删除按钮存放数据
        curProduct: ""
    },
    //过滤器，加上¥
    filters: {
        formatMoney: function (value) {
            return "¥" + value.toFixed(2);
        }
    },
    mounted: function () {
        this.goData();
    },
    methods: {
        goData: function () {
            //this永远指向实例的vue的vm，但是在函数内部已经发生了改变
            _this = this;
            this.$http.get("data/cartData.json").then(function (res) {
                //res不是直接的数据，$http又封装了一层
                //console.log(res);
                _this.goodsList = res.body.result.list;
                _this.sumMoney = res.body.result.totalMoney;
            })
        },

        //操作商品数量
        //code 1 加 -1减
        goNum: function (item, code) {
            if (code > 0) {
                item.productQuantity++;
            } else {
                item.productQuantity--;
                if (item.productQuantity < 1) {
                    item.productQuantity = 1;
                }
            }
            //计算总付款金额
            this.calcTotalPrice();
        },

        //商品是否选中
        goSelect: function (item) {
            //data里面没有checked,可以设置
            if (typeof item.checked == "undefined") {
                //全局监听
                //Vue.set(item,"checked",true)
                //局部监听
                this.$set(item, "checked", true);
            } else {
                //如果已有checked代表已选中，取反
                item.checked = !item.checked;
            }
            //选中商品时，计算总付款金额
            this.calcTotalPrice();

        },

        //全选
        checkAll: function () {
            this.checkAllFlag = !this.checkAllFlag;
            var _this = this;
            this.goodsList.forEach(function (item, index) {
                if (typeof item.checked == "undefined") {
                    _this.$set(item, "checked", _this.checkAllFlag);
                } else {
                    item.checked = _this.checkAllFlag;
                }
            })
            //计算总付款金额
            this.calcTotalPrice();
        },

        //付款总金额
        calcTotalPrice: function () {
            var _this = this;
            //每次计算将总金额清0
            _this.totalMoney = 0;
            this.goodsList.forEach(function (item, index) {
                if (item.checked) {
                    _this.totalMoney += item.productPrice * item.productQuantity
                }
            })
        },

        //删除按钮
        delConfirm: function (item) {
            this.delFlag = true;
            //当前点击的存起来，删除时候使用
            this.curProduct = item;
        },

        //点击按钮 yes
        goDel: function () {
            //这里按说是后台数据，现在用数组模拟数据
            var index = this.goodsList.indexOf(this.curProduct);
            this.goodsList.splice(index, 1);
            //删除成功后将其隐藏
            this.delFlag = false;

        }

    }
});

//全局过滤（过滤器名称，回调函数）
Vue.filter("money", function (value, type) {
    return "¥" + value.toFixed(2) + type;
})