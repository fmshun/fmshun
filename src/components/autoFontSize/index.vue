<template>
    <div class="auto_wrapper" ref="auto_wrapper"
        :style="styleObj">
        <slot></slot>
        <!--
            slot 中的 <p class="confrim-item-desc">hello word </p>
            必须设置样式
            font-size: 1em;
        -->
    </div>
</template>

<script>
export default {
    props: {
        firstFontSize: {
            required: true,
            type: Number,
            default: 16
        },
        maxWidth: {
            required: true,
            type: Number,
            default: 290,
        }
    },
    data() {
        return {
            styleObj: { },
            isChinese: false,
        }
    },
    mounted() {
        this.$nextTick(()=>{
             this.setStyle();
        })
       
    },
    methods: {
        getLength() {
            const words = this.$refs.auto_wrapper.innerText;
            let realLength = 0;
            for(let i in words) {
                const charCode = words.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128) { 
                    realLength += 1;
                }else{ // 如果是中文则长度加2
                    realLength += 2;
                    this.isChinese = true;
                }
            }
            return realLength
        },
        setStyle(){
            const maxWidth = this.$refs.auto_wrapper.offsetWidth; // 当前实际 宽度
            const cur = parseFloat(maxWidth / this.maxWidth);  // 计算出 比例;
            const maxSize = Math.floor(cur * this.firstFontSize);  // 最大的 fontSize
            // 计算出 当前能放至一行的 fontSize
            const realLength = this.getLength(); // 字节长度
            let fontSize =  this.isChinese ? Math.floor(maxWidth * 2 / realLength) : Math.floor(maxWidth / realLength);
            if (fontSize < 8) fontSize = 8;
            if (fontSize > maxSize) fontSize = maxSize;
            this.styleObj = {
                'font-size': `${fontSize}px`
            }
            console.log(this.$refs.auto_wrapper.innerText)
        },
    },
}
</script>

<style>
.auto_wrapper {
    white-space: pre-wrap;
    box-sizing: border-box;
    line-height: inherit;
}
</style>