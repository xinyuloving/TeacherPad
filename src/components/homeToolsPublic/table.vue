<template>
    <!-- table表格 -->
    <div class="table" ref="table">
        <DefalutPage v-if="!list.length" :textContent="defalutText" :imgName="defaultImgName" />
        <!-- 表头 -->
        <div class="t-head" v-if="list.length" ref="Thead">
            <!-- 复选框 -->
            <div class="check" v-if="type < 2">
                <input
                    class="checkbox"
                    type="checkbox"
                    @change="() => { $emit('checkAll') }"
                    :checked="allCheck"
                />
            </div>
            <!-- 文件名 -->
            <div class="folder-name">
                <div>文件名</div>
                <!-- <input type="text" /> -->
            </div>
            <div class="size" v-if="type > 0 && type < 4">大小</div>
            <!-- 创建时间 -->
            <div class="time">创建时间</div>
            <div class="operate" v-if="type >= 2">操作</div>
        </div>
        <!-- 表体 -->
        <div class="t-body" ref="Tbody" v-if="list.length" >
            <!-- 行 -->
            <div class="t-row" :ref="`rowRef`" v-for="(item, index) in list" :key="index">
                <!-- 复选框 -->
                <div class="check" v-if="type < 2">
                    <input
                        class="checkbox"
                        type="checkbox"
                        @change="() => { $emit('radio', index) }"
                        :checked="item.isCheck"
                        :disabled="item.progress < 1"
                    />
                </div>
                <!-- 文件名 -->
                <div class="folder-name" v-touch="() => { open(index) }">
                    <div class="icon">
                        <img :src="require(`@/assets/img/home/homeTools/PrepareLessons/${item.icon}.png`)" />
                    </div>
                    <div class="name" v-show="!item.isInput">{{ item.name }}</div>
                    <input v-if="item.isInput" v-touch.stop v-model="fileName" v-focus @keyup.enter="inputBlur(index)" @blur="inputBlur(index)" type="text" />
                    <div class="progress-box" v-if="item.progress < 1">
                        <div class="progress" :style="{ width: item.progress * 100 + '%'} "></div>
                    </div>
                </div>
                <div class="size" v-if="type > 0 && type < 4">
                    <span v-if="item.progress < 1">{{ item.curSize | sizeFilter }}/</span>
                    {{item.size | sizeFilter}}
                </div>
                <!-- 创建时间 -->
                <div class="time">{{ item.createTime }}</div>
                <!-- 操作 -->
                <div class="operate" v-if="type === 2 || type === 4">
                    <span class="add" v-touch="() => { functionEvent(0, index) }">添加</span>丨
                    <span class="ren" v-touch="() => { functionEvent(1, index) }">重命名</span>丨
                    <span class="del" v-touch="() => { functionEvent(2, index) }">删除</span>
                </div>
                <div class="operate" v-if="type === 3 || type === 5">
                    <TButton class="addition">
                        <i class="iconfont icon-add_to_my"></i>
                        添加到我的{{ type === 3 ? '课件' : '题库' }}
                    </TButton>
                </div>
                <!-- 拓展符 -->
                <div class="unflod" ref="zhankai" v-if="type < 2" v-touch.stop="() => { unflod(index) }">· · ·
                    <div :class="unflodClass">
                        <UnflodFrame ref="unflod" @unflodEvent="unflodEvent" :type="item.type" :isShow="currentIndex === index" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import UnflodFrame from '@/components/homeToolsPublic/UnflodFrame.vue'
import defalutPage from '@/components/mixins/defalutPage.js'
import TButton from '@/components/FunctionalComp/TButton.vue'

export default {
    name: 'Table',

    components: {
        UnflodFrame,
        TButton
    },

    mixins: [defalutPage],

    directives: {
        focus: {
            inserted(el) {
                setTimeout(() => {
                    el.focus()
                }, 0);
            }
        }
    },

    props: {
        list: Array,                                // 数据列表
        allCheck: Boolean,                          // 复选框全选  
        type: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            currentIndex: '',                       // 当前点击的index
            unflodClass: ['unflod-box'],            // 展开框类名  
            fileName: '',                           // 文件名 
            antiShake: false
        }
    },

    filters: {
        sizeFilter(val) {
            if (!val) return '--'
            if (val >= 1024 && val < 1048576) {
                return parseInt(val / 1024) + 'K'
            } else if (val >= 1048576) {
                return (val / 1024 / 1024).toFixed(1) + 'M'
            } else {
                return val + 'B'
            }
        }
    },

    watch: {
        currentIndex() {
            if (this.currentIndex === '') return;
            this.$emit('updateIndex', this.currentIndex)
        },
        fileName(val) {
            // 正则匹配去除特殊字符
            const reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?~！@#￥……&*——|{}【】‘；：”“'。，、？%]", 'g');
            this.fileName = this.fileName.replace(reg, '');
            // 限制长度
            const n = val.length
            if (n > 100) {
                this.$message({
                    message: '文件名最多100个字符',
                    type: 'warning'
                })
                this.fileName = val.slice(0, 100)
            }
        },
        list() {
            const index = this.list.findIndex(item => item.isInput);
            // if (index === -1 || this.list[index].type === 1) return;
            if (index === -1) return;
            this.fileName = this.list[index].name;
            this.$emit('updateIndex', index)
        },
    },

    methods: {
        inputLoad(e) {
            console.log(e);
        },
        unflod(index) {
            if (this.list[index].progress < 1) return;
            // 计算元素位置
            const location = (this.$refs.Tbody.scrollTop + this.$refs.Tbody.clientHeight) - (this.$refs.rowRef[index].clientHeight * 2 + this.$refs.rowRef[index].offsetTop);
            // 根据位置动态添加类名
            if (location >= 0) {
                this.unflodClass = ['unflod-box']
            } else {
                this.unflodClass = ['unflod-box', 'bottom']
            }
            // 修改当前的索引
            this.currentIndex = index;
            // 监听页面的点击事件
            document.addEventListener('click', e => {
                if (e.target.className === 'unflod' || e.target.className === '') return;
                this.currentIndex = ''
            })
        },
        // 拓展框事件
        unflodEvent(index) {
            if (index === 3) {
                this.fileName = this.list[this.currentIndex].name
            }
            this.currentIndex = '';
            this.$emit('unflodEvent', index);
        },
        // 操作功能事件
        functionEvent(num, index) {
            if (this.list[index].progress < 1) return;
            if (num === 1) {
                this.fileName = this.list[index].name
            }
            this.$emit('unflodEvent', {num, index});
        },
        // 输入框失去焦点
        inputBlur(index) {
            if (this.antiShake) return;
            this.antiShake = true;
            this.$emit('inputBlur', {index, name: this.fileName.trim()});
            this.$nextTick(() => {
                this.antiShake = false;
            })
        },
        open(index) {
            if (this.list[index].progress < 1) return;
            this.$emit('open', index)
        }
    },
}
</script>

<style lang="less" scoped>
.table {
    .t-body {
        height: 6.7rem;
        overflow-y: auto;
        .operate {
            color: #3E83F8;
            display: inherit;
            .del {
                color: #FA6363;
            }
            .addition {
                height: 0.5rem;
                width: 2.7rem;
            }
        }
    }
    .t-head,
    .t-row {
        display: flex;
        align-items: center;
        height: 0.85rem;
        font-size: 0.23rem;
        border-bottom: 1px solid #dfdfdf;
        .check {
            input[type="checkbox"] {
                width: 0.25rem;
                height: 0.25rem;
                vertical-align: middle;
                margin-right: 0.21rem;
                -webkit-appearance: none; /*清除默认样式*/
                background: #ffffff;
                border-radius: 0.04rem;
                border: 0.01rem solid #d3d3d3;
            }
            input[type="checkbox"]:checked {
                background: url("~@/assets/img/home/check.png") no-repeat center center;
                background-size: cover;
            }
        }
        .folder-name {
            width: 8rem;
            display: flex;
            align-items: center;
            .progress-box {
                width: 5rem;
                margin-right: 10px;
                height: 0.1rem;
                background: #E7E7E7;
                border-radius: 0.05rem;
                .progress {
                    height: 100%;
                    width: 30%;
                    background: #3E83F8;
                    border-radius: 0.05rem;
                    transition: all .5s linear;
                }
            }
            input {
                background-color: #F3F3F3;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 5px;
                font-size: 0.23rem;
            }
            .name {
                flex: 1;
                padding-right: 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .unflod {
            padding: 0 0.2rem;
            font-weight: 500;
            position: relative;
            .unflod-box {
                position: absolute;
                right: 0.6rem;
                z-index: 9;
            }
            .bottom {
                bottom: 0;
            }
        }
        .size {
            width: 2rem;
        }
        .time {
            flex: 1;
        }
        .operate {
            width: 3rem;
        }
        .icon {
            margin-right: 0.1rem;
            img {
                vertical-align: middle;
                max-height: 0.44rem;
                max-width: 0.42rem;
            }
        }
    }
    .t-head {
        color: #999;
    }
    .icon-add_to_my {
        color: #fff;
        margin-right: 5px;
    }
}
</style>