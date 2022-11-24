<template>
  <TDialog
    :dialogConStyle="{
      width: '5.21rem',
      height: '2.98rem',
      background: '#F1F1F3',
    }"
    :visible="endClassVisible"
    :closeByTouchModal="true"
    @close="cancel"
    :appendToBody="true"
    customClass="end_class_dialog"
  >
    <!-- 结束上课弹窗 -->

    <template v-slot:header>
      <div class="head-con">
        <span>结束上课</span>
      </div>
    </template>
    <template v-slot:default>
      <div class="main-con">
        <div class="top">
          <span>亲爱的老师，确定退出上课模式吗</span>
        </div>
        <!-- <div class="bottom">
            <label for="end-checkbox">
              <input
                type="checkbox"
                name=""
                id="end-checkbox"
                v-model="checked"
              />
              <span class="my-checkbox">
                <i class="iconfont icon-iconfontcheck"></i>
              </span>
              <span>分享本节课件</span>
            </label>
          </div> -->
      </div>
    </template>
    <template v-slot:footer>
      <div class="footer-con">
        <TButton class="cancel" @touch="cancel"> 取消 </TButton>
        <TButton class="confirm" @touch="confirm"> 确认 </TButton>
      </div>
    </template>
  </TDialog>
</template>

<script>
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import { createNamespacedHelpers, mapState, mapGetters } from "vuex";
const { mapMutations, mapActions } = createNamespacedHelpers("cloudClassroom");
import sendMessage from "@/utils/sendMessage";
const startClassroomTimeStamp = Date.now(); // 进入云课堂的时间戳
export default {
  components: {
    TDialog,
    TButton,
  },
  data() {
    return {
      throttle: false, // 节流
    };
  },
  computed: {
    ...mapState({
      endClassVisible: (state) => state.cloudClassroom.toolbar.endClassVisible,
      subjectName: (state) => state.inCloudClassroom.classroomInfo.subjectName,
    }),
    ...mapGetters({
      studentList: "studentList",
    }),
  },
  methods: {
    ...mapMutations({
      setState: "toolbar/setState",
    }),
    ...mapActions({
      resetAll: "resetAll",
    }),
    cancel() {
      // 取消
      this.setState({ key: "endClassVisible", value: false });
      this.setState({ key: "toolActive", value: -1 });
    },
    async confirm() {
      // 确认
      // 结束上课 --> 发送消息
      try {
        if (this.throttle) return;
        this.throttle = true;
        // 获取全班答题正确率
        let total = 0,
          correctNum = 0;
        for (let i = 0; i < this.studentList.length; i++) {
          const e = this.studentList[i];
          total += e.questionNum; // 总题数
          correctNum += e.correctNum; // 答对的总题数
        }
        let correctRate = 0;
        if (total !== 0) {
          correctRate = Number((correctNum / total).toFixed(2));
          this.$store.commit("inCloudClassroom/setState", {
            key: "correctRate",
            value: correctRate,
          });
        }
        await sendMessage({
          content: "ccl_1", // 选择题判断题的全班答题正确率
          extension: JSON.stringify({ flag: 0, correctRate }),
        });
        // this.reSetAll();
        // this.resetState();
        // this.$store.commit("signCourseware/removeState");
        // this.$router.back();
        // this.$router.push({ path: "/teachingFeedback" });
      } finally {
        // 结束上课埋点
        this.data_triggerEvent({
          eventId: "endClass",
          /*   gradeCode: this.studentList.length
                        ? this.studentList[0].classInfo.gradeCode
                        : "",
                    classCode: this.studentList.length
                        ? this.studentList[0].classInfo.classCode
                        : "", */
          logValue: this.subjectName,
          extraInfo: {
            time: Math.ceil((Date.now() - startClassroomTimeStamp) / 1000),
          },
        });

        this.$store.commit("inCloudClassroom/emptyState");
        this.resetAll();
        this.$nextTick(() => {
          this.$router.push({ path: "/teachingFeedback" });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.end_class_dialog {
  .head-con {
    width: 100%;
    height: 0.65rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 0.01rem solid #dedede;
    span {
      font-size: 0.27rem;
      font-weight: 600;
      color: #333333;
    }
  }
  .main-con {
    height: 1.6rem;
    width: 100%;
    padding: 0.2rem 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .top {
      margin-bottom: 0.2rem;
      span {
        font-size: 0.23rem;
      }
    }
    .bottom {
      label {
        display: flex;
        align-items: center;
        input {
          display: none;
        }
        .my-checkbox {
          width: 0.28rem;
          height: 0.28rem;
          margin-right: 0.05rem;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s;
          border: 0.01rem solid #ddd;
          .iconfont {
            text-align: center;
            color: #fff;
            font-size: 0.14rem;
            opacity: 0;
            transition: opacity 0.3s;
          }
        }
        input[type="checkbox"]:checked + .my-checkbox {
          background: #0bc75b;
          .iconfont {
            opacity: 1;
          }
        }
      }
    }
  }
  .footer-con {
    width: 100%;
    height: 0.72rem;
    padding: 0 0.29rem;
    display: flex;
    justify-content: space-between;
    .cancel {
      width: 2.21rem;
      height: 0.51rem;
      border: 0.01rem solid #dcdcdc;
      color: #333333;
      background: #fff;
      font-weight: 400;
    }
    .confirm {
      width: 2.21rem;
      height: 0.51rem;
      font-weight: 400;
    }
  }
}
</style>
