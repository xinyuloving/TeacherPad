<template>
    <div class="accuracy">
        <section class="top">
            {{ parseInt(correctRate * 100) }}<span>%</span>
        </section>
        <section class="middle">课堂答题平均正确率</section>
        <!-- <section class="floor">
            <span :class="type.className">相对上节课{{ type.text }}</span>
            <span class="num">{{ differ }}</span>
            %
        </section> -->
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "Accuracy",
    computed: {
        ...mapState("inCloudClassroom", ["correctRate"]),
    },
    // data() {
    //     return {
    //         currentNum: 80,
    //         lastTimeNum: 90,
    //         type: {
    //             className: '',
    //             text: ''
    //         }
    //     }
    // },
    // computed: {
    //     differ() {
    //         if (this.currentNum > this.lastTimeNum) {
    //             return this.currentNum - this.lastTimeNum
    //         } else {
    //             return this.lastTimeNum - this.currentNum
    //         }
    //     }
    // },
    // created() {
    //     if (this.currentNum > this.lastTimeNum) {
    //         this.type.className = 'upward';
    //         this.type.text = '提升'
    //     } else if (this.currentNum < this.lastTimeNum) {
    //         this.type.className = 'down';
    //         this.type.text = '下降'
    //     } else {
    //         this.type.className = 'equal';
    //         this.type.text = '提升'
    //     }
    // }
};
</script>

<style lang="less" scoped>
.accuracy {
    width: 100%;
    height: 2.43rem;
    background: url("../../assets/img/cloudClassroom/classReport/accuracy.png")
        no-repeat;
    background-size: contain;
    color: #fff;
    section {
        text-align: center;
    }
    .top {
        font-size: 0.65rem;
        font-weight: 600;
        font-family: DINAlternate-Bold, DINAlternate;
        margin: 0.6rem 0 0.1rem;
        span {
            font-size: 0.4rem;
        }
    }
    .middle {
        font-size: 0.23rem;
        margin-bottom: 0.1rem;
    }
    .floor {
        font-size: 0.19rem;
        .num {
            font-size: 0.33rem;
            font-weight: 600;
        }
        .upward {
            position: relative;
            &::before {
                content: "";
                position: absolute;
                top: -0.02rem;
                left: -0.25rem;
                border: 0.1rem solid transparent;
                border-bottom: 0.1rem solid #fe7876;
            }
        }
        .equal {
            position: relative;
            &::before {
                content: "";
                position: absolute;
                top: 50%;
                left: -0.25rem;
                transform: translateY(-1px);
                height: 2px;
                width: 0.2rem;
                background: #fe7876;
            }
        }
        .down {
            position: relative;
            &::before {
                content: "";
                position: absolute;
                bottom: -0.02rem;
                left: -0.25rem;
                border: 0.1rem solid transparent;
                border-top: 0.1rem solid #fe7876;
            }
        }
    }
}
</style>