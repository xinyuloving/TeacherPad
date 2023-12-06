<template>
  <div class="Choose-the-classroom" v-loading="loading">
    <div class="header">
      <div class="out" v-touch="close">
        <i class="iconfont icon-close"></i>
      </div>
    </div>
    <div class="classroom">
      <div class="title">选择上课教室</div>
      <div class="con-box">
        <div
          v-touch="
            () => {
              selectClassroom(index);
            }
          "
          v-for="(item, index) in classroomList"
          :key="index"
          :style="{
            background: item.isCheck ? '#3E83F8' : '#fff',
            color: item.isCheck ? '#fff' : '#3E83F8',
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="subject">
      <div class="title">确认当前科目</div>
      <div class="con-box">
        <div
          :style="{ background: '#3E83F8', color: '#fff' }"
          v-if="subjectName"
        >
          {{ subjectName }}
        </div>
        <div
          v-else
          v-touch="
            () => {
              selectSubject(index2);
            }
          "
          v-for="(item, index2) in subjectList"
          :key="index2"
          :style="{
            background: item.isCheck ? '#3E83F8' : '#fff',
            color: item.isCheck ? '#fff' : '#3E83F8',
          }"
        >
          {{ item.subjectName }}
        </div>
      </div>
    </div>
    <div class="floor">
      <TButton class="next" ref="next" @touch="next">下一步</TButton>
    </div>

    <TDialog
      :visible.sync="isDialog"
      :dialogConStyle="{
        background: '#F1F1F3',
        width: '5.3rem',
        height: '3rem',
        boxShadow: '0 0 10px 1px #c0c4cc',
      }"
      :wrapperStyle="{
        background: 'transparent',
      }"
    >
      <template v-slot:header>
        <div class="my-slot-head">提示</div>
      </template>
      <template>
        <div class="my-slot-content">该教室正在上课，是否继续操作！</div>
      </template>
      <template v-slot:footer>
        <div class="my-slot-floor">
          <TButton class="floor-but floor-left" @touch="confirmDisband"
            >确定</TButton
          >
          <TButton class="floor-but floor-right" @touch="isDialog = false"
            >取消</TButton
          >
        </div>
      </template>
    </TDialog>
  </div>
</template>

<script>
import TButton from "@/components/FunctionalComp/TButton.vue";
import { getDeskList } from "@/api/classroom";
import TIM from "tim-js-sdk";
import tim from "@/utils/im";
import { mapActions, mapMutations } from "vuex";
import { disbandGroup } from "@/api/im";
import TDialog from "@/components/FunctionalComp/TDialog.vue";
import { createTeacherIM } from "@/utils/util";
// import { getClassroomList } from "@/api/school"

export default {
  name: "ChooseTheClassroom",

  components: {
    TButton,
    TDialog,
  },

  props: {
    className: String,
    subjectName: String,
    type: Boolean,
  },

  data() {
    return {
      subjectList: [],
      classroomList: [],
      loading: false,
      isDialog: false,
    };
  },

  methods: {
    ...mapActions("imStore", ["createImGroup"]),
    ...mapActions("inCloudClassroom", ["sendToDevice"]),
    ...mapMutations("inCloudClassroom", ["setState", "createSeatingPlan"]),
    // 选择教室
    selectClassroom(index) {
      for (let i = 0; i < this.classroomList.length; i++) {
        if (index === i) {
          this.classroomList[i].isCheck = !this.classroomList[i].isCheck;
        } else {
          this.classroomList[i].isCheck = false;
        }
      }
    },
    // 选择科目
    selectSubject(index) {
      for (let i = 0; i < this.subjectList.length; i++) {
        if (index === i) {
          this.subjectList[i].isCheck = !this.subjectList[i].isCheck;
        } else {
          this.subjectList[i].isCheck = false;
        }
      }
    },
    // 确定解散群
    async confirmDisband() {
      try {
        // 获取已选中的教室和科目
        this.isDialog = false;
        this.loading = true;
        const classroom = this.classroomList.filter((item) => item.isCheck);
        const subject = this.subjectList.filter((item) => item.isCheck);
        await disbandGroup({
          groupId: "temp_mession_" + classroom[0].schoolCode + classroom[0].id,
        });
        this.createGroup(classroom[0], subject[0]);
      } catch (err) {
        this.$message({
          message: "进入教室失败，请重试!",
          type: "error",
        });
        console.log(err);
      }
    },
    // 下一步
    async next() {
      try {
        // 获取已选中的教室和科目
        const classroom = this.classroomList.filter((item) => item.isCheck);
        console.log(classroom);
        const subject = this.subjectList.filter((item) => item.isCheck);
        this.setState({
          key: "classroomInfo",
          value: {
            name: classroom[0].name,
            subjectName: subject[0].subjectName,
            row: classroom[0].rowsNumber,
            column: classroom[0].columnNumber,
            subjectCode: subject[0].code,
          },
        });
        // 判断是否选中教室和科目
        if (!classroom.length || !subject.length)
          return this.$message({
            message: "必须选择教室和科目",
            type: "error",
          });
        this.loading = true;

        // 通过群组id搜索群组：
        tim
          .searchGroupByID(
            "temp_mession_" + classroom[0].schoolCode + classroom[0].id
          )
          .then(async (imResponse) => {
            // const imId = "2000" + this.$store.getters.teacherId;
            const imId = createTeacherIM(this.$store.getters.teacherId);
            if (imId === imResponse.data.group.ownerID) {
              await disbandGroup({
                groupId:
                  "temp_mession_" + classroom[0].schoolCode + classroom[0].id,
              });
              this.createGroup(classroom[0], subject[0]);
            } else {
              this.loading = false;
              this.isDialog = true;
            }
          })
          .catch((imError) => {
            this.createGroup(classroom[0], subject[0]);
          });
      } catch (err) {
        this.loading = false;
        this.$message({
          message: "进入教室失败，请重试!",
          type: "error",
        });
        // console.log(err);
      }
    },
    // 创建群
    createGroup(classroom, subject) {
      setTimeout(async () => {
        try {
          // 获取当前教室的课桌列表
          const res = await getDeskList({
            classroomId: classroom.id,
          });
          // 创建im群组
          const groupID = await this.createImGroup({
            name: classroom.name,
            // type: TIM.TYPES.GRP_MEETING,
            type: TIM.TYPES.GRP_PUBLIC,
            groupID: "temp_mession_" + classroom.schoolCode + classroom.id,
            joinOption: TIM.TYPES.JOIN_OPTIONS_FREE_ACCESS,
          });
          // 向设备发送消息
          this.sendToDevice({ groupID, deviceList: res.data || [] });
          this.createSeatingPlan({
            column: classroom.columnNumber,
            row: classroom.rowsNumber,
          });
          this.$emit("begin", {
            subjectName: this.subjectName || subject.subjectName,
            className: classroom.name,
            row: classroom.rowsNumber,
            column: classroom.columnNumber,
            type: false,
            groupID,
          });
        } catch (err) {
          this.loading = false;
          this.$message({
            message: "进入教室失败，请重试!",
            type: "error",
          });
          console.log(err);
        }
      }, 200);
    },
    // 关闭
    close() {
      this.$emit("update:className", "");
      this.$emit("update:subjectName", "");
      this.setState({ key: "visible", value: false });
    },
    // async getClassroomList() {
    //     try {
    //         this.loading = true;
    //         const { data } = await getClassroomList({ schoolCode: this.$store.getters.schoolCode });
    //         if (data && data.length) {
    //             console.log(data);
    //         }
    //         this.loading = false;
    //     } catch (err) {
    //         this.loading = false;
    //         this.$message({
    //             message: '获取教室列表失败！',
    //             type: 'error'
    //         })
    //     }
    // },
  },

  created() {
    // this.getClassroomList();
    this.subjectList = this.$store.getters.teachSubjects;
    this.classroomList = this.$store.getters.classroomList;
    this.classroomList.forEach((item) => this.$set(item, "isCheck", false));
    this.subjectList.forEach((item) => {
      if (item.subjectName === this.subjectName) {
        this.$set(item, "isCheck", true);
      } else {
        this.$set(item, "isCheck", false);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.Choose-the-classroom {
  width: 14.35rem;
  height: 8.66rem;
  padding-top: 0.25rem;
  border-radius: 0.21rem;
  overflow: hidden;
  .header {
    display: flex;
    justify-content: flex-end;
    padding-right: 0.2rem;
    .out {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background-color: #dbdbdb;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 0.5rem;
        font-weight: 600;
        color: #fff;
      }
    }
  }
  .title {
    font-size: 0.38rem;
    color: #3b444c;
    font-weight: 600;
  }
  .classroom,
  .subject {
    padding: 0 0.2rem 0 1.06rem;
  }
  .con-box {
    display: flex;
    flex-wrap: wrap;
    max-height: 2rem;
    overflow-y: auto;
    margin: 0.3rem 0;
    min-height: 1rem;
    div {
      width: 2rem;
      height: 0.58rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #3e83f8;
      color: #3e83f8;
      border-radius: 0.05rem;
      margin: 0 0.46rem 0.3rem 0;
      font-size: 0.25rem;
      white-space: nowrap;
    }
  }
  .subject {
    .con-box {
      height: 2rem;
    }
  }
  .floor {
    display: flex;
    justify-content: center;
    .next {
      width: 3.38rem;
      height: 0.67rem;
      color: #fff;
      font-size: 0.29rem;
    }
  }
}
.my-slot-head {
  font-size: 0.3rem;
  font-weight: 600;
  line-height: 2;
}
.my-slot-content {
  font-size: 0.29rem;
  padding: 0.3rem;
  text-align: center;
  height: 1.6rem;
}
.my-slot-floor {
  display: flex;
  height: 0.8rem;
  width: 100%;
  justify-content: space-evenly;
  .floor-but {
    font-size: 0.29rem;
    width: 2rem;
    height: 0.5rem;
  }
  .floor-right {
    border: 1px solid #909399;
    background: #fff;
    color: #333;
  }
}
</style>