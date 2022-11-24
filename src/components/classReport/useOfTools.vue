<template>
    <div class="use-of-tools">
        <ItemShell :imgName="1" :title="'教学工具使用情况'">
            <ul>
                <li v-for="(item, index) in toolsUse" :key="index">
                    <span class="item-name">{{ index | nameFilter }}</span>
                    <div class="container">
                        <div class="child" :style="{ width: (maxCount ? (item / maxCount) * 100 : 0) + '%' }">
                            <strong class="">{{ item }}<span>次</span></strong>
                        </div>
                    </div>
                </li>
            </ul>
        </ItemShell>
    </div>
</template>

<script>
import ItemShell from './itemShell.vue'
import { mapState } from 'vuex'
export default {
    name: 'UseOfTools',
    components: {
        ItemShell
    },
    computed: {
        ...mapState('inCloudClassroom', ['toolsUse'])
    },
    filters: {
        nameFilter(val) {
            switch (val) {
                case 'judge':
                    return '判断题'
                case 'select':
                    return '选择题'
                case 'classTest':
                    return '随堂测试'
                case 'timer':
                    return '计时器'
                case 'callTheRoll':
                    return '随机点名'
                case 'responder':
                    return '抢答器'
                case 'contentShare':
                    return '内容分享'
                default:
                    break;
            }
        }
    },
    data() {
        return {
            maxCount: 0
        }
    },
    created() {
        for(let k in this.toolsUse) {
            this.maxCount = this.toolsUse[k] > this.maxCount ? this.toolsUse[k] : this.maxCount
        }
    }
}
</script>

<style lang="less" scoped>
.use-of-tools {
    width: 100%;
    height: 4.81rem;
    ul {
        height: 100%;
        padding: 0.36rem 0 0.36rem 0.67rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        li {
            display: flex;
            align-items: center;
            font-size: 0.21rem;
            .item-name {
                width: 0.9rem;
                text-align: right;
                padding-right: 0.05rem;
            }
            .container {
                height: 0.31rem;
                width: 2rem;
                .child {
                    height: 100%;
                    position: relative;
                    strong {
                        position: absolute;
                        width: 0.7rem;
                        right: -0.75rem;
                        span {
                            font-weight: 400;
                        }
                    }
                }
            }
            &:nth-child(1) {
                .child{
                    background: #FE7876;
                }
            }
            &:nth-child(2) {
                .child{
                    background: #FFAB5E;
                }
            }
            &:nth-child(3) {
                .child{
                    background: #FFDE7C;
                }
            }
            &:nth-child(4) {
                .child{
                    background: #ABEB7A;
                }
            }
            &:nth-child(5) {
                .child{
                    background: #379DFE;
                }
            }
            &:nth-child(6) {
                .child{
                    background: #87BCFD;
                }
            }
            &:nth-child(7) {
                .child{
                    background: #9999FF;
                }
            }
        }
    }
}
</style>