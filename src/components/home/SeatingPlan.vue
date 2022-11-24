<template>
    <div class="seating-plan" ref="seating">
        <div class="seating-main">
            <div class="seating-left">
                <div v-for="item in row+1" :key="item">P{{row - item + 2}}</div>
                <span :style="{ color: '#518FF8' }">P(排)</span>
            </div>
            <div class="seating-right">
                <div class="top">
                    <div v-for="item in column" :key="item">L{{item}}</div>
                    <span :style="{ color: '#518FF8' }">L(列)</span>
                </div>
                <div class="content">
                    <div class="row-box" v-for="(row, index) in seatingPlan" :key="index">
                        <div class="row-item" 
                            v-for="(item, num) in row" 
                            :key="num"
                            v-touch="() => { studentInfo(item, `row${index}column${num}`) }"
                            :style="{ background: bgColor(item) }"
                        >
                            <div class="expand" v-if="type" :ref="`row${index}column${num}`" v-show="false" :style="{opacity: 0}">
                                <div class="expand-top" v-if="item.type === 2">
                                    <div>{{item.className}}</div>
                                    <div>{{item.name}}</div>
                                </div>
                                <div class="expand-bottom">
                                    <div class="box">
                                        <i :class="['iconfont', item.type === 2 ? 'icon-normal' : 'icon-malfunction']"></i>
                                        <span>{{item.type === 2 ? '已到位' : '课桌故障'}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="expand active" v-else :ref="`row${index}column${num}`" v-show="false" :style="{opacity: 0}">
                                <img v-if="item.active" :src="require(`../../assets/img/cloudClassroom/classReport/state_${4 - item.active}.png`)" />
                                <div class="active-bottom">{{ item.name }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 讲台 -->
                    <div class="platform">
                        <div class="curve"></div>
                        <div class="platform-text">
                            <span :style="{ marginRight: '1rem' }">讲</span>
                            <span>台</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'SeatingPlan',

    props: {
        row: Number,
        column: Number,
        type: {
            type: Number,
            default: 1
        }
    },

    computed: {
        ...mapState('inCloudClassroom', ['seatingPlan'])
    },

    data() {
        return {
            previousRef: ''
        }
    },

    methods: {
        studentInfo(item, itemRef) {
            // console.log(item);
            if (itemRef === this.previousRef) return;
            const myRef = this.previousRef;
            if (myRef) {
                this.$refs[myRef][0].style.opacity = 0;
                const timer = setTimeout(() => {
                    this.$refs[myRef][0].style.display = 'none';
                    clearTimeout(timer)
                }, 200);
            }
            if (item.type < 2) {
                return this.previousRef = '';
            }
            this.$refs[itemRef][0].style.display = 'flex';
            const timer2 = setTimeout(() => {
                this.$refs[itemRef][0].style.opacity = 1;
                clearTimeout(timer2)
            }, 0);
            this.previousRef = itemRef;
        },
        bgColor(obj) {
            if (this.type) {
                switch (obj.type) {
                    case 1:
                        return 'rgba(81, 143, 248, 0.25)'
                        break;
                    case 2:
                        return '#3E83F8'
                        break;
                    case 3:
                        return '#F55F5F'
                        break;
                    default:
                        break;
                }
            } else {
                switch (obj.active) {
                    case 1:
                        return 'rgb(255, 224, 131)'
                        break;
                    case 2:
                        return 'rgb(255, 171, 94)'
                        break;
                    case 3:
                        return 'rgb(251, 104, 104)'
                        break;
                    default:
                        break;
                }
            }
        }
    },
}
</script>

<style lang="less" scoped>
.seating-plan {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.25rem;
    color: #666;
    .seating-main {
        display: flex;
        .seating-left {
            width: 0.4rem;
            line-height: 0.5rem;
            div {
                text-align: right;
                margin-bottom: 0.13rem;
            }
            div:nth-child(1) {
                color: #fff;
                margin: 0;
                line-height: 0.3rem;
            }
            span {
                position: relative;
                top: -0.2rem;
            }
        }
        .seating-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            .content {
                flex: 1;
                .row-box {
                    height: 0.5rem;
                    margin-bottom: 0.13rem;
                    display: flex;
                    .row-item {
                        width: 0.67rem;
                        height: 100%;
                        margin-left: 0.2rem;
                        border-radius: 0.04rem;
                        position: relative;
                        .expand {
                            position: absolute;
                            left: 0.5rem;
                            top: -0.25rem;
                            width: 2.2rem;
                            padding: 0.1rem 0;
                            background: #fff;
                            z-index: 9;
                            transition: opacity .2s;
                            box-shadow: 0rem 0.01rem 0.05rem 0rem #518FF8;
                            border-right: 0.05rem;
                            font-size: 0.21rem;
                            flex-direction: column;
                            .icon-normal {
                                font-size: 0.23rem;
                                color: #518FF8;
                                margin-right: 0.05rem;
                            }
                            .icon-malfunction {
                                font-size: 0.23rem;
                                color: #f6604b;
                                margin-right: 0.05rem;
                            }
                            &::before {
                                content: '';
                                position: absolute;
                                left: -0.2rem;
                                top: 50%;
                                transform: translateY(-50%);
                                border: 0.1rem solid transparent;
                                border-right: 0.1rem solid #fff;

                            }
                            .expand-top {
                                text-align: center;
                            }
                            .expand-bottom {
                                flex: 1;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                .box {
                                    width: 1.5rem;
                                    height: 0.4rem;
                                    background: #EAEBF4;
                                    border-radius: 0.2rem;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                            }
                        }
                        .active {
                            justify-content: center;
                            align-items: center;
                            width: 1.7rem;
                            height: 1rem;
                            border-radius: 0.05rem;
                            img {
                                width: 0.38rem;
                            }
                        }
                    }
                }
                .platform {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    .curve {
                        width: 80%;
                        height: 0.3rem;
                        background: #ccc;
                        border-radius: 0 0 50% 50%;
                        position: relative;
                        &::before {
                            content: '';
                            position: absolute;
                            left: -1%;
                            top: -0.05rem;
                            width: 102%;
                            height: 0.3rem;
                            background: #fff;
                            border-radius: 0 0 50% 50%;
                        }
                    }
                }
            }
            .top {
                line-height: 0.5rem;
                display: flex;
                line-height: 0.3rem;
                div {
                    width: 0.67rem;
                    margin-left: 0.2rem;
                    text-align: center;
                }
            }
        }
    }
}
</style>