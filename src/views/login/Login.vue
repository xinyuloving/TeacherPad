<template>
    <div class="login">
        <header>
            <img src="@/assets/img/login/login-logo.png" alt="" />
            <!-- <span>水獭智创</span> -->
        </header>
        <section>
            <div class="left">
                <span>引领教育，打造数字化校园</span>
            </div>
            <div class="right">
                <div
                    class="main"
                    v-bounce="{ bounceState, distance: '1.5rem' }"
                >
                    <div class="top">
                        <span class="welcome">欢迎回来</span>
                    </div>
                    <!-- 阻止表单的默认事件 -->
                    <form class="mid" @submit.prevent>
                        <div class="input-con account-con">
                            <div class="input-item">
                                <input
                                    type="text"
                                    placeholder="手机号"
                                    :maxlength="11"
                                    v-model.trim="loginData.account"
                                    @focus="accountFocus"
                                    @blur="accountBlur"
                                />
                                <i class="iconfont icon-account"></i>
                            </div>
                            <TDropDown
                                v-if="accountList.length"
                                :visible="dropDownVisible"
                            >
                                <ul class="dropdown-ul">
                                    <li
                                        class="dropdown-item"
                                        v-for="(item, index) in accountList"
                                        :key="index"
                                        v-touch="
                                            () => {
                                                itemTouch(item);
                                            }
                                        "
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </TDropDown>
                        </div>
                        <div class="input-con pwd-con">
                            <div class="input-item">
                                <input
                                    :type="passwordType"
                                    :maxlength="passwordLength"
                                    :placeholder="placeholderTips"
                                    v-model.trim="loginData.password"
                                    @keyup.enter="handleClick"
                                    @focus="pwdFocus"
                                    @blur="pwdBlur"
                                    ref="pwdInput"
                                    autocomplete="off"
                                />
                                <i
                                    :class="[
                                        'iconfont',
                                        showPwd ? 'icon-eye' : 'icon-eye-slash',
                                    ]"
                                    v-touch="
                                        () => {
                                            showPwd = !showPwd;
                                        }
                                    "
                                    v-if="loginMode"
                                ></i>
                                <span
                                    v-else
                                    class="pwd-btn"
                                    @click.prevent="getCode"
                                >
                                    {{ codeTips }}
                                </span>
                            </div>
                            <div class="tips">
                                <div class="tips-left">
                                    <span
                                        :class="['tip-error']"
                                        v-show="eMsg"
                                        >{{ eMsg }}</span
                                    >
                                </div>
                                <div class="tips-right">
                                    <span v-touch="forgetPwd">忘记密码？</span>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="bottom">
                        <TButton
                            class="login-btn"
                            @click.prevent="handleClick"
                            :loading="btnLoading"
                            :createDomForContent="true"
                            >登录</TButton
                        >
                        <span @click="changeLoginMode">{{
                            loginModeText
                        }}</span>
                    </div>
                </div>
            </div>
            <a href="https://beian.miit.gov.cn" class="put-on-records"
                >浙ICP备2022005167号</a
            >
        </section>
        <Vcode
            :show="vCodeShow"
            :range="5"
            @success="vCodeSuccess"
            @close="vCodeClose"
        />
        <ForgetPwd :visible.sync="dialogVisible" />
    </div>
</template>

<script>
import { loginByMobile, getVerifyCode, loginByVerifyCode } from "@/api/user";
import { mapMutations } from "vuex";
import { setToken } from "@/utils/auth";
import md5 from "md5";
import Vcode from "@/components/FunctionalComp/Vcode.vue";
import TDropDown from "@/components/FunctionalComp/TDropDown.vue";
import ForgetPwd from "@/components/login/ForgetPwd.vue";
import TButton from "@/components/FunctionalComp/TButton.vue";
import bounce from "@/directive/bounce";

export default {
    components: {
        TDropDown,
        Vcode,
        ForgetPwd,
        TButton,
    },
    directives: {
        bounce,
    },
    data() {
        return {
            loginData: {
                account: "",
                password: "",
            },
            eMsg: "", // 错误提示 信息
            showPwd: false,
            loginMode: true, // 短信或密码登录(true 表示 密码，false 表示验证码)
            countDownNum: 60, // 验证码的倒计时
            codeFlag: false, // 控制是否获取了验证码
            dropDownVisible: false,
            accountList: [],
            vCodeShow: false,
            getCodeNum: 0, // 获取验证码的次数
            dialogVisible: false,
            btnLoading: false,
            isSuccess: false, // 是否登录成功
            // isCloseVcode: true, // 是否能关闭滑块验证
            bounceState: false,
            inputFocus: false, // 输入框是否聚焦
        };
    },
    created() {
        this.accountList =
            JSON.parse(localStorage.getItem("accountList")) || [];
    },
    computed: {
        loginModeText() {
            return this.loginMode ? "短信快捷登录" : "账号密码登录";
        },
        placeholderTips() {
            return this.loginMode ? "密码" : "请输入验证码";
        },
        passwordLength() {
            return this.loginMode ? 16 : 6;
        },
        passwordType() {
            return this.showPwd ? "text" : "password";
        },
        codeTips() {
            return this.codeFlag
                ? `${this.countDownNum}s`
                : this.getCodeNum > 0
                ? "重新获取验证码"
                : "获取验证码";
        },
    },
    watch: {
        inputFocus: {
            handler(newValue) {
                if (newValue) {
                    this.bounceState = true;
                } else {
                    this.$nextTick(() => {
                        this.bounceState = false;
                    });
                }
            },
        },
    },
    methods: {
        ...mapMutations({
            SET_TOKEN: "teacher/SET_TOKEN",
        }),
        handleClick() {
            // 点击登录
            this.$refs.pwdInput.blur();
            const { account, password } = this.loginData;
            const { loginMode, isSuccess } = this;
            if (isSuccess) {
                return;
            } else {
                if (this.verify(account)) return;
                if (this.verify(password, loginMode ? 1 : 2)) return;
                if (loginMode) {
                    // 通过异步的方式将 vCodeShow 设置为 true，因为 v-touch 指令会触发 touchStart 事件 和 touchEnd 事件，此时 Vcode 为 show，而 touchEnd 事件同时作用到了 Vcode 的模态框，导致 vCodeShow 从 true 瞬间变为 false 从而不在页面上展示；另一种解决方法是 将 登录按钮 的 v-touch 指令 用 prevent 修饰，从而阻止默认事件
                    // setTimeout(() => {
                    //     this.vCodeShow = true;
                    // });
                    this.vCodeShow = true;
                } else {
                    this.btnLoading = true;
                    this.loginByCode();
                }
            }
        },
        async loginByCode() {
            const { account, password } = this.loginData;
            try {
                const { data, code, msg } = await loginByVerifyCode({
                    mobile: account,
                    verifyCode: password,
                });
                console.log(code, data, msg);
                this.handleLoginResponse(data, code);
            } catch (error) {
                this.btnLoading = false;
            }
        },
        async vCodeSuccess() {
            // this.isCloseVcode = false;
            try {
                const { account, password } = this.loginData;
                const { loginMode } = this;
                if (loginMode) {
                    this.btnLoading = true;
                    const { data, code, msg } = await loginByMobile({
                        account,
                        password: md5(password),
                    });
                    console.log(code, data, msg);

                    this.handleLoginResponse(data, code);
                } else {
                    const { code, msg } = await getVerifyCode({
                        mobile: account,
                    });
                    // this.isCloseVcode = true;
                    this.vCodeClose();

                    switch (code) {
                        case 0: {
                            this.codeFlag = true;
                            this.getCodeNum += 1;
                            // this.vCodeClose();
                            // 验证正确
                            // ----------  获取验证码  -----------
                            this.codeTimer = setInterval(() => {
                                if (this.countDownNum > 0) {
                                    this.countDownNum--;
                                } else {
                                    this.codeFlag = false;
                                    clearInterval(this.codeTimer);
                                    this.countDownNum = 60;
                                }
                            }, 1000);
                            break;
                        }
                        case 10010: {
                            this.eMsg = "用户不存在!";
                            break;
                        }
                        case 10011: {
                            this.eMsg = "超出每日发送验证码数量上限！";
                            break;
                        }
                        default:
                            // this.vCodeClose();
                            this.eMsg = msg;
                            break;
                    }
                }
            } catch (e) {
                this.btnLoading = false;
                // this.isCloseVcode = true;
                this.vCodeClose();
            }
        },
        handleLoginResponse(data, code) {
            // this.isCloseVcode = true;
            this.vCodeClose();
            if (code === 0) {
                this.isSuccess = true;
                const token = data.tokenValue;
                this.fillAccount();
                // 账号密码正确的处理
                // 登录成功后，分别把token保存在 store 和 localStorage 中。
                setToken(token);
                this.SET_TOKEN(token);
                this.$router.push({ name: "Home" });
            } else {
                // 当账号密码错误时的处理
                // code 为 10001 表示登录失败
                this.eMsg = "手机号或密码(验证码)错误，请检查！";
                // 登录失败
            }
            this.btnLoading = false;
        },
        vCodeClose() {
            // if (!this.isCloseVcode) return;
            this.vCodeShow = false;
        },
        fillAccount() {
            const { account } = this.loginData;
            const { accountList } = this;
            const index = accountList.findIndex((item) => item === account);
            if (index === -1) {
                if (accountList.length === 5) accountList.pop();
            } else {
                accountList.splice(index, 1);
            }
            accountList.unshift(account);
            localStorage.setItem("accountList", JSON.stringify(accountList));
        },
        itemTouch(item) {
            this.loginData.account = item;
        },
        changeLoginMode() {
            // 切换登录方式
            this.showPwd = this.loginMode;
            this.loginMode = !this.loginMode;
            // 切换功能 触发重置

            this.loginData.password = "";
            this.eMsg = "";

            // if (this.loginData.password.length) {
            //     // 如果有密码，将其清空
            //     this.loginData.password = "";
            // }
            // if (this.eMsg) {
            //     // 如果有错误提示，将其隐藏
            //     this.eMsg = "";
            // }
            if (this.codeTimer) {
                // 如果有定时器，将其清除，并置为 undefined
                clearInterval(this.codeTimer);
                this.codeTimer = undefined;
                this.countDownNum = 60;
                this.codeFlag = false;
            }
        },
        getCode() {
            // 获取验证码
            // 先校验手机号
            if (!this.codeFlag) {
                const { account } = this.loginData;
                if (!this.verify(account)) {
                    // 手机号校验正确
                    // console.log("这里执行了");
                    this.vCodeShow = true;
                }
            }
        },
        accountFocus() {
            this.dropDownVisible = true;
            this.eMsg = "";
            this.inputFocus = true;
        },
        accountBlur() {
            this.inputFocus = false;
            this.dropDownVisible = false;
            this.verify(this.loginData.account);
        },
        pwdFocus() {
            this.eMsg = "";
            this.inputFocus = true;
        },
        pwdBlur() {
            this.inputFocus = false;
            const { password } = this.loginData;
            const { loginMode } = this;
            this.verify(password, loginMode ? 1 : 2);
        },
        forgetPwd() {
            this.dialogVisible = true;
        },
        // 表单验证
        verify(text, type) {
            // text 为 校验内容；type 为校验类型：0 账号，1 密码，2 验证码
            let regexp;
            if (!type) {
                regexp =
                    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
            } else if (type === 1) {
                regexp = /^[0-9a-zA-Z_]{8,16}$/;
            } else {
                regexp = /^\d{4,6}$/;
            }
            const typeList = ["手机号", "密码", "验证码"];
            let msg = " ";
            if (!text.length) {
                msg = `${typeList[type || 0]}不能为空！`;
                this.eMsg = msg;
                return msg;
            }
            if (!regexp.test(text)) {
                msg = `${typeList[type || 0]}格式有误，请检查！`;
                this.eMsg = msg;
                return msg;
            }
            return false; // 返回 false 表示初始校验成功
        },
    },
    beforeDestroy() {
        clearInterval(this.codeTimer);
    },
};
</script>

<style lang="less" scoped>
@grey1: #7e85a5;
.login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    header {
        width: 100%;
        height: 0.88rem;
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        img {
            width: 1.67rem;
            height: 0.44rem;
            margin-right: 0.01rem;
            object-fit: contain;
        }
        span {
            font-size: 0.29rem;
            font-weight: bold;
            color: #424242;
        }
    }
    section {
        flex: 1;
        width: 100%;
        display: flex;
        .left {
            width: 50%;
            height: 100%;
            background-image: url("../../assets/img/login/login-bg.png");
            background-size: cover;
            background-repeat: no-repeat;
            display: flex;
            span {
                margin: 2.16rem 0 0 0.85rem;
                font-size: 0.35rem;
                font-weight: bold;
                color: #424242;
            }
        }
        .right {
            width: 50%;
            display: flex;
            padding-top: 1.46rem;
            padding-left: 1.36rem;
            .main {
                width: 5.85rem;
                .top {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0.77rem;
                    span {
                        font-size: 0.42rem;
                        font-weight: 600;
                        color: #333333;
                    }
                    .welcome {
                        margin-bottom: 0.1rem;
                    }
                }
                .mid {
                    .input-con {
                        height: 1.1rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        .input-item {
                            height: 0.73rem;
                            position: relative;
                            input {
                                width: 100%;
                                height: 100%;
                                border-bottom: 0.02rem solid #b7b6c4;
                                font-size: 0.28rem;
                                font-weight: 600;
                                color: #333333;
                                &::-webkit-input-placeholder {
                                    font-size: 0.26rem;
                                }
                            }
                            .iconfont {
                                position: absolute;
                                right: 0;
                                top: 50%;
                                transform: translateY(-50%);
                                font-size: 0.26rem;
                                color: #cad0f3;
                            }
                        }
                    }
                    .account-con {
                        position: relative;
                        .dropdown-ul {
                            width: 3.41rem;
                            height: 100%;
                            padding: 0.13rem 0;
                            .dropdown-item {
                                width: 100%;
                                padding: 0.14rem 0.17rem;
                                font-size: 0.24rem;
                                font-weight: 400;
                                color: #333333;
                            }
                        }
                    }
                    .pwd-con {
                        .input-item {
                            .iconfont {
                                font-size: 0.28rem;
                            }
                            .pwd-btn {
                                // width: 1.33rem;
                                padding: 0 0.12rem;
                                height: 0.38rem;
                                background: #dae8ff;
                                border-radius: 0.06rem;
                                border: 0.01rem solid #3d7fee;
                                font-size: 0.17rem;
                                font-weight: 500;
                                color: #3d7fee;
                                position: absolute;
                                top: 50%;
                                right: 0;
                                transform: translateY(-50%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                            }
                        }
                        .tips {
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            font-size: 0;
                            span {
                                user-select: none;
                                cursor: pointer;
                                color: @grey1;
                                font-size: 0.23rem;
                                font-weight: 600;
                            }
                            .tips-left {
                                flex: 1;
                                display: flex;
                                .tip-error {
                                    color: #f55f5f;
                                    cursor: default;
                                }
                            }
                        }
                    }
                }
                .bottom {
                    width: 100%;
                    margin-top: 0.54rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .login-btn {
                        width: 100%;
                        height: 0.71rem;
                        background: #3e83f8;
                        border-radius: 0.08rem;
                        font-size: 0.26rem;
                        font-weight: 600;
                        color: #ffffff;
                        cursor: pointer;
                        margin-bottom: 0.17rem;
                    }
                    span {
                        font-size: 0.24rem;
                        font-weight: 600;
                        color: @grey1;
                        cursor: pointer;
                    }
                }
            }
        }
        .put-on-records {
            position: absolute;
            bottom: 0.6rem;
            font-size: 14px;
            color: #73777a;
            width: 100%;
            text-align: center;
        }
    }
}
</style>
