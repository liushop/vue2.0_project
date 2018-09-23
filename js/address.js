new Vue({
    el: ".container",
    data: {
        //存所有数据
        addressList: [],
        //默认显示3条数据
        limitNum: 3,
        //当前点击的哪个地址
        currentIndex: 0,
        //配送方式状态
        shippingMethod:1
    },
    mounted: function () {
        //页面加载完毕后执行
        this.$nextTick(function () {
            this.getAddressList();
        })
    },

    methods: {
        //请求数据
        getAddressList: function () {
            var _this = this;
            this.$http.get("data/address.json").then(function (res) {
                //console.log(res);
                var data = res.data;
                if (data.status == "0") {
                    _this.addressList = data.result;
                }
            })
        },

        //更多-more
        loadMore: function () {
            this.limitNum = this.addressList.length;
        },

        //设为默认
        setDefault: function (addressId) {
            this.addressList.forEach(function (address, index) {
                if (address.addressId == addressId) {
                    address.isDefault = true;
                } else {
                    address.isDefault = false;
                }
            })
        }

    },

    //刚开始只显示前3个地址-过滤
    computed: {
        filterAddress: function () {
            //返回一个新的数据，与之前不冲突
            return this.addressList.slice(0, this.limitNum);
        }

    },


})