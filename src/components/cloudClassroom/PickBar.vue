<template>
  <div :class="['pick-bar', pickbarVisible ? 'pickbar_active' : '']">
    <!-- 左侧选人栏 -->
    <div class="arrow-bar" v-touch="changeActive">
      <i class="iconfont icon-arrow-left"></i>
      <img src="@/assets/img/cloudClassroom/reward.png" alt="" />
    </div>
    <div class="bar-con">
      <div class="con-top">
        <div class="student_con" ref="scrollDom" @scroll="roll">
          <div
            :class="[
              'group',
              needAnimHash === ele.flag ? 'twinkleAnimate' : '',
            ]"
            v-for="ele in formatStudentList"
            :key="ele.flag"
          >
            <i :id="ele.flag" :ref="ele.flag"></i>
            <label
              v-for="(item, index) in ele.sameStudentList"
              :for="`${ele.flag}-${index}`"
              :key="index"
              class="my-label"
            >
              <span
                class="label-left"
                v-touch="
                  () => {
                    touchItem(item);
                  }
                "
              >
                <!-- <img :src="item.photoUrl" alt="" /> -->
                <span class="avatar">
                  {{ item.name.slice(0, 1) }}
                </span>
                <span class="name">{{ item.name }}</span>
              </span>
              <!-- <input
                                type="checkbox"
                                class="label-right"
                                :checked="item.checked"
                                v-model="item.checked"
                                @change="singleChange"
                                :id="`${ele.flag}-${index}`"
                            />
                            <span class="my-checkbox">
                                <i
                                    class="iconfont icon-iconfontcheck my-icon"
                                ></i>
                            </span> -->
            </label>
          </div>
        </div>
        <ul class="word_con">
          <li
            :class="hashActive === item ? 'active' : ''"
            v-for="item in hashList"
            :key="item"
          >
            <a
              v-touch="
                () => {
                  skipHash(item);
                }
              "
              >{{ item }}</a
            >
          </li>
        </ul>
      </div>
      <div class="con-bottom">
        <TButton
          class="reward"
          @touch="reward"
          :disabled="disabled || !studentList.length"
        >
          <span>一键奖励</span>
          <img
            class="btn-img"
            src="@/assets/img/cloudClassroom/reward.png"
            alt=""
          />
        </TButton>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapGetters, mapActions } from "vuex";
import TButton from "@/components/FunctionalComp/TButton.vue";
const { mapState, mapMutations } = createNamespacedHelpers("cloudClassroom");
let scrollTimer, timer;
export default {
  components: { TButton },
  data() {
    return {
      hashList: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      allSelect: false,
      hashActive: "", // 激活的锚点
      needAnimHash: "", // 需要展示动画的 dom 标记，它和 hashActive 保持一致，只是在元素滚动结束之后赋值
    };
  },
  computed: {
    ...mapState({
      attendClass: (state) => state.attendClass,
      pickbarVisible: (state) => state.pickbarVisible,
      disabled: (state) => state.reward.disabled,
    }),
    ...mapGetters({
      studentList: "studentList",
      schoolCode: "schoolCode",
    }),
    subject() {
      return this.$store.state.inCloudClassroom.classroomInfo.subjectName;
    },
    formatStudentList() {
      // 格式化 学生数组
      // const t = [
      // 每个对象表示 一个包含所有姓名首字母相同的学生 组
      // {
      //     flag: "", // 表示首字母
      //     sameStudentList: [
      //         // 每个学生
      //         {},
      //     ],
      // },
      // ];
      const s = Array.from(
        new Set(this.studentList.map((item) => item.nameList[0]))
      ).sort(); // 该班所有学生的首字母

      return s.map((item) => ({
        flag: item,
        sameStudentList: this.studentList.filter(
          (ele) => ele.nameList[0] === item
        ),
      }));
    },
  },
  // created() {
  //     // 待注释 ---------------------
  //     const data = {
  //         clazzCode: this.attendClass[1],
  //         gradeCode: this.attendClass[0],
  //         page: 1,
  //         pageSize: 999,
  //         schoolCode: this.schoolCode,
  //     };
  //     this.getAllStudent(data);
  // },
  methods: {
    ...mapActions({
      // getAllStudent: "student/getAllStudent",
      openReward: "cloudClassroom/reward/openReward",
    }),
    ...mapMutations({
      setState: "setState",
      rewardSet: "reward/setState",
    }),
    changeActive() {
      this.setState({
        key: "pickbarVisible",
        value: !this.pickbarVisible,
      });
    },
    skipHash(hash) {
      // 跳转锚点
      const dom = this.$refs.scrollDom;
      const prevScrollPosition = dom.scrollTop;
      if (this.hashActive !== hash) {
        this.hashActive = hash;
        if (this.$refs[hash]) {
          this.$refs[hash][0].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // 根据两次滚动条的距离判断是否发生了滚动，为了解决元素不滚动时不触发动画的问题，添加一个定时器，避免触发两次动画
          timer = setTimeout(() => {
            const targetScrollPosition = dom.scrollTop;
            if (prevScrollPosition === targetScrollPosition) {
              this.addAndRemoveAnimate();
            }
            clearTimeout(timer);
          }, 50);
        }
      } else {
        this.addAndRemoveAnimate();
      }
    },
    roll() {
      // 元素的滚动事件
      // this.$nextTick(() => {
      //     this.addAndRemoveAnimate();
      // });
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.addAndRemoveAnimate();
        clearTimeout(scrollTimer);
      }, 50);
    },
    addAndRemoveAnimate() {
      // 添加与移除动画
      this.needAnimHash = this.hashActive;
      const temTimer = setTimeout(() => {
        this.needAnimHash = "";
        clearTimeout(temTimer);
      }, 500);
    },
    // allSelectChange(flag) {
    //     // 全选按钮状态改变触发的事件处理函数
    //     for (let i = 0; i < this.studentList.length; i++) {
    //         const e = this.studentList[i];
    //         e.checked = flag;
    //     }
    // },
    // singleChange() {
    //     // 全选按钮状态改变触发的事件处理函数
    //     for (let i = 0; i < this.studentList.length; i++) {
    //         const e = this.studentList[i];
    //         if (!e.checked) {
    //             if (this.allSelect) this.allSelect = false;
    //             return;
    //         }
    //     }
    //     this.allSelect = true;
    // },
    touchItem(item) {
      // this.rewardSet({ key: "visible", value: true });

      // this.rewardSet({ key: "visible", value: true });
      this.openReward({ studentList: [item], type: 1 });
      // 看板
      this.$store.dispatch("inCloudClassroom/dataRecords", {
        type: "flower",
        ids: [item].map((item) => item.id),
      });
      // 埋点
      this.data_triggerEvent(
        {
          eventId: "rewardSingle",
          extraInfo: {
            subject: this.subject,
          },
        },
        true
      );
    },
    reward() {
      // 一键奖励
      // const studentArray = [];
      // for (let i = 0; i < this.studentList.length; i++) {
      //     const e = this.studentList[i];
      //     if (e.checked) {
      //         studentArray.push(e);
      //         e.checked = false;
      //     }
      // }
      // if (studentArray.length) {
      //     // 界面展示
      //     if (this.allSelect) {
      //         this.allSelect = false;
      //     }
      // }

      // this.rewardSet({ key: "visible", value: true });

      // this.openReward(this.studentList);
      this.openReward({ type: 0 });
      // 看板
      this.$store.dispatch("inCloudClassroom/dataRecords", {
        type: "flower",
      });
      // 埋点
      this.data_triggerEvent(
        {
          eventId: "rewardAll",
          extraInfo: {
            subject: this.subject,
          },
        },
        true
      );
    },
  },
};
</script>

<style lang="less" scoped>
@blue1: #3e83f8;
.pick-bar {
  position: absolute;
  height: 10.63rem;
  width: 2.2rem;
  top: 50%;
  right: -2.19rem;
  transform: translate(0%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  transition: right 0.3s;
  border-radius: 0.16rem;
  .arrow-bar {
    width: 1.1rem;
    height: 0.88rem;
    background: #ffffff;
    box-shadow: 0rem 0rem 0.09rem 0rem #dfe7f2;
    border-radius: 1.04rem 0rem 0rem 1.04rem;
    position: absolute;
    left: -1.08rem;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.23rem;
    opacity: 0.5;
    transition: opacity 0.3s;
    .iconfont {
      font-size: 0.38rem;
      transform-origin: center;
      transition: transform 0.3s;
    }
    img {
      width: 0.36rem;
      height: 0.36rem;
    }
  }
  .bar-con {
    width: 2.19rem;
    height: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0rem 0rem 0.1rem 0rem #dfe7f2;
    .con-top {
      // height: 9.2rem;
      height: 10rem;
      width: 100%;
      display: flex;
      padding: 0.3rem 0.2rem;
      .word_con {
        height: 100%;
        width: 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        li {
          width: 100%;
          height: 0.27rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          a {
            font-size: 0.22rem;
            font-weight: 400;
            color: #333333;
            transition: color 0.3s;
          }
        }
        .active {
          background: #508ef9;
          a {
            color: #fff;
          }
        }
      }
      .student_con {
        width: 1.4rem;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        padding-left: 0.23rem;
        .group {
          display: flex;
          flex-direction: column;
          width: 100%;
          .my-label {
            width: 100%;
            height: 1rem;
            display: flex;
            // margin: 0.1rem 0;
            margin-bottom: 0.2rem;
            .label-left {
              width: 0.9rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              // img {
              //     width: 0.69rem;
              //     height: 0.69rem;
              //     border-radius: 50%;
              // }
              .avatar {
                width: 0.7rem;
                height: 0.7rem;
                border-radius: 50%;
                background: @blue1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.35rem;
                font-weight: 600;
                color: #ffffff;
              }
              .name {
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 0.25rem;
                font-weight: 500;
                color: #333333;
              }
            }
            .label-right {
              display: none;
            }
            .my-checkbox {
              margin-top: 0.25rem;
              margin-left: 0.13rem;
              width: 0.25rem;
              height: 0.25rem;
              border-radius: 0.04rem;
              border: 0.01rem solid #979797;
              cursor: pointer;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: background 0.3s;
              .my-icon {
                text-align: center;
                color: #fff;
                font-size: 0.18rem;
                opacity: 0;
                transition: opacity 0.3s;
              }
            }
            input[type="checkbox"]:checked + .my-checkbox {
              background: @blue1;
              .my-icon {
                opacity: 1;
              }
            }
          }
          &:last-child {
            .my-label {
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        .twinkleAnimate {
          animation: twinkle 0.5s ease-out;
        }
        @keyframes twinkle {
          0% {
            background: rgba(62, 131, 248, 0);
          }
          25% {
            background: rgba(62, 131, 248, 0.4);
          }
          50% {
            background: rgba(62, 131, 248, 0.8);
          }
          75% {
            background: rgba(62, 131, 248, 0.4);
          }
          100% {
            background: rgba(62, 131, 248, 0);
          }
        }
      }
    }
    .con-bottom {
      width: 100%;
      padding: 0 0.14rem 0.3rem;
      display: flex;
      justify-content: center;
      // justify-content: space-between;
      // label {
      //     display: flex;
      //     align-items: center;
      //     input[type="checkbox"] {
      //         display: none;
      //     }
      //     .my-checkbox {
      //         width: 0.2rem;
      //         height: 0.2rem;
      //         border-radius: 0.04rem;
      //         border: 0.01rem solid #979797;
      //         cursor: pointer;
      //         display: flex;
      //         justify-content: center;
      //         align-items: center;
      //         transition: background 0.3s;
      //         .my-icon {
      //             text-align: center;
      //             color: #fff;
      //             font-size: 0.16rem;
      //             opacity: 0;
      //             transition: opacity 0.3s;
      //         }
      //     }
      //     input[type="checkbox"]:checked + .my-checkbox {
      //         background: @blue1;
      //         .my-icon {
      //             opacity: 1;
      //         }
      //     }
      //     .span-text {
      //         font-size: 0.17rem;
      //         font-family: PingFangSC-Regular, PingFang SC;
      //         font-weight: 400;
      //         color: #333333;
      //         margin-left: 0.04rem;
      //     }
      // }
      .reward {
        width: 1.54rem;
        height: 0.54rem;
        border-radius: 0.08rem;
        border-radius: 0.08rem;
        font-size: 0.23rem;
        font-weight: 600;
        .btn-img {
          width: 0.26rem;
          height: 0.26rem;
          margin-left: 0.05rem;
        }
      }
    }
  }
}
.pickbar_active {
  right: 0.1rem;
  .arrow-bar {
    opacity: 1;
    .iconfont {
      transform: rotate(180deg);
    }
  }
}
</style>