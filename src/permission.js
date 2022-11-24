// 全局导航守卫
import router from './router'
import store from './store'
import { getToken, removeToken, handleSessionData } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'



const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // set page title
    //   document.title = getPageTitle(to.meta.title)

    // next();

    // 判断用户是否已登录

    const token = getToken();
    if (token) {
        // 有 token
        if (to.path === '/login') {
            // 如果已登录，请重定向到主页
            next({ path: '/' })
        } else {
            // 如果没有去登录页 -----------> 现阶段，将老师的 手机号 当作获取老师信息的方式
            const teacherId = store.getters.teacherId; // 拿老师id
            // -------------------------!!!!!!!--------------------------
            if (teacherId) {
                // 当有用户信息时直接跳转
                next();
            } else {
                // // 当没有用户信息时获取用户信息
                try {
                    // 从store中获取角色
                    await store.dispatch('teacher/getTeacherInfo');
                    next();
                } catch (error) {
                    // 删除令牌并转到登录页面重新登录
                    console.log("删除令牌并转到登录页面重新登录");
                    // removeToken(); // must remove  token  first
                    // MessageBox.alert("获取老师信息失败！", '提示', {
                    //     confirmButtonText: '确定',
                    //     type: 'error',
                    //     callback: () => {
                    //         if (from.path !== "/login") {
                    //             next('/login');
                    //         }
                    //         location.reload();
                    //     }
                    // });

                    // Message({
                    //     message: error,
                    //     type: 'error',
                    //     duration: 3 * 1000
                    // })

                }

                // 当没有用户信息时获取用户信息
            }
            // ------------------------!!!!!!!---------------------------
        }
    } else {
        /* 没有 token */
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // next(`/login?redirect=${to.path}`)
            next({ name: 'Login' });
        }
    }
})