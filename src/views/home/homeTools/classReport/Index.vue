<template>
    <div class="class_peport">
        <!-- <div class="left">
            <LeftList :list="list" :showImg="false" @leftUpdate="leftUpdate" />
        </div>
        <div class="right">
            <div class="top">
                <TButton class="btn1" @touch="to">首页</TButton>
                <TButton class="btn2"> 课堂报告 </TButton>
            </div>
            <div class="main" v-loading="loading">
                <ul v-infinite-scroll="load">
                    <li v-for="(item, index) in peportList" :key="index">
                        <img src="@/assets/img/home/class_peport.png" alt="" />
                        <span class="date">{{ item.date }}</span>
                        <span class="other">{{ `第${item.num}节课` }}</span>
                    </li>
                </ul>
            </div>
        </div> -->
        <div class="head-button">
            <TButton class="btn1" @touch="to">首页</TButton>
            <TButton class="btn2"> 课堂报告 </TButton>
        </div>
        <div class="class-peport-main">
            <div class="main-container" v-if="teachSubjects.length">
                <!-- 左侧 -->
                <div class="left-box">
                    <LeftList
                        :list="list"
                        :showImg="false"
                        @leftUpdate="leftUpdate"
                    />
                </div>
                <!-- 右侧 -->
                <div class="main" v-loading="loading">
                    <ul v-infinite-scroll="load">
                        <li v-for="(item, index) in peportList" :key="index">
                            <img
                                src="@/assets/img/home/class_peport.png"
                                alt=""
                            />
                            <span class="date">{{ item.date }}</span>
                            <span class="other">{{ `第${item.num}节课` }}</span>
                        </li>
                    </ul>
                    <!-- <router-view /> -->
                </div>
            </div>
            <div class="default" v-else>
                <DefalutPage
                    :textContent="DefalutPageConfig.text"
                    :imgName="DefalutPageConfig.imgName"
                >
                    <template
                        v-slot
                        v-if="DefalutPageConfig.imgName === 'not_network'"
                    >
                        <TButton class="btn" @touch="getTestList">
                            立即刷新
                        </TButton>
                    </template>
                </DefalutPage>
            </div>
        </div>
    </div>
</template>

<script>
import LeftList from "@/components/homeToolsPublic/leftList.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import DefalutPage from "@/components/FunctionalComp/DefalutPage.vue";
import { InfiniteScroll } from "element-ui";
import { mapGetters } from "vuex";
export default {
    components: {
        LeftList,
        TButton,
        DefalutPage,
    },
    data() {
        return {
            peportList: [],
            loading: false,
            currentSubjectCode: "",
            DefalutPageConfig: {
                imgName: "not_content",
                text: "暂时还没有内容", // 缺省页配置信息
            },
        };
    },
    created() {
        if (this.teachSubjects.length) {
            this.currentSubjectCode = this.teachSubjects[0].code;
            this.load();
        }
    },
    directives: {
        "infinite-scroll": InfiniteScroll,
    },
    computed: {
        ...mapGetters({
            teachSubjects: "teachSubjects",
        }),
        list() {
            return this.teachSubjects.map((item) => item.subjectName);
        },
    },
    methods: {
        leftUpdate(index) {
            const { teachSubjects } = this;
            // code 为undefined 未处理

            this.currentSubjectCode = teachSubjects[index].code;
            this.load();
        },
        to() {
            this.$router.push({
                name: "Home",
            });
        },
        load() {
            this.loading = true;
            const arr = [
                {
                    id: 1,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 2,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 3,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 4,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 5,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 6,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 7,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 8,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 9,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 10,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 11,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 12,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 13,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 14,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 15,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 16,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 17,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 18,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 19,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 20,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
                {
                    id: 21,
                    date: "2021.11.29",
                    num: 2,
                    startTime: "",
                    endTime: "",
                },
            ];
            setTimeout(() => {
                this.peportList.push(...arr);
                this.loading = false;
            }, 500);
        },
    },
};
</script>

<style lang="less" scoped>
// .class_peport {
//     width: 100%;
//     height: 100%;
//     display: flex;
//     background: #f0f5fd;

//     .left {
//         width: 2.58rem;
//         height: 10.92rem;
//         background: #ffffff;
//         box-shadow: 0rem 0rem 0.04rem 0rem rgba(180, 180, 180, 0.5);
//         border-radius: 0 0 0.21rem 0rem;
//     }
//     .right {
//         flex: 1;
//         height: 10.92rem;
//         padding: 0.22rem 0.24rem 0;
//         .top {
//             height: 0.6rem;
//             display: flex;
//             margin-bottom: 0.35rem;
//             box-sizing: content-box;
//             .btn1 {
//                 width: 0.8rem;
//                 height: 100%;
//                 font-size: 0.26rem;
//                 background: #ffffff;
//                 box-shadow: 0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5);
//                 border-radius: 0.08rem 0rem 0rem 0.08rem;
//                 font-weight: 400;
//                 color: #a8a8a8;
//                 margin-right: 0.1rem;
//             }
//             .btn2 {
//                 width: 1.3rem;
//                 height: 100%;
//                 font-size: 0.26rem;
//                 background: #f4f8ff;
//                 border-radius: 0rem 0.08rem 0.08rem 0rem;
//                 border: 0.01rem solid #3e83f8;
//                 font-weight: 400;
//                 color: #3e83f8;
//             }
//         }
//         .main {
//             width: 100%;
//             height: 100%;
//             height: calc(100% - 0.6rem - 0.35rem - 0.22rem);
//             padding: 0 0.5rem;
//             overflow: hidden;
//             ul {
//                 width: 100%;
//                 height: 100%;
//                 display: flex;
//                 flex-wrap: wrap;
//                 align-content: flex-start;
//                 overflow-y: scroll;
//                 li {
//                     width: 2.34rem;
//                     height: 2.67rem;
//                     background: #ffffff;
//                     border-radius: 0.16rem;
//                     margin: 0 0.15rem 0.3rem;
//                     display: flex;
//                     flex-direction: column;
//                     align-items: center;
//                     cursor: pointer;
//                     user-select: none;
//                     img {
//                         width: 1rem;
//                         height: 1rem;
//                         margin: 0.4rem 0 0.16rem;
//                     }
//                     span {
//                         font-size: 0.26rem;
//                         font-weight: 400;
//                         color: #333333;
//                     }
//                     .date {
//                         margin-bottom: 0.08rem;
//                     }
//                 }
//             }
//         }
//     }
// }

.class_peport {
    display: flex;
    color: #333;
    flex-direction: column;
    height: 100%;
    background: #f0f5fd;
    .head-button {
        display: flex;
        height: 0.81rem;
        align-items: center;
        padding-left: 0.2rem;
        .btn1 {
            width: 0.8rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #ffffff;
            box-shadow: 0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5);
            border-radius: 0.08rem 0rem 0rem 0.08rem;
            font-weight: 400;
            color: #a8a8a8;
            margin: 0 0.1rem 0 0;
        }
        .btn2 {
            width: 1.3rem;
            height: 0.6rem;
            font-size: 0.26rem;
            background: #f4f8ff;
            border-radius: 0rem 0.08rem 0.08rem 0rem;
            border: 0.01rem solid #3e83f8;
            font-weight: 400;
            color: #3e83f8;
        }
    }
    .class-peport-main {
        // display: flex;
        flex: 1;
        width: 100%;
        .main-container {
            display: flex;
            .left-box {
                width: 2.58rem;
                height: 9.27rem;
                background-color: #fff;
                border-radius: 0 0.21rem 0.21rem 0;
            }
            .main {
                // width: 100%;
                // height: 100%;
                // height: calc(100% - 0.6rem - 0.35rem - 0.22rem);
                // padding: 0 0.5rem;
                // overflow: hidden;
                flex: 1;
                height: 9.27rem;
                margin-left: 0.24rem;
                // padding: 0 0.24rem 0;

                ul {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                    padding: 0 0.5rem;

                    overflow-y: scroll;
                    li {
                        width: 2.34rem;
                        height: 2.67rem;
                        background: #ffffff;
                        border-radius: 0.16rem;
                        margin: 0 0.15rem 0.3rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        cursor: pointer;
                        user-select: none;
                        img {
                            width: 1rem;
                            height: 1rem;
                            margin: 0.4rem 0 0.16rem;
                        }
                        span {
                            font-size: 0.26rem;
                            font-weight: 400;
                            color: #333333;
                        }
                        .date {
                            margin-bottom: 0.08rem;
                        }
                        // &:nth-child(-n + 6):nth-child(n + 3) {
                        //     background: #000;
                        // }
                        // &:nth-child(-n + 6) {
                        //     margin-top: 0;
                        // }
                    }
                }
            }
        }
        .default{
            height: 100%;
        }
    }

    // .right-box {
    //     flex: 1;
    //     margin-left: 0.24rem;
    //     .right-main {
    //         width: 16.67rem;
    //         height: 9.27rem;
    //         border-radius: 0.21rem;
    //         background-color: #fff;
    //         padding: 0 0.52rem 0.5rem 0.58rem;
    //         box-sizing: border-box;
    //         display: flex;
    //         flex-direction: column;
    //     }
    // }
}
</style>