<template>
  <div class="small-ticket-container">
    <div style="display: none;">
      <canvas id="canvas" width="0" height="0"></canvas>
      <canvas id="canvas2" width="0" height="0"></canvas>
      <canvas id="canvas3" width="0" height="0"></canvas>
      <canvas id="canvas4" width="0" height="0"></canvas>
    </div>
    <div style="display: none;" class="qrcode" id="qrcode" ref="qrcodeContainer"></div>
    <img style="display: none;" id="barcode"/>
    <div style="width: 794px;margin: 0 auto;display:none;">
      <img ref="conf0" style="display: none" src="../assets/images/code01.png">
      <img ref="conf2" style="display: none" src="../assets/images/code02.png">
      <img ref="conf3" style="display: none" src="../assets/images/code3.png">
      <img ref="conf4" style="display: none" src="../assets/images/code04.png">
      <canvas id="mycanvas" width="794" height="1020"></canvas>
      <canvas id="mycanvas2" width="794" height="1020"></canvas>
      <canvas id="ticket03" width="794" height="1020"></canvas>
    </div>
  </div>
</template>
<script>
import {setPrint} from "@/api/index"
export default {
  data() {
    return {
      logoWidth: 100,
      setRadio: false,
      base64: ''
    }
  },
  props: {
    goodsTableData: Array
  },
  mounted() {
    this.smallTicket4()
  },
  methods: {
    getPixelRatio(context) {
      const backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    resetDraw() {
      this.setRadio = true
      var canvas = document.getElementById("mycanvas");
      var dataURL = canvas.toDataURL("image/png", 2.0);
      var img = new Image();
      img.src = dataURL
      var _this = this
      img.onload = function(eventObj) {
        // 原始图像的高度
        var originWidth, originHeight;
        originHeight = img.height;
        originWidth = img.width;
        // 最大尺寸限制
        var maxWidth = 1476;
        var maxHeight = 2078;
        // 目标尺寸
        var targetWidth = img.width;
        var targetHeight = img.height;
        // 等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 要求宽度*(原生图片比例)=新图片尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        var ctx = canvas.getContext("2d");
        const ratio = _this.getPixelRatio(ctx);
        console.log(ratio);
        // canvas.width = originWidth * 1.85;
        // canvas.height = originHeight * 2;
        canvas.width = originWidth * ratio;
        canvas.height = originHeight * ratio;
        // 清除画布上在该矩形区域内的内容
        ctx.clearRect(0, 0, originWidth, originHeight);
        // var resultTicket = document.getElementById("resultTicket");
        // var ctx = resultTicket.getContext("2d");
        ctx.drawImage(
          img,  // 目标图片
          0, // 原始图片的x起始位置
          0, // 原始图片的y起始位置
          originWidth, // 取图片的宽度
          originHeight, // 取图片的高度
          0, // 距离 canvas x轴的距离
          0, // 距离 canvas y轴的距离
          originWidth * ratio, // 在canvas 中的宽度
          originHeight * ratio // 在canvas 中的高度
        );
        const base64 = canvas.toDataURL("image/png", 2.0);
        _this.base64 = base64
        let file = _this.dataURLtoFile(base64)     
        var params = _this.setFormData({
          file: file,
          printName: 'EPSON M2110 NO.1',
          uid: 1
        })
        setPrint(params).then(res=> {
          console.log(res);
        })
      };
    },
    connect() {
      let canvas;
      let canvas2;
      let canvas3;
      let canvas4;

      var ePosDev = this.ePosDev
      console.log(ePosDev)
      var ipAddress = this.ipAddress
      var port = this.port

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
      var deviceID = this.deviceID
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
      console.log('打印--')
      console.log(this.printer)
      sessionStorage.setItem("printer", this.printer);
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
    // canvae文本换行
    drawtext(ctx,t,x,y,w){
      //参数说明
      //ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
      let chr = t.split("")
      let temp = ""
      let row = []

      for (let a = 0; a<chr.length;a++){
        if( ctx.measureText(temp).width < w && ctx.measureText(temp+(chr[a])).width <= w){
          temp += chr[a];
        }else{
          row.push(temp);
          temp = chr[a];
        }
      }
      row.push(temp)
      for(let b=0;b<row.length;b++){
        ctx.fillText(row[b],x,y+(b+1)*20);//每行字体y坐标间隔20
        this.thisY = y+(b+1)*20
      }

    },
    // 线上-订单信息
    smallTicket1(){
      var canvas = document.getElementById("mycanvas")
      //  由于弹窗，确保已获取到
      var a = setInterval(() =>{
        //  重复获取
        canvas = document.getElementById("mycanvas")
        if(!canvas){
          return false
        } else {
          clearInterval(a)
          var ctx=canvas.getContext("2d");

          ctx.font="12px Rotunda";
          ctx.fillText("2021.06.20  SUN.",48,50);
          ctx.font="12px Rotunda";
          ctx.fillText("SHOPPING LIST",348,50);
          ctx.font="ALEX";
          ctx.fillText("ALEX",716,50);

          ctx.beginPath();
          ctx.lineCap="round";
          ctx.moveTo(48,72);
          ctx.lineTo(745,72);
          ctx.stroke();
          // PLEASE CHECK THE ORDER DETAILS
          ctx.font="12px Rotunda";
          ctx.fillText("PLEASE CHECK THE ORDER DETAILS",48,100);
          ctx.font="12px Rotunda";
          ctx.fillText("AND KEEP THIS RETURN SLIP FOR REFUND OR EXCHANGES.",48,116);
          ctx.font="32px Rotunda";
          ctx.fillText("1",710,110);
          ctx.font="12px Rotunda";
          ctx.fillText("/2",730,96);
          ctx.font="12px Rotunda";
          ctx.fillText("请仔细核对您购买的商品明细，并保留此清单作为退换货的凭证。",48,132);
          // HARMAYCONCEPT.TMALL.COM
          ctx.font="12px Rotunda";
          ctx.fillText("HARMAYCONCEPT.TMALL.COM",48,160);
          ctx.font="12px Rotunda";
          ctx.fillText("ID:飞行的小宇宙",48,176);
          ctx.font="12px Rotunda";
          ctx.fillText("袁女士",48,192);
          ctx.font="12px Rotunda";
          ctx.fillText("15298340032",48,208);
          ctx.font="12px Rotunda";
          ctx.fillText("SF EXPRESS",48,224);
          ctx.font="12px Rotunda";
          ctx.fillText("18293847382938493289",598,180);
          var img=this.$refs.conf0
          ctx.drawImage(img,566,190,181,34);
          // 订单列表
          this.thisY = 270
          ctx.fillText("MAISON FRANCIS KURKDJIAN",48,this.thisY);
          ctx.fillText("景润旅行套装MOODY美瞳420度",240,this.thisY);
          ctx.fillText("CNY 345.00",568,this.thisY);
          ctx.fillText("优惠",652,this.thisY);
          ctx.lineWidth="1";
          ctx.rect(646,this.thisY-12,36,16);
          ctx.stroke();
          ctx.fillText("CNY 345.00",568,this.thisY+20);
          ctx.fillText("1",738,this.thisY);
          this.drawtext(ctx,'柠檬生姜香型古龙水8ML+红橙罗勒香型古龙水8ML+青柠肉豆蔻香型古龙水8ML+白桃芫荽香型古龙水8ML+藏红花鸢尾花香型古龙水8ML',240,this.thisY,296)
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          this.thisY = this.thisY + 30
          ctx.fillText("MAISON FRANCIS KURKDJIAN",48,this.thisY);
          ctx.fillText("景润旅行套装MOODY美瞳420度",240,this.thisY);
          ctx.fillText("CNY 345.00",568,this.thisY);
          ctx.fillText("CNY 345.00",568,this.thisY+20);
          ctx.fillText("1",738,270);
          this.drawtext(ctx,'柠檬生姜香型古龙水8ML+红橙罗勒香型古龙水8ML+青柠肉豆蔻香型古龙水8ML+白桃芫荽香型古龙水8ML+藏红花鸢尾花香型古龙水8ML',240,this.thisY,296)
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          var logo=this.$refs.conf2
          ctx.drawImage(logo,332,940,126,15);


        }
      },1)
    },
    smallTicket2(){
      var canvas = document.getElementById("mycanvas")
      //  由于弹窗，确保已获取到
      var a = setInterval(() =>{
        //  重复获取
        canvas = document.getElementById("mycanvas")
        if(!canvas){
          return false
        } else {
          clearInterval(a)
          var ctx=canvas.getContext("2d");

          ctx.font="12px Rotunda";
          ctx.fillText("2021.06.20  SUN.",48,50);
          ctx.font="12px Rotunda";
          ctx.fillText("SHOPPING LIST",348,50);
          ctx.font="ALEX";
          ctx.fillText("ALEX",716,50);

          ctx.beginPath();
          ctx.lineCap="round";
          ctx.moveTo(48,72);
          ctx.lineTo(745,72);
          ctx.stroke();
          // PLEASE CHECK THE ORDER DETAILS
          ctx.font="12px Rotunda";
          ctx.fillText("PLEASE CHECK THE ORDER DETAILS",48,100);
          ctx.font="12px Rotunda";
          ctx.fillText("AND KEEP THIS RETURN SLIP FOR REFUND OR EXCHANGES.",48,116);
          ctx.font="32px Rotunda";
          ctx.fillText("1",710,110);
          ctx.font="12px Rotunda";
          ctx.fillText("/2",730,96);
          ctx.font="12px Rotunda";
          ctx.fillText("请仔细核对您购买的商品明细，并保留此清单作为退换货的凭证。",48,132);
          // HARMAYCONCEPT.TMALL.COM
          ctx.font="12px Rotunda";
          ctx.fillText("HARMAYCONCEPT.TMALL.COM",48,160);
          ctx.font="12px Rotunda";
          ctx.fillText("ID:飞行的小宇宙",48,176);
          ctx.font="12px Rotunda";
          ctx.fillText("袁女士",48,192);
          ctx.font="12px Rotunda";
          ctx.fillText("15298340032",48,208);
          ctx.font="12px Rotunda";
          ctx.fillText("SF EXPRESS",48,224);
          ctx.font="12px Rotunda";
          ctx.fillText("18293847382938493289",598,180);
          var img=this.$refs.conf0
          ctx.drawImage(img,566,190,181,34);
          // 订单列表
          this.thisY = 270
          ctx.fillText("MAISON FRANCIS KURKDJIAN",48,this.thisY);
          ctx.fillText("景润旅行套装MOODY美瞳420度",240,this.thisY);
          ctx.fillText("CNY 345.00",568,this.thisY);
          ctx.fillText("优惠",652,this.thisY);
          ctx.lineWidth="1";
          ctx.rect(646,this.thisY-12,36,16);
          ctx.stroke();
          ctx.fillText("CNY 345.00",568,this.thisY+20);
          ctx.fillText("1",738,this.thisY);
          this.drawtext(ctx,'柠檬生姜香型古龙水8ML+红橙罗勒香型古龙水8ML+青柠肉豆蔻香型古龙水8ML+白桃芫荽香型古龙水8ML+藏红花鸢尾花香型古龙水8ML',240,this.thisY,296)
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          this.thisY = this.thisY + 30
          ctx.fillText("LANCOME",48,this.thisY);
          ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          ctx.fillText("5",738,this.thisY);
          this.thisY = this.thisY + 20
          ctx.fillText("400ML",240,this.thisY);
          ctx.fillText("CNY 45.00",568,this.thisY);
          var logo=this.$refs.conf2
          ctx.drawImage(logo,332,940,126,15);
          this.thisY = this.thisY + 70
          ctx.font="18px Rotunda";
          ctx.fillText("TOTAL",48,this.thisY);
          ctx.fillText("CNY 30025.00",568,this.thisY);
          ctx.fillText("45",720,this.thisY);
          this.thisY = this.thisY + 10
          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.lineCap="butt";
          ctx.moveTo(48,this.thisY);
          ctx.lineTo(745,this.thisY);
          ctx.stroke();
          this.thisY = this.thisY + 20
          var logo=this.$refs.conf3
          ctx.drawImage(logo,50,this.thisY,this.logoWidth,this.logoWidth);
          ctx.font="12px Rotunda";
          ctx.fillText("应付",570,this.thisY);
          ctx.fillText("35035.00",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("优惠",570,this.thisY);
          ctx.fillText("CNY 1000.00",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("話梅",570,this.thisY);
          ctx.fillText("17000 颗",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("在线付",570,this.thisY);
          ctx.fillText("CNY 25000.00",632,this.thisY);
          this.thisY = this.thisY + 44
          ctx.fillText("微信扫码联系客服",50,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("参与调查问卷",50,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("解锁50颗話梅积分奖励",50,this.thisY);
          // 底部信息
          this.thisY = this.thisY + this.logoWidth
          ctx.fillText('"颗"IS HARMAY’S CREDIT UNIT, 100颗POINTS = CNY 1.00',48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("FOR PRODUCTS HYGIENE AND SAFETY CONSIDERATIONS, ",48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("NO REFUNDS OR RETURNS AFTER PRODUCTS LEAVE THE STORE,",48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("THANK YOU FOR YOUR UNDERSTANDING.",48,this.thisY);
          this.thisY = this.thisY + 22
          ctx.fillText('"颗"为話梅积分单位，100颗話梅 = CNY 1.00',48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText('出于商品卫生安全考虑，商品离店后非质量问题不支持退换，请你谅解。',48,this.thisY);

        }
      },1)
    },
    smallTicket3(){
      var canvas = document.getElementById("mycanvas")
      //  由于弹窗，确保已获取到
      var a = setInterval(() =>{
        //  重复获取
        canvas = document.getElementById("mycanvas")
        if(!canvas){
          return false
        } else {
          clearInterval(a)
          var ctx=canvas.getContext("2d");
          ctx.fillStyle ="#1A1311";
          ctx.font="18px Rotunda";
          ctx.fillText("感 谢 你 选 择 話 梅",322,58);
          ctx.font="12px Rotunda";
          ctx.fillText("HARMAY IS A NEW GENERATION RETAIL BRAND WITH A WAREHOUSE CULTURE. HARMAY WAS ORIGINALLY",52,100);
          ctx.fillText("BORN IN A HUMBLE WAREHOUSE. IT BEGAN AS AN ONLINE COSMETICS STORE, WHERE STAFF RUSHED",52,120);
          ctx.fillText("BETWEEN EACH SHELF, STAIRCASE AND WORKSTATION EVERY DAY, SORTING, TIDYING, AND PACKAGING",52,140);
          ctx.fillText("VARIOUS GOODS. LATER, HARMAY TOOK THE \"WAREHOUSE CULTURE\" OFFLINE TO ITS CURRENT",52,160);
          ctx.fillText("INSPIRATIONAL FORM.",52,180);
          ctx.fillText("WE ALWAYS ADHERE TO STRICT QUALITY STANDARDS, TO ENSURE THE PRODUCTS ARE SOLD 100% FOR",52,200);
          ctx.fillText("AUTHENTICITY AND IS COMMITTED TO PROVIDE YOU WITH UNIFIED BRAND, IMPROVE THE SAFE SERVICE",52,220);
          ctx.fillText("EXPERIENCE",52,240);
          ctx.fillStyle ="#5F5E5E";
          ctx.fillText("HARMAY 話梅是仓储型新零售品牌。話梅的最初是在一间不起眼的仓库中开启的。 起初，门店的前身是一家在线化妆品店，",52,270);
          ctx.fillText("员工每天来回于各个货架、楼梯与操作台之间，忙碌在纷繁复杂的货品之中，反复进行着整理、分类、打包等操作。后来，",52,290);
          ctx.fillText("話梅开创性地将一直坚持的「仓储文化」带到了线下，才有了如今门店的模样。",52,310);
          ctx.fillText("我们始终坚持严苛的选品标准，保证所售产品100%为正品，并致力于为你提供品牌统一、完善无忧的服务体验。",52,330);
          ctx.fillStyle ="#1A1311";
          ctx.font="18px Rotunda";
          ctx.fillText("RETURN AND EXCHANGE PROCESS",50,470);
          ctx.font="12px Rotunda";
          ctx.fillText("退换货流程",50,490);
          ctx.fillStyle="#F1F1F1";
          ctx.fillRect(50,510,695,104);
          var logo=this.$refs.conf3
          ctx.drawImage(logo,72,524,this.logoWidth,this.logoWidth);
          ctx.fillStyle ="#1A1311";
          ctx.font="12px Rotunda";
          ctx.fillText("扫码联系客",172,560);
          ctx.fillText("服",172,580);
          var next=this.$refs.conf4
          ctx.drawImage(next,272,552,11,22);
          ctx.fillText("客服审核通过后",298,550);
          ctx.fillText("填写退换货登记表",298,570);
          ctx.fillText("与商品一同寄回",298,590);
          ctx.drawImage(next,426,552,11,22);
          ctx.fillText("商品签收后 ",452,560);
          ctx.fillText("进行退换货条件质检",452,580);
          ctx.drawImage(next,596,552,11,22);
          ctx.fillText("退款 ",624,560);
          ctx.fillText("或补发换货商品",624,580);
          ctx.font="18px Rotunda";
          ctx.fillText("REGISTER",50,650);
          ctx.font="12px Rotunda";
          ctx.fillText("退换货登记表",50,670);
          ctx.fillStyle="#F1F1F1";
          ctx.fillRect(50,690,695,156);
          ctx.fillStyle ="#1A1311";
          ctx.font="12px Rotunda";
          ctx.fillText("服 务 内 容",74,720);
          ctx.rect(152,704,22,22);
          // ctx.stroke();
          ctx.fillText("退 货",186,720);
          ctx.rect(230,704,22,22);
          ctx.fillText("换 货",264,720);
          ctx.fillText("购 买 平 台",442,720);
          ctx.rect(520,704,22,22);
          ctx.fillText("小 程 序",552,720);
          ctx.rect(614,704,22,22);
          ctx.fillText("天 猫",646,720);
          // ctx.stroke();
          ctx.fillText("订 单 编 号",74,755);
          ctx.fillText("收件人姓名",74,790);
          ctx.fillText("收件人电话",442,790);
          ctx.fillText("退 换 原 因",74,825);
          ctx.moveTo(152,760);
          ctx.lineTo(726,760);
          ctx.moveTo(152,795);
          ctx.lineTo(360,795);
          ctx.moveTo(520,795);
          ctx.lineTo(727,795);
          ctx.moveTo(152,830);
          ctx.lineTo(726,830);
          ctx.stroke();
          ctx.fillStyle="#5F5E5E";
          ctx.fillText("当 发 生 以下情况时，你的退换货申请将被退回：",50,880);
          ctx.fillText(" ●未与客服取得联系，或订单退货申请审核不通过，私自将商品寄回。●使用平邮、闪送、到付等非HARMAY支",50,900);
        }
      },1)
    },
    smallTicket4(){
      var canvas = document.getElementById("mycanvas")
      //  由于弹窗，确保已获取到
      var a = setInterval(() =>{
        //  重复获取
        canvas = document.getElementById("mycanvas")
        if(!canvas){
          return false
        } else {
          clearInterval(a)
          var ctx=canvas.getContext("2d");
          ctx.fillStyle ="#1A1311";
          ctx.font="12px Rotunda";
          ctx.fillText("2021.06.20  SUN.",48,50);
          ctx.font="12px Rotunda";
          ctx.fillText("SHOPPING LIST",348,50);
          ctx.font="ALEX";
          ctx.fillText("ALEX",716,50);

          ctx.beginPath();
          ctx.lineCap="round";
          ctx.moveTo(48,72);
          ctx.lineTo(745,72);
          ctx.stroke();
          // PLEASE CHECK THE ORDER DETAILS
          ctx.font="12px Rotunda";
          ctx.fillText("PLEASE CHECK THE ORDER DETAILS",48,100);
          ctx.font="12px Rotunda";
          ctx.fillText("AND KEEP THIS RETURN SLIP FOR REFUND OR EXCHANGES.",48,116);
          ctx.font="32px Rotunda";
          ctx.fillText("1",710,110);
          ctx.font="12px Rotunda";
          ctx.fillText("/2",730,96);
          ctx.fillStyle ="#5F5E5E";
          ctx.font="12px Rotunda";
          ctx.fillText("请仔细核对您购买的商品明细，并保留此清单作为退换货的凭证。",48,132);
          // HARMAYCONCEPT.TMALL.COM
          ctx.fillStyle ="#1A1311";
          ctx.font="12px Rotunda";
          ctx.fillText("BEIJING SANLITUN",48,160);
          ctx.font="12px Rotunda";
          ctx.fillText("2 WORKERS' SPORTS COMPLEX N RD, CHAOYANG DISTRICT, BEIJING",48,176);
          ctx.fillText("BUSINESS HOUR: 10:00-22:00",48,192);
          ctx.fillText("CONTACT: 15210678315",48,208);
          ctx.fillStyle ="#5F5E5E";
          ctx.fillText("北京三里屯店：朝阳区工体北路首北兆龙饭店一层",48,230);
          ctx.fillText("营业时间：10:00-22:00",48,250);
          ctx.fillText("电话：15210678315",48,270);
          ctx.fillStyle ="#1A1311";
          ctx.fillText("MD1571576228",654,230);
          var img=this.$refs.conf0
          ctx.drawImage(img,566,240,181,34);
          // 订单列表
          this.thisY = 320
          ctx.fillStyle ="#1A1311";
          console.log(this.goodsTableData);
          for(let i=0; i < this.goodsTableData.length; i++) {
            let item = this.goodsTableData[i]
            ctx.fillText("MAISON FRANCIS KURKDJIAN", 48, this.thisY);
            ctx.fillText(item.name, 240, this.thisY);
            ctx.fillText("CNY "+item.price,568,this.thisY);
            ctx.fillText("优惠",652,this.thisY);
            ctx.lineWidth="1";
            ctx.rect(646,this.thisY-13,36,17);
            ctx.fillText(item.quantity,738,this.thisY);
            this.thisY = this.thisY + 20
            ctx.fillText(item.spec,240,this.thisY);
            ctx.fillText("CNY "+item.price,568,this.thisY);
            ctx.stroke();
          }
          
          // ctx.fillText("MAISON FRANCIS KURKDJIAN",48,this.thisY);
          // ctx.fillText("景润旅行套装MOODY美瞳420度",240,this.thisY);
          // ctx.fillText("CNY 345.00",568,this.thisY);
          // ctx.fillText("优惠",652,this.thisY);
          // ctx.lineWidth="1";
          // ctx.rect(646,this.thisY-12,36,16);
          // ctx.stroke();
          // ctx.fillText("CNY 345.00",568,this.thisY+20);
          // ctx.fillText("1",738,this.thisY);
          // this.drawtext(ctx,'柠檬生姜香型古龙水8ML+红橙罗勒香型古龙水8ML+青柠肉豆蔻香型古龙水8ML+白桃芫荽香型古龙水8ML+藏红花鸢尾花香型古龙水8ML',240,this.thisY,296)
          // this.thisY = this.thisY + 30
          // ctx.fillText("LANCOME",48,this.thisY);
          // ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          // ctx.fillText("CNY 45.00",568,this.thisY);
          // ctx.fillText("5",738,this.thisY);
          // this.thisY = this.thisY + 20
          // ctx.fillText("400ML",240,this.thisY);
          // ctx.fillText("CNY 45.00",568,this.thisY);
          // this.thisY = this.thisY + 30
          // ctx.fillText("LANCOME",48,this.thisY);
          // ctx.fillText("箐纯清滢柔肤水",240,this.thisY);
          // ctx.fillText("CNY 45.00",568,this.thisY);
          // ctx.fillText("5",738,this.thisY);
          // this.thisY = this.thisY + 20
          // ctx.fillText("400ML",240,this.thisY);
          // ctx.fillText("CNY 45.00",568,this.thisY);

          this.thisY = this.thisY + 60
          ctx.font="18px Rotunda";
          ctx.fillText("TOTAL",48,this.thisY);
          ctx.fillText("CNY 30025.00",568,this.thisY);
          ctx.fillText("45",720,this.thisY);
          this.thisY = this.thisY + 10
          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.lineCap="butt";
          ctx.moveTo(48,this.thisY);
          ctx.lineTo(745,this.thisY);
          ctx.stroke();
          this.thisY = this.thisY + 20
          var logo=this.$refs.conf3
          ctx.drawImage(logo,50,this.thisY,this.logoWidth,this.logoWidth);
          ctx.font="12px Rotunda";
          ctx.fillText("应付",570,this.thisY);
          ctx.fillText("35035.00",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("优惠",570,this.thisY);
          ctx.fillText("CNY 1000.00",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("話梅",570,this.thisY);
          ctx.fillText("17000 颗",632,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("在线付",570,this.thisY);
          ctx.fillText("CNY 25000.00",632,this.thisY);
          this.thisY = this.thisY + 64
          ctx.fillText("微信扫码开票",50,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("参与调查问卷",50,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("解锁50颗話梅积分奖励",50,this.thisY);
          // 底部信息
          this.thisY = this.thisY + this.logoWidth
          ctx.fillText('"颗"IS HARMAY’S CREDIT UNIT, 100颗POINTS = CNY 1.00',48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("FOR PRODUCTS HYGIENE AND SAFETY CONSIDERATIONS, ",48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("NO REFUNDS OR RETURNS AFTER PRODUCTS LEAVE THE STORE,",48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText("THANK YOU FOR YOUR UNDERSTANDING.",48,this.thisY);
          this.thisY = this.thisY + 22
          ctx.fillText('"颗"为話梅积分单位，100颗話梅 = CNY 1.00',48,this.thisY);
          this.thisY = this.thisY + 18
          ctx.fillText('出于商品卫生安全考虑，商品离店后非质量问题不支持退换，请你谅解。',48,this.thisY);
          var conf2=this.$refs.conf2
          ctx.drawImage(conf2,332,940,126,15);

        }
      },1)
    },
    dataURLtoFile (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {type: mime})
    },
    setFormData(data) {
      var params = new FormData()
      if(data) {
        for (var name in data) {
          params.append(name, data[name])
        }
      }
      return params
    },
    print() {
      if(!this.setRadio) {
        this.resetDraw()
        return
      }
      var dataURL = this.base64
      console.log(this.base64);
      let file = this.dataURLtoFile(dataURL)     
      var params = this.setFormData({
        file: file,
        printName: ['EPSON M2110 NO.1','EPSON M2110 NO.1','EPSON M2110 NO.1'],
        uid: 1
      })
      setPrint(params).then(res=> {
        console.log(res);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.small-ticket-container {

}
</style>