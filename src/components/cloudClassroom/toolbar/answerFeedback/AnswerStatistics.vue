<template>
  <div :class="['answer', answerHide ? 'hide' : '']">
    <!-- 答题统计 -->
    <div class="top">
      <button v-touch="hide">隐藏</button>
    </div>
    <div class="main">
      <div class="left">
        <div class="l-top">
          <div class="title">
            <span class="strip"></span>
            <span class="span-text">答题统计</span>
          </div>
          <div class="correct">
            <div class="correct-left">
              <span class="correct-text">正确答案：</span>
              <span class="correct-option">{{ formatCorrectAnswer }}</span>
            </div>
            <TButton
              class="reward-btn"
              @touch="reward"
              :disabled="disabled || !choicePerson.correct.length"
            >
              <span>一键奖励</span>
              <img src="@/assets/img/cloudClassroom/reward.png" alt="" />
            </TButton>
          </div>
        </div>
        <div class="l-main">
          <SelectQuesChart />
        </div>
        <div class="l-foot">
          <div class="foot-left">
            <span class="span-text"
              >答题人数：<span>{{ finishStudentList.length }}</span
              >/{{ studentList.length }}</span
            >
          </div>
          <div class="foot-right">
            <span class="span-text"
              >正确率：<span>{{ correctRate }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <span class="strip"></span>
          <span class="span-text">答题情况</span>
        </div>
        <div class="container">
          <div class="c-top">
            <div class="ct-left">
              <ul class="ct-left">
                <!-- <li
                                    :class="
                                        rightOptionActive === item.content
                                            ? 'active'
                                            : ''
                                    "
                                    :style="{
                                        marginRight:
                                            formatOptions.length > 7
                                                ? `${
                                                      0.25 /
                                                      formatOptions.length
                                                  }rem`
                                                : '0.25rem',
                                    }"
                                    v-for="item in formatOptions"
                                    :key="item.content"
                                    v-touch="
                                        () => {
                                            changeRightOption(item.content);
                                        }
                                    "
                                >
                                    {{ item.content }}
                                </li> -->
                <li
                  :class="rightOptionActive === item.content ? 'active' : ''"
                  v-for="item in formatOptions"
                  :key="item.content"
                  v-touch="
                    () => {
                      changeRightOption(item.content);
                    }
                  "
                >
                  {{ item.content }}
                </li>
              </ul>
            </div>
            <!-- <div class="ct-right">
                            <TButton
                                class="reward"
                                @touch="reward"
                                :disabled="
                                    disabled || !choicePerson.correct.length
                                "
                                v-show="showRewardBtn"
                            >
                                <span>一键奖励</span>
                                <img
                                    src="@/assets/img/cloudClassroom/reward.png"
                                    alt=""
                                />
                            </TButton>
                        </div> -->
          </div>
          <div class="c-main">
            <ul class="c-ul">
              <li v-for="item in formatStudent" :key="item.id">
                <span class="avatar">
                  {{ item.name.slice(0, 1) }}
                </span>
                <span class="name">{{ item.name }}</span>
              </li>
            </ul>
          </div>
          <div class="c-footer">
            <!-- <button>随机抽人</button> -->
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <button v-touch="endAnswer">结束答题</button>
    </div>
  </div>
</template>

<script>
import SelectQuesChart from "@/components/cloudClassroom/toolbar/answerFeedback/SelectQuesChart.vue";
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapState, mapMutations, mapActions } =
  createNamespacedHelpers("cloudClassroom");
import sendMessage from "@/utils/sendMessage";
import TButton from "@/components/FunctionalComp/TButton.vue";
export default {
  name: "AnswerStatistics",
  components: {
    TButton,
    SelectQuesChart,
  },
  data() {
    return {
      rightOptionActive: "全部",
    };
  },
  computed: {
    ...mapState({
      strongId: (state) => state.toolbar.strongId,
      options: (state) => state.toolbar.choice.options,
      singleOrMult: (state) => state.toolbar.choice.singleOrMult,
      choiceCorrectAnswer: (state) => state.toolbar.choice.correctAnswer, // 正确答案
      choiceFinishStudentList: (state) =>
        state.toolbar.choice.finishStudentList, // 已经完成作答的学生
      judgeFinishStudentList: (state) => state.toolbar.judge.finishStudentList,
      judgeCorrectAnswer: (state) => state.toolbar.judge.correctAnswer,
      answerHide: (state) => state.toolbar.answer.answerHide,
      disabled: (state) => state.reward.disabled,
    }),
    ...mapGetters({
      choiceCorrectRate: "cloudClassroom/toolbar/choice/correctRate",
      judgeCorrectRate: "cloudClassroom/toolbar/judge/correctRate",
      choiceChoicePerson: "cloudClassroom/toolbar/choice/choicePerson",
      judgeChoicePerson: "cloudClassroom/toolbar/judge/choicePerson",
      studentList: "studentList", // 所有学生
    }),
    subject() {
      return this.$store.state.inCloudClassroom.classroomInfo.subjectName;
    },
    formatCorrectAnswer() {
      // 格式化正确答案
      let str = "";
      if (this.strongId === 11) {
        if (this.singleOrMult) {
          // 多选
          str = this.choiceCorrectAnswer.join(" ");
        } else {
          str = this.choiceCorrectAnswer;
        }
      } else if (this.strongId === 12) {
        str = this.judgeCorrectAnswer === 1 ? "正确" : "错误";
      }
      return str;
    },
    correctRate() {
      if (this.strongId === 11) {
        return this.choiceCorrectRate;
      } else if (this.strongId === 12) {
        return this.judgeCorrectRate;
      }
    },
    choicePerson() {
      if (this.strongId === 11) {
        return this.choiceChoicePerson;
      } else if (this.strongId === 12) {
        return this.judgeChoicePerson;
      }
    },
    finishStudentList() {
      let t;
      if (this.strongId === 11) {
        t = this.choiceFinishStudentList;
      } else if (this.strongId === 12) {
        t = this.judgeFinishStudentList;
      }
      return t;
    },
    formatOptions() {
      // 格式化选项，添加 全部 按钮
      if (this.singleOrMult || this.strongId === 12) {
        // 多选
        return [
          {
            content: "全部",
          },
          {
            content: "正确",
          },
          {
            content: "错误",
          },
        ];
      } else {
        // 单选
        const temArr = [...this.options];
        temArr.unshift({
          content: "全部",
        });
        return temArr;
      }
    },
    formatStudent() {
      // 获得 作答的学生
      const temArr = []; // 所有完成的学生
      console.log(this.finishStudentList);
      console.log(this.studentList);
      for (let i = 0; i < this.finishStudentList.length; i++) {
        const e = this.finishStudentList[i];
        const t = this.studentList.find((item) => item.id === e.studentId);
        if (t) {
          temArr.push({
            id: t.id,
            name: t.name,
            photoUrl: t.photoUrl,
            selectOption: e.selectOption,
          });
        }
      }
      if (this.singleOrMult || this.strongId === 12) {
        // 多选
        const correct = this.choicePerson.correct;
        const error = this.choicePerson.error;
        let target;
        switch (this.rightOptionActive) {
          case "正确": {
            const arr = [];
            console.log(temArr);
            console.log(correct);
            for (let i = 0; i < correct.length; i++) {
              const e = correct[i];
              const t = temArr.find((item) => item.id === e.studentId);
              arr.push(t);
            }
            target = arr;
            break;
          }
          case "错误": {
            const arr = [];
            console.log(temArr);
            console.log(error);
            for (let i = 0; i < error.length; i++) {
              const e = error[i];
              const t = temArr.find((item) => item.id === e.studentId);
              arr.push(t);
            }
            target = arr;
            break;
          }
          default:
            // 全部
            target = temArr;
            break;
        }
        return target;
      } else {
        // 单选
        if (this.rightOptionActive === "全部") {
          return temArr;
        } else {
          return temArr.filter(
            (item) => item.selectOption === this.rightOptionActive
          );
        }
      }
    },
    // showRewardBtn() {
    //     // 展示一键奖励按钮
    //     if (this.singleOrMult || this.strongId === 12) {
    //         // 多选
    //         return this.rightOptionActive === "正确" ? true : false;
    //     } else {
    //         // 单选
    //         return this.rightOptionActive === this.choiceCorrectAnswer
    //             ? true
    //             : false;
    //     }
    // },
  },
  methods: {
    ...mapMutations({
      choiceReset: "toolbar/choice/resetState",
      judgeReset: "toolbar/judge/resetState",
      floatWindowReset: "toolbar/floatWindow/resetState",
      floatWindowSet: "toolbar/floatWindow/setState",
      answerSet: "toolbar/answer/setState",
      toolSet: "toolbar/setState",
    }),
    ...mapActions({
      openReward: "reward/openReward",
    }),
    changeRightOption(content) {
      // 点击右侧选项
      if (this.rightOptionActive !== content) this.rightOptionActive = content;
    },
    reward() {
      // 一键奖励功能
      // 发消息 -->  奖励学生
      // 界面展示
      const needRewardStudentList = [];
      for (let i = 0; i < this.choicePerson.correct.length; i++) {
        const e = this.choicePerson.correct[i];
        const target = this.studentList.find((item) => item.id === e.studentId);
        if (target) {
          needRewardStudentList.push({
            id: target.id,
            name: target.name,
          });
        }
      }
      console.log(needRewardStudentList);
      this.openReward({ studentList: needRewardStudentList, type: 2 });
      // 看板
      this.$store.dispatch("inCloudClassroom/dataRecords", {
        type: "flower",
        ids: needRewardStudentList.map((item) => item.id),
      });
      // 埋点
      this.data_triggerEvent(
        {
          eventId: "rewardCorrect",
          extraInfo: {
            subject: this.subject,
          },
        },
        true
      );
    },
    endAnswer() {
      // 结束答题
      // 看板
      this.$store.dispatch("inCloudClassroom/dataRecords", {
        type: "correct",
        ids: this.choicePerson.correct.map((item) => item.studentId),
      });

      let extension, content;
      if (this.strongId === 11) {
        extension = { flag: 0 };
        content = "ccl_3";
        this.choiceReset();
      } else if (this.strongId === 12) {
        extension = { flag: 0 };
        content = "ccl_4";
        this.judgeReset();
      }
      this.floatWindowReset();
      const data = {
        content,
        extension: JSON.stringify(extension),
      };

      sendMessage(data).then((res) => {
        console.log(res);
        this.toolSet({ key: "strongId", value: 0 });
        this.answerSet({ key: "visible", value: false });
        this.floatWindowSet({ key: "visible", value: false });
      });
    },
    hide() {
      // 隐藏
      // this.answerSet({ key: "visible", value: false });
      this.answerSet({ key: "answerHide", value: true });
    },
  },
};
</script>

<style lang="less" scoped>
@blue1: #3e83f8;
.answer {
  width: 100%;
  height: 100%;
  padding: 0.4rem 0.52rem;
  background: #f0f5fd;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  // transform: scale(1);
  // transform-origin: top right;
  // transition: all 0.5s ease-in-out;
  .top {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.2rem;
    button {
      width: 0.94rem;
      height: 0.38rem;
      background: rgba(62, 131, 248, 0.1);
      border-radius: 0.04rem;
      border: 0.01rem solid @blue1;
      font-size: 0.17rem;
      font-weight: 500;
      color: @blue1;
    }
  }
  .main {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.42rem;
    .left {
      width: 7.75rem;
      height: 8.63rem;
      background: #ffffff;
      border-radius: 0.21rem;
      padding: 0.3rem 0.58rem 0.42rem;
      .l-top {
        // display: flex;
        .title {
          display: flex;
          align-items: center;
          .strip {
            width: 0.04rem;
            height: 0.23rem;
            background: @blue1;
            border-radius: 0.02rem;
            margin-right: 0.06rem;
          }
          .span-text {
            font-size: 0.25rem;
            font-weight: 500;
            color: #333333;
          }
        }
        .correct {
          margin-top: 0.9rem;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          .correct-left {
            display: flex;
            align-items: baseline;
            .correct-text {
              font-size: 0.23rem;
              font-weight: 400;
              color: #333333;
            }
            .correct-option {
              font-size: 0.4rem;
              color: @blue1;
            }
          }
          .reward-btn {
            width: 1.4rem;
            height: 0.42rem;
            margin-left: 0.38rem;
            background: rgba(253, 81, 35, 0.1);
            border-radius: 0.08rem;
            border: 0.01rem solid #fd5123;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              font-size: 0.19rem;
              font-weight: 600;
              color: #fd5123;
              margin-right: 0.08rem;
            }
            img {
              width: 0.21rem;
              height: 0.21rem;
              border-radius: 50%;
            }
          }
        }
      }
      .l-main {
        height: 5.7rem;
        width: 100%;
      }
      .l-foot {
        display: flex;
        padding: 0 1rem;
        justify-content: space-between;
        .foot-left,
        .foot-right {
          .span-text {
            font-size: 0.25rem;
            font-weight: 500;
            color: #666666;
            span {
              color: @blue1;
            }
          }
        }
      }
    }
    .right {
      width: 10.96rem;
      height: 8.63rem;
      background: #ffffff;
      border-radius: 0.21rem;
      padding: 0.3rem 0.58rem 0.46rem;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 0.38rem;
        .strip {
          width: 0.04rem;
          height: 0.23rem;
          background: @blue1;
          border-radius: 0.02rem;
          margin-right: 0.06rem;
        }
        .span-text {
          font-size: 0.25rem;
          font-weight: 500;
          color: #333333;
        }
      }
      .container {
        .c-top {
          display: flex;
          margin-bottom: 0.35rem;
          height: 0.42rem;
          .ct-left {
            flex: 1;
            ul {
              display: flex;
              li {
                margin-right: 0.22rem;
                width: 0.92rem;
                height: 0.38rem;
                border-radius: 0.19rem;
                border: 0.01rem solid #979797;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.23rem;
                font-weight: 500;
                color: #666666;
                // margin-right: 0.25rem;
                transition: all 0.3s;
              }
              .active {
                background: @blue1;
                color: #ffffff;
                border-color: @blue1;
              }
            }
          }
        }
        .c-main {
          height: 5.9rem;
          width: 100%;
          padding-bottom: 0.3rem;
          overflow: hidden;
          .c-ul {
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            height: 100%;
            width: 100%;
            overflow: scroll;
            li {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              width: 0.88rem;
              height: 1.22rem;
              margin-bottom: 0.25rem;
              margin: 0 0.17rem 0.25rem 0.17rem;
              .avatar {
                width: 0.88rem;
                height: 0.88rem;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.42rem;
                color: #fff;
                background: @blue1;
              }
              .name {
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 0.21rem;
                font-weight: 500;
                color: #333333;
              }
            }
          }
        }
        .c-footer {
          display: flex;
          justify-content: center;
          button {
            width: 1.67rem;
            height: 0.52rem;
            background: rgba(62, 131, 248, 0.1);
            border-radius: 0.08rem;
            border: 0.01rem solid @blue1;
            font-size: 0.25rem;
            font-weight: 600;
            color: @blue1;
          }
        }
      }
    }
  }
  .foot {
    display: flex;
    justify-content: center;
    button {
      width: 5.42rem;
      height: 0.83rem;
      background: @blue1;
      border-radius: 0.08rem;
      font-size: 0.21rem;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
  }
}
.hide {
  // transform: scale(0);
  z-index: -1;
}
</style>