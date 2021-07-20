<template>
    <div class="device-container">
<!--        <el-button @click="print()">打印</el-button>-->
        <div style="display: none;">
            <canvas id="canvas" width="0" height="0"></canvas>
            <canvas id="canvas2" width="0" height="0"></canvas>
            <canvas id="canvas3" width="0" height="0"></canvas>
            <canvas id="canvas4" width="0" height="0"></canvas>
            <!--      <div id="qrcode" ref="qrcode"></div>-->
        </div>
        <!--    <img style="width: 300px;height: 300px;" src="https://api.qrserver.com/v1/create-qr-code?data=https://6441ace61742439ba654b9f399be07e8-cn-hangzhou-vpc.alicloudapi.com/uinvoice/apply?BC=30006&CA=2500&CN=858011511841358848&NC=3351&SN=ums001&TN=0&TS=1625219365820&AS=6B4A3FEE23DC89235005C7802D7984DF" >-->
        <div style="display: none;" class="qrcode" id="qrcode" ref="qrcodeContainer"></div>
        <img style="display: none;" id="barcode"/>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2'  // 引入qrcode
    import jsbarcode from 'jsbarcode'
    import {shopDetail,orderDetail,orderSync} from "@/api/index"
    export default {
        name: 'Device',
        data(){
            return{
                crypto:false,
                buffer:false,
                printer:null,
                ipAddress:'192.168.31.181',
                port:null,
                ePosDev:new epson.ePOSDevice(),
                shopList:[],
                orderdetail:{},
                thisShop:{},
                payable_amount:'',
                paid:'',
                payMent:'',
                qrCode:'https://6441ace61742439ba654b9f399be07e8-cn-hangzhou-vpc.alicloudapi.com/uinvoice/apply?BC=30006&CA=2500&CN=858011511841358848&NC=5444&SN=ums001&TN=0&TS=1625449935111&AS=88B8797A99AC39A5E0036EE33878AE65',
                baseUrl:'',
                barcode:'',
                // id:''
                id:'858011511841358848'
            }
        },
        props: {
            // id: String,
        },
        methods: {
            print(){
                this.sendMessageSelf()
            },
            connect() {
                let canvas;
                let canvas2;
                let canvas3;
                let canvas4;

                var ePosDev = this.ePosDev
                console.log(ePosDev)
                var ipAddress = '192.168.31.181'
                var port = '9100'

                ePosDev.connect(ipAddress, port, this.Callback_connect);
                ePosDev.onreconnecting = this.OnReconnecting;
                ePosDev.onreconnect = this.OnReconnect;
                ePosDev.ondisconnect = this.OnDisconnect;
                canvas = document.getElementById('canvas');
                canvas2 = document.getElementById('canvas2');
                canvas3 = document.getElementById('canvas3');
                canvas4 = document.getElementById('canvas4');


                let image = new Image();
                // image.src = 'https://testoss.functionradian4.com/harmay/harmayCS/1.png';
                image.src = require("../images/1.png");
                image.onload = function () {
                    if (canvas.getContext) {
                        canvas.width = image.width;
                        canvas.height = image.height;
                        let context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0);
                    }
                }

                let image2 = new Image();
                // image2.src = 'https://testoss.functionradian4.com/harmay/harmayCS/2-300.png';
                // image2.src = require("../images/2.png");
                image2.src = this.baseUrl
                image2.onload = function () {
                    if (canvas2.getContext) {
                        canvas2.width = image2.width;
                        canvas2.height = image2.height;
                        let context = canvas2.getContext('2d');
                        context.drawImage(image2, 0, 0);
                    }
                }

                let image3 = new Image();
                // image3.src = 'https://testoss.functionradian4.com/harmay/harmayCS/3.png';
                image3.src = require("../images/3.png");
                image3.onload = function () {
                    if (canvas3.getContext) {
                        canvas3.width = image3.width;
                        canvas3.height = image3.height;
                        let context = canvas3.getContext('2d');
                        context.drawImage(image3, 0, 0);
                    }
                }

                let image4 = new Image();
                // image4.src = 'https://testoss.functionradian4.com/harmay/harmayCS/4.png';
                // image4.src = require("../images/4.png");
                image4.src = this.barcode
                image4.onload = function () {
                    if (canvas4.getContext) {
                        canvas4.width = image4.width;
                        canvas4.height = image4.height;
                        let context = canvas4.getContext('2d');
                        context.drawImage(image4, 0, 0);
                    }
                }

            },
            Callback_connect(data) {
                console.log('打印data')
                console.log(data)
                var ePosDev = this.ePosDev
                var deviceID = 'bananalab_epos'
                // crypto       = document.getElementById("crypto").checked;
                // buffer       = document.getElementById("buffer").checked;
                var options  = {'crypto' : this.crypto, 'buffer' : this.buffer};

                if (data == 'OK') {
                    // consolelog("connected to ePOS Device Service Interface.", true);
                    ePosDev.createDevice(deviceID, ePosDev.DEVICE_TYPE_PRINTER, options, this.callbackCreateDevice_printer);
                }
                else if (data == 'SSL_CONNECT_OK') {
                    // consolelog("connected to ePOS Device Service Interface with SSL.", true);
                    ePosDev.createDevice(deviceID, ePosDev.DEVICE_TYPE_PRINTER, options, this.callbackCreateDevice_printer);
                }
                else {
                    // consolelog("connected to ePOS Device Service Interface is failed. [" + data + "]", true);
                }
            },
            callbackCreateDevice_printer(data, code) {
                console.log('打印data222')
                console.log(data)
                var printer= this.printer
                if (data == null) {
                    // consolelog(code);
                    return;
                }

                // consolelog("you can use printer.");

                printer = data;

                // Set a response receipt callback function
                printer.onreceive = function (res) {
                    // Show message
                    // consolelog('Print' + (res.success ? 'Success' : 'Failure') + '\nCode:' + res.code + '\nBattery:' + res.battery + '\n' + getStatusText(printer, res.status), true);
                };
                // Set a status change callback funciton
                printer.onstatuschange = function (status) {
                    if (document.getElementById('onstatuschange').checked) {
                        alert(getStatusText(printer, status));
                    }
                };
                printer.ononline = function () {
                    if (document.getElementById('ononline').checked) {
                        alert('online');
                    }
                };
                printer.onoffline = function () {
                    if (document.getElementById('ononline').checked) {
                        alert('offline');
                    }
                };
                printer.onpoweroff = function () {
                    if (document.getElementById('ononline').checked) {
                        alert('poweroff');
                    }
                };
                printer.oncoverok = function () {
                    if (document.getElementById('oncoverok').checked) {
                        alert('coverok');
                    }
                };
                printer.oncoveropen = function () {
                    if (document.getElementById('oncoverok').checked) {
                        alert('coveropen');
                    }
                };
                printer.onpaperok = function () {
                    if (document.getElementById('onpaperok').checked) {
                        alert('paperok');
                    }
                };
                printer.onpapernearend = function () {
                    if (document.getElementById('onpaperok').checked) {
                        alert('papernearend');
                    }
                };
                printer.onpaperend = function () {
                    if (document.getElementById('onpaperok').checked) {
                        alert('paperend');
                    }
                };
                printer.ondrawerclosed = function () {
                    if (document.getElementById('ondrawerclosed').checked) {
                        alert('drawerclosed');
                    }
                };
                printer.ondraweropen = function () {
                    if (document.getElementById('ondrawerclosed').checked) {
                        alert('draweropen');
                    }
                };
                printer.onbatterystatuschange = function () {
                    if (document.getElementById('onbatterystatuschange').checked) {
                        alert('onbatterystatuschange');
                    }
                };
                printer.onbatteryok = function () {
                    if (document.getElementById('onbatteryok').checked) {
                        alert('onbatteryok');
                    }
                };
                printer.onbatterylow = function () {
                    if (document.getElementById('onbatteryok').checked) {
                        alert('onbatterylow');
                    }
                };
                this.printer = printer
            },
            sendMessageSelf() {
                // var qrcode = document.getElementById('qrcode');
                // var canvas5 = qrcode.getElementsByTagName('canvas')
                console.log(this.printer)
                var printer = this.printer
                printer.addTextLang('zh-cn');
                printer.addTextFont(printer.FONT_B);
                printer.addTextSmooth(true);

                printer.addTextPosition(0);
                printer.addText(this.orderdetail.pay_time);
                printer.addTextPosition(450);
                printer.addText('店员\n');
                printer.addText('--------------------------------------------------------------\n');
                printer.addTextPosition(330);
                printer.addText(this.orderdetail.operator.padStart(20, ' ')+'\n');

                printer.brightness = 1.0;
                printer.halftone = printer.HALFTONE_DITHER;
                printer.addImage(canvas.getContext('2d'), 0, 0, canvas.width, canvas.height, printer.COLOR_1, printer.MODE_MONO);


                for(var i = 0;i<this.orderdetail.goods_list.length;i++){
                    printer.addText('\n\n');
                    printer.addTextPosition(0);
                    printer.addText('AESDP');
                    printer.addTextPosition(100);
                    printer.addText(this.orderdetail.goods_list[i].goods_name);
                    printer.addTextPosition(350);
                    printer.addText(this.orderdetail.goods_list[i].price);
                    printer.addTextPosition(450);
                    printer.addText('CNY\n');
                    printer.addTextPosition(0);
                    printer.addText(this.orderdetail.goods_list[i].spec_name);
                    printer.addTextPosition(350);
                    printer.addText('x'+this.orderdetail.goods_list[i].num+'\n');
                    printer.addText('\n');
                }


                printer.addText('\n\n');
                printer.addTextSize(2, 2);
                printer.addText('TOTAL\n');
                printer.addTextSize(1, 1);
                printer.addText('--------------------------------------------------------------\n');
                printer.addText('\n');

                printer.addTextPosition(0);
                printer.addText('应付金额');
                printer.addTextPosition(395);
                printer.addText(('￥'+this.payable_amount).padStart(11, ' ')+'\n');
                printer.addTextPosition(0);
                printer.addText('折扣金额');
                printer.addTextPosition(440);
                printer.addText('0'.padStart(7, ' ')+'\n');
                printer.addTextPosition(0);
                printer.addText('积分抵扣');
                printer.addTextPosition(386);
                printer.addText('￥0'.padStart(12, ' ')+'\n');
                printer.addTextPosition(0);
                printer.addText('积分兑换');
                printer.addTextPosition(417);
                printer.addText('0'.padStart(7, ' ')+'颗\n');

                printer.addTextStyle(false, false, true, printer.COLOR_1);
                printer.addTextPosition(0);
                printer.addText('实付金额');
                printer.addTextSize(2, 2);
                printer.addTextPosition(300);
                printer.addText(('￥'+this.paid).padStart(11, ' ')+'\n');

                printer.addTextSize(1, 1);
                printer.addTextStyle(false, false, false, printer.COLOR_1);
                printer.addText('--------------------------------------------------------------\n');
                printer.addText('付款方式：'+this.payMent+'\n');
                printer.addText('--------------------------------------------------------------\n');
                printer.addText('\n\n');

                printer.addTextAlign(printer.ALIGN_CENTER);
                printer.addText('请使用微信扫描二维码开具发票\n');
                printer.addText('\n');

                printer.brightness = 1.0;
                printer.halftone = printer.HALFTONE_DITHER;
                printer.addImage(canvas2.getContext('2d'), 0, 0, canvas2.width, canvas2.height, printer.COLOR_1, printer.MODE_MONO);

                // printer.addText('\n');
                // printer.addText('请使用微信扫描二维码免费快递到家\n');
                // printer.addText('\n');

                // printer.brightness = 1.0;
                // printer.halftone = printer.HALFTONE_DITHER;
                // printer.addImage(canvas3.getContext('2d'), 0, 0, canvas3.width, canvas3.height, printer.COLOR_1, printer.MODE_MONO);

                printer.addText('\n');
                printer.addText(this.orderdetail.tid+'\n');

                // printer.addText('\n');
                printer.brightness = 1.0;
                printer.halftone = printer.HALFTONE_DITHER;
                printer.addImage(canvas4.getContext('2d'), 0, 0, canvas4.width, canvas4.height, printer.COLOR_1, printer.MODE_MONO);

                printer.addText('\n');
                printer.addText('"颗"为话梅积分单位\n');
                printer.addText('出于商务卫生安全考虑，商品离店后非质量问题不支持退货，请您谅解。\n');
                printer.addText('--------------------------------------------------------------\n');

                printer.addTextStyle(false, false, true, printer.COLOR_1);
                printer.addText(this.thisShop.contact+'\n');
                printer.addTextStyle(false, false, false, printer.COLOR_1);
                printer.addText(this.thisShop.county+this.thisShop.address+'\n');

                printer.addText('\n');
                printer.addText('2 WORKERS\' SPORTS COMPLEX N RD,\n');
                printer.addText('CHAOYANG DISTRICT,BEIJING\n');
                printer.addText('\n');

                printer.addText('电话：'+this.thisShop.mobile+'    营业时间：10:00-22:00\n');
                printer.addText('\n\n');

                printer.addCut(printer.CUT_FEED);
                printer.send();
            },
            qrcode(codeUrl) {
                let qrcode = new QRCode(this.$refs.qrcodeContainer, {
                    width: 300,
                    height: 300,
                    text: codeUrl, // 二维码地址
                    colorDark : "#000",
                    colorLight : "#fff",
                    // correctLevel:QRCode.CorrectLevel.H,
                    correctLevel: 3
                })
                let qrcodeUrl = document.getElementById('qrcode').getElementsByTagName('canvas')
                // console.log('打印地址--')
                // console.log(qrcodeUrl[0].toDataURL('image/png'))
                this.baseUrl = qrcodeUrl[0].toDataURL('image/png')
            },
            detail(){
                // console.log('打印---id')
                // console.log(this.id)
                shopDetail(this.id).then(res=>{
                    // console.log(res)
                    this.shopList = res.data
                })

                orderDetail(this.id).then(res=>{
                    // console.log(res)
                    this.orderdetail = res.data.data
                    // console.log('打印订单详情')
                    // console.log(this.orderdetail)
                    // for(var i = 0;i<this.shopList.length;i++){
                    //   if(this.orderdetail.shop_no == this.shopList[i].shop_no){
                    //     this.thisShop = this.shopList[i]
                    //   }
                    // }
                    // console.log('店铺列表')
                    // console.log(this.shopList)
                    this.thisShop = this.shopList[0]
                    this.payable_amount = this.orderdetail.payable_amount.substring(0,this.orderdetail.payable_amount.length-2)
                    this.paid = this.orderdetail.paid.substring(0,this.orderdetail.paid.length-2)
                    if(this.orderdetail.pay_type=='wechat'){
                        this.payMent='微信'
                    }else if(this.orderdetail.pay_type=='alipay'){
                        this.payMent='支付宝'
                    }else if(this.orderdetail.pay_type=='card'){
                        this.payMent='银行卡'
                    }else if(this.orderdetail.pay_type=='cash'){
                        this.payMent='现金'
                    }else if(this.orderdetail.pay_type=='combined'){
                        this.payMent='组合支付'
                    }
                    JsBarcode("#barcode", this.orderdetail.tid, {
                        displayValue:false,//是否在条形码下方显示文字
                    });
                    // console.log(document.getElementById("barcode").src)
                    this.barcode = document.getElementById("barcode").src
                    orderSync().then(res=>{
                        // console.log('打印二维码')
                        // console.log(res.data.data)
                        // document.getElementById('qrcode').innerHTML = ''
                        var codeUrl = res.data.data
                        // this.qrCode(codeUrl)
                        this.qrcode(codeUrl)
                        this.connect()
                    })

                })
            }
        },
        mounted() {
            console.log('进入---1111')
            var that = this
            var t = setTimeout(function () {
                that.detail()
            }, 3000);


        },
        watch:{
            id(){
                console.log('进入---1111')
                var that = this
                var t = setTimeout(function () {
                    that.detail()
                }, 3000);
            }
        }

    }
</script>

<style lang="scss" scoped>
    .device-container {
        padding: 10px;
    }
</style>