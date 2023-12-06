<template>
  <div id="app">
    <keep-alive :include="['Home']">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { getTimUserSig } from "@/api/user";
import { loginPhenix } from "@/api/phenixLog";
import { MessageBox } from "element-ui";
import { removeToken } from "@/utils/auth";
import { createTeacherIM } from "@/utils/util";
export default {
  name: "App",
  async created() {
    try {
      this.initListener(); // 初始化监听器
      // const { data } = await loginPhenix(); // 登录埋点系统
      // window.localStorage.setItem("Phenix-Token", data);
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {
    // 获取代码运行的环境
    let env = navigator.userAgent.toLowerCase();
    if (env.match(/windows/i)) {
      // PC端
      this.SET_ENV("windows");
    } else {
      // 移动端
      this.SET_ENV("mobile");
    }
  },
  watch: {
    "$store.getters.teacherId": {
      handler(newValue) {
        // 开始登录
        // 学生userID：1000 + 用户id
        // 老师userID：2000 + 用户id
        console.log(newValue);
        const data = {
          // userId: `2000${newValue}`,
          userId: createTeacherIM(newValue),
        };
        this.loginTIM(data);
      },
    },
  },
  methods: {
    ...mapMutations({
      setState: "imStore/setState",
      emptyState: "inCloudClassroom/emptyState",
      manageMessage: "inCloudClassroom/manageMessage",
      SET_ENV: "teacher/SET_ENV",
    }),
    ...mapActions({
      setMessage: "imStore/setMessage",
    }),
    async loginTIM(data, n = 0) {
      try {
        const { data: userSig } = await getTimUserSig(data);
        await this.tim.login({
          userID: data.userId,
          userSig,
        });
      } catch (error) {
        console.log("登录im失败---> ", error);
        if (n < 4) {
          this.loginTIM(data, ++n);
        } else {
          MessageBox.alert("登录im失败，请退出重新登录", "提示", {
            confirmButtonText: "确定",
            type: "error",
            callback: () => {
              removeToken();
              location.reload();
            },
          });
        }
      }
    },
    initListener() {
      // 监听事件
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate);
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate);
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      this.tim.on(
        this.TIM.EVENT.CONVERSATION_LIST_UPDATED,
        this.onUpdateConversationList
      );
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList);
      this.tim.on(this.TIM.EVENT.ERROR, this.onError);
      this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.checkoutNetState);
    },
    onReadyStateUpdate({ name }) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      // event.name - TIM.EVENT.SDK_READY
      const SdkStatus = name === this.TIM.EVENT.SDK_READY ? true : false;
      this.setState({ key: "IMSdkState", value: SdkStatus });
    },
    onReceiveMessage({ data: messageList }) {
      // 收到新消息的处理函数
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log("收到新消息", messageList);
      for (let i = 0; i < messageList.length; i++) {
        const e = messageList[i];
        if (e.from === "@TIM#SYSTEM" && e.payload.operationType === 1) {
          // this.manageMessage(e);
        } else if (e.from === "@TIM#SYSTEM" && e.payload.operationType === 5) {
          this.emptyState({ e, cb: this.outClassroom });
        } else if (e.payload.data === "in_cloudChassroom") {
          this.manageMessage(e);
        } else if (e.conversationID !== "@TIM#SYSTEM") {
          this.setMessage(e);
        }
        // 群组解散清空store中数据
        // if (
        //     e.from === "@TIM#SYSTEM" &&
        //     e.payload.operationType === 5
        // )
        //     this.emptyState({
        //         e,
        //         cb: (data) => {
        //             this.$message({
        //                 message: data.msg,
        //                 type: "warning",
        //             });
        //             if (data.to) this.$router.push({ path: data.to });
        //         },
        //     });
        // if (e.conversationID !== "@TIM#SYSTEM") {
        //     this.setMessage(e);
        // }
      }
    },
    onUpdateConversationList(event) {
      // 会话列表更新 的处理函数
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
      console.log(event);
    },
    onUpdateGroupList(event) {
      // 群组列表更新
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
      console.log(event);
    },
    onError({ data }) {
      // SDK内部出错
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
      // if (data.message !== "Network Error") {
      //     this.$store.commit("showMessage", {
      //         message: data.message,
      //         type: "error",
      //     });
      // }
      console.log(data);
    },
    onNetStateChange(event) {
      // 网络监测
      //  网络状态发生改变（v2.5.0 起支持）。
      // event.name - TIM.EVENT.NET_STATE_CHANGE
      // event.data.state 当前网络状态，枚举值及说明如下：
      //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
      this.checkoutNetState(event.data.state);
      console.log(event);
    },
    checkoutNetState(state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          return { message: "已接入网络", type: "success" };
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          return { message: "当前网络不稳定", type: "warning" };
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: "当前网络不可用", type: "error" };
        default:
          return "";
      }
    },
    outClassroom(data) {
      data.to && this.$router.push({ path: data.to });
      data.msg &&
        this.$message({
          message: data.msg,
          type: "warning",
        });
    },
  },
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  // height: 11.25rem;
  height: 100%;
  position: relative;
}
</style>
