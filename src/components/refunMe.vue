<template>
    <div class="reMod">
        <div class="reMod_cont">
            商品编码
        </div>
         <div class="reMod_botm">
             <el-input v-model="textSn">
             </el-input>
        </div>
        <div class="reMod_butn">
            <el-button type="info" @click="uncertain">
                取消
            </el-button> 
            <el-button style="background:#000;color:#fff;margin-left:20px" @click="chexSn">
                确定
            </el-button>   
        </div>   
    </div>
    
</template>
<script>
export default {
    props:{
        refundMe:Array
    },
    name:'refunMe',
    data(){
        return{
            textSn:''
        }
    },
    methods:{
        removeRefun(){
            this.$parent.refundMe = false 
        },
        getQueryString(query) {
            // var query = url.search.substring('?');
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == "sn") {
                return pair[1];
                }
            }
            return false;
        },
        chexSn(){
           
        if(this.textSn.indexOf('https') != -1){
            var query = this.textSn.split("?")[1];
            var snCode = this.getQueryString(query);
            if(snCode == this.refundMe[2]){
                this.textSn = ''
                this.$emit('product',this.refundMe[0])
                this.$parent.refundMe = false 
                this.$parent.refundModes = true
            }else{
                this.$message({
                    showClose: true,
                    message: '商品编码不一致',
                    type: 'error'
                });
            }
        }else {
            if(this.textSn == this.refundMe[2]){
                this.$parent.refundMe = false 
                this.$parent.refundModes = true
            }else{
                this.$message({
                    showClose: true,
                    message: '商品编码不一致',
                    type: 'error'
                });
            }
        }
        
        },
        uncertain(){
            this.$parent.refundMe = false 
        }
    }
}
</script>
<style lang="scss" scoped>
    .reMod{
        .reMod_head{
            font-size: 16px;
            span{
            margin-left: 20px;
        }
        }
        .reMod_cont{
            width: 100%;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
            margin-top: 50px;
        }
        .reMod_botm{
            padding: 20px 40px;
            
                .el-input__inner{
                    background:#f5f5f5
                }
            
        }
        .reMod_butn{
            margin-bottom: 30px;
            text-align: center;  
        }
        
    }
</style>