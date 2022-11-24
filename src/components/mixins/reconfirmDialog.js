import ReconfirmDialog from "@/components/homeToolsPublic/reconfirmDialog.vue"

export default {
    components: {
        ReconfirmDialog
    },

    data() {
        return {
            isDialog: false,
            dialogConfig: {},
        }
    },

    methods: {
        // 删除
        delReconfirm(title, con) {
            this.dialogConfig = {
                // 弹出框配置
                width: "5.3rem", // 宽
                height: "3rem", // 高
                title: title || "删除", // 弹出框标题
                content: con || "亲爱的老师，确定要删除吗？ 再考虑一下吧", // 内容
                butList: ["确定", "取消"], // 按钮内容
                type: 0, // 弹框类型  0代表删除
            };
            this.isDialog = true
        },
        // 分享
        shareReconfirm() {
            this.dialogConfig = {
                // 弹出框配置
                width: "5.3rem", // 宽
                height: "4rem", // 高
                title: "", // 弹出框标题
                content: '内容将分享到学习助手，请选择', // 内容
                butList: ["确定"], // 按钮内容
                type: 1, // 弹框类型  0代表删除
            };
            this.isDialog = true
        },
        // 上传
        upReconfirm(num) {
            this.dialogConfig = {
                // 弹出框配置
                width: "5.3rem", // 宽
                height: "4rem", // 高
                title: "", // 弹出框标题
                content: '请选择科目和年级', // 内容
                butList: ["确定"], // 按钮内容
                type: 2, // 弹框类型  0代表删除
                num
            };
            this.isDialog = true
        },
        // 添加到我的
        addToMine() {
            this.dialogConfig = {
                // 弹出框配置
                width: "8.17rem", // 宽
                height: "6.19rem", // 高
                title: "选择保存目录", // 弹出框标题
                content: '请选择科目和年级', // 内容
                butList: ["新建文件夹", "确认添加"], // 按钮内容
                type: 3, // 弹框类型  0代表删除
            };
            this.isDialog = true
        },
        // 发布
        release() {
            this.dialogConfig = {
                // 弹出框配置
                width: "4.5rem",
                height: "3rem",
                content: '内容将发布到随堂测试，请选择',
                type: 4,
                butList: ["确定"]
            };
            this.isDialog = true
        }
    }
}