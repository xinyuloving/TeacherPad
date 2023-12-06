<template>
    <div class="question">
        <div class="container">
            <div class="left">
                <!-- <div class="logo">
          <img
            src="../../../assets/img/home/homeTools/PrepareLessons/logo.png"
            alt=""
          />
        </div> -->
                <ul class="list-group">
                    <li
                        v-for="item in options"
                        :key="item.id"
                        :class="{
                            active: active === item.id,
                        }"
                        v-touch="
                            () => {
                                liTouch(item.id);
                            }
                        "
                    >
                        <div class="box"></div>
                        <img :src="item.imgUrl" alt="" />
                        <span>{{ item.content }}</span>
                    </li>
                </ul>
            </div>
            <div class="right-perpare">
                <div class="bt-wrap">
                    <TButton class="index" @touch="returnPage"> 首页 </TButton>
                    <TButton class="title"> 题库助手 </TButton>
                    <!-- <TButton
                        content="首页"
                        class="index"
                        :configItems="{
                            width: '0.8rem',
                            height: '0.6rem',
                            fontSize: '0.26rem',
                            color: '#A8A8A8',
                            background: '#FFFFFF',
                            fontWeight: 400,
                            borderRadius: '0.08rem 0rem 0rem 0.08rem',
                            boxShadow:
                                '0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5)',
                        }"
                        @touch="returnPage"
                    />
                    <p style="width: 0.08rem"></p>
                    <TButton
                        content="题库助手"
                        class="title"
                        :configItems="{
                            width: '1.3rem',
                            height: '0.6rem',
                            fontSize: '0.26rem',
                            background: '#FFFFFF',
                            color: '#3E83F8',
                            fontWeight: 400,
                            borderRadius: '0rem 0.08rem 0.08rem 0rem',
                            border: '0.01rem solid #3E83F8',
                        }"
                    /> -->
                </div>
                <div class="prepare-lessons">
                    <!-- 一级目录 -->
                    <TAbleBox @skip="reskip" :active="active" />
                    <!-- 二级目录 -->
                    <!-- <SecBox :book="book.Key" v-else /> -->
                </div>
            </div>
            <!-- <div class="school-resources" v-show="active === 2">
        <h3>校本题库div中所写东西</h3>
      </div> -->
        </div>
    </div>
</template>
<script>
import TButton from "../../../components/FunctionalComp/TButton.vue";
import TAbleBox from "../../../components/homeTools/question/questionLibrary-rightTable.vue";
// import MyLibrary from "../../../assets/img/home/homeTools/QuestionLibrary/my-library.png";
import SchoolLibrary from "../../../assets/img/home/homeTools/QuestionLibrary/school-library.png";
import { mapMutations } from "vuex";
export default {
    name: "PrepareLessons",
    components: {
        TButton,
        TAbleBox,
    },
    data() {
        return {
            flag: true,
            active: 1,
            options: [
                {
                    id: 1,
                    content: "我的题库",
                    imgUrl: MyLibrary,
                },
                // {
                //   id: 2,
                //   content: "校本题库",
                //   imgUrl: SchoolLibrary,
                // },
            ],
            book: {},
        };
    },
    methods: {
        ...mapMutations(["setFolderId"]),
        liTouch(id) {
            this.active = id;
        },
        returnPage() {
            //      if (window.history.length <= 1) {
            //   this.$router.push({ path: "/zh-CN/home" });
            //   return false;
            // } else {
            //   }
            this.setFolderId("");
            this.$router.go(-1);
        },
        //
        reskip(books) {
            this.book = books;
            console.log(this.book);
            this.flag = false;
        },
    },
};
</script>
<style lang="less" scoped>
.question {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f4f9ff;
    .container {
        height: calc(100% - 0.83rem);
        display: flex;
        .left {
            float: left;
            width: 2.58rem;
            height: 10.09rem;
            background: #ffffff;
            box-shadow: 0rem 0rem 0.04rem 0rem rgba(180, 180, 180, 0.5);
            border-radius: 0rem 0rem 0.21rem 0rem;
            // .logo {
            //   height: 1.55rem;
            //   img {
            //     width: 0.54rem;
            //     height: 0.43rem;
            //     margin: 0.17rem 1.02rem 0 1.02rem;
            //   }
            //   span {
            //     margin: 0.65rem 0.8rem 0 0.8rem;
            //     width: 0.83rem;
            //     height: 0.21rem;
            //     font-size: 0.21rem;
            //     font-family: STYuanti-SC-Bold, STYuanti-SC;
            //     font-weight: bold;
            //     color: #424242;
            //     line-height: 0.21rem;
            //   }
            // }
            .list-group {
                width: 2.6rem;
                margin-top: 0.15rem;
                li {
                    width: 100%;
                    height: 0.91rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .box {
                        width: 0.1rem;
                        height: 0.91rem;
                        background: #3e83f8;
                        border-radius: 0.45rem;
                        position: absolute;
                        left: 0;
                    }
                    img {
                        width: 0.28rem;
                        margin-right: 0.22rem;
                        height: 0.27rem;
                        // margin: 0.3rem 0.18rem 0.29rem 0.54rem;
                        vertical-align: middle; //使文字和图片在一排显示
                    }
                    span {
                        // width: 0.83rem;
                        // height: 0.21rem;
                        font-size: 0.26rem;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        // margin: 0.34rem 0;
                        // line-height: 0.21rem;
                    }
                }
                .active {
                    color: #3e83f8;
                    background: #eef8ff;

                    // background: url("../../../assets/img/home/homeTools/PrepareLessons/bg.png");
                }
            }
        }
        .right-perpare {
            // height: 100%;
            // width: 100%;
            // display: flex;
            // /* co1umn 从上到下*/
            // flex-direction: column;
            // /* center代表垂直方向 */
            // justify-content: center;
            // background: #f0f5fd;
            // margin-top: 0.35rem;
            .bt-wrap {
                display: flex;
                height: 0.81rem;
                width: 100%;
                // background: #f0f5fd;
                margin: 0rem 0.08rem 0rem 0.24rem;
                .index {
                    margin-top: 0.25rem;
                    width: 0.8rem;
                    height: 0.6rem;
                    font-size: 0.26rem;
                    color: #a8a8a8;
                    background: #ffffff;
                    font-weight: 400;
                    border-radius: 0.08rem 0rem 0rem 0.08rem;
                    box-shadow: 0rem 0rem 0.1rem 0rem rgba(223, 223, 223, 0.5);
                }
                .title {
                    margin-top: 0.25rem;
                    width: 1.3rem;
                    height: 0.6rem;
                    font-size: 0.26rem;
                    background: #ffffff;
                    color: #3e83f8;
                    font-weight: 400;
                    border-radius: 0rem 0.08rem 0.08rem 0rem;
                    border: 0.01rem solid #3e83f8;
                }
            }
            .prepare-lessons {
                width: 16.67rem;
                height: 9rem;
                background: #ffffff;
                border-radius: 0.21rem;
                margin: 0.17rem 0.51rem 0.33rem 0.24rem;
            }
        }
    }
}
</style>
