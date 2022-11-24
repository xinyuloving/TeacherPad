<template>
    <div class="drop-down">
        <!-- <select v-model="value">
            <option value="wo">wo</option>
            <option value="yy">yy</option>
            <option value="cc">cc</option>
            <option value="dd">dd</option>
        </select> -->
        <div class="mask" v-show="isMask" v-touch="takeBack"></div>
        <div class="select" v-touch="open" :style="{ width: dropDownInfo.width, height: dropDownInfo.height, background: dropDownInfo.background, border: dropDownInfo.border, fontSize: dropDownInfo.fontSize }">
            <div class="text" v-if="!isCompile" :style="{ lineHeight: dropDownInfo.height }">{{text}}</div>
            <input type="text" v-if="isCompile" v-model="text" class="text" :style="{ lineHeight: dropDownInfo.height, fontSize: dropDownInfo.fontSize }" />
            <ul class="options" v-if="list.length" :style="{ opacity: opacity, width: dropDownInfo.pullWidth, top: dropDownInfo.height,marginTop: dropDownInfo.height }" v-touch.stop v-show="isOption">
                <li v-touch="() => { select(item) }" v-for="(item, index) in list" :key="index" :style="{ lineHeight: dropDownInfo.height }">{{item}}</li>
            </ul>
            <slot>
                <span class="right"></span>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DropDown',
    props: {
        list: {
            type: Array,
            required: true
        },
        dropDownInfo: Object,
        current: [Number, String],
        index: [Number, String],
        isCompile: {
            type: Boolean,
            default: false
        },
        value: String
    },
    data() {
        return {
            text: '',
            opacity: 0,
            isMask: false,
            isOption: false
        }
    },
    methods: {
        select(val) {
            this.text = val;
            this.opacity = 0;
            this.isMask = false;
        },
        open() {
            if (this.isOption) return this.takeBack();
            this.$emit('currentIndex', this.index)
            this.isOption = true;
            this.isMask = true;
            setTimeout(() => {
                this.opacity = 1
            }, 0);
        },
        takeBack() {
            this.opacity = 0;
            this.isMask = false;
        }
    },
    created() {
        this.text = this.value
    },
    watch: {
        opacity() {
            if (!this.opacity) {
                setTimeout(() => {
                    this.isOption = false
                }, 300);
            } 
        },
        isMask() {
            if (!this.isMask) this.opacity = 0
        },
        current() {
            if (this.index !== this.current && this.isOption) this.takeBack()
        },
        text() {
            // console.log(this.text);
            this.$emit('updateValue', this.text);
        },
        value() {
            this.text = this.value
        }
    }
}
</script>

<style lang="less" scoped>
ul {
    padding: 0;
    margin: 0;
}
.drop-down {
    .mask {
        position: fixed; 
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 8;
    }
    .select {
        width: 193px;
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border-radius: 3px;
        border: 1px solid #BDBDBD;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        z-index: 9;
        .text {
            max-width: 100%;
            padding: 0 20px 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            height: 100%;
        }
        .right {
            border: 4px solid transparent;
            border-top: 6px solid #979797;
            border-bottom: 6px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 10px;
        }
        .options {
            transition: opacity .3s;
            // position: absolute;
            // top: 45px;
            // left: 0;
            background-color: #fff;
            border-radius: 5px;
            width: 100%;
            box-shadow: 0px 2px 10px 2px #ccc;
            z-index: 10;
            li {
                line-height: 40px;
                padding: 0 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>