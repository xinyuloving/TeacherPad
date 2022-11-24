import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home.vue'
const http404page = () => import('@/views/publicPage/404.vue')

Vue.use(VueRouter)

// const originalPush = VueRouter.prototype.originalPush
// VueRouter.prototype.push = function push(location){
//   return originalPush.call(this,location).catch(err=>err)
// }

const routes = [
  {
    path: '/login',
    name: "Login",
    component: () => import('@/views/login/Login'),
  },
  {
    path: "/404",
    component: http404page,
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index'),
      },
      {
        path: '/timetable',
        name: "Timetable",
        component: () => import('@/views/home/homeTools/Timetable'),
      },
      //随堂测试
      {
        path: '/Seatwork',
        name: "Seatwork",
        component: () => import('@/views/home/homeTools/Seatwork'),
      },
      {
        path: '/workManage',
        // redirect: '/workList',
        component: () => import('@/views/home/homeTools/workManage/index.vue'),
        children: [
          {
            path: 'workList',
            name: "WorkList",
            component: () => import('@/views/home/homeTools/workManage/WorkList.vue'),
          },
          {
            path: 'publishWork',
            name: "PublishWork",
            component: () => import('@/views/home/homeTools/workManage/PublishWork.vue'),
          },
        ],
      },
      // 题库助手
      {
        path: '/questionBank',
        name: "QuestionBank",
        component: () => import('@/views/home/homeTools/QuestionBank'),
        children: [
          {
            path: 'fileList',
            name: 'FileList',
            component: () => import('@/views/home/homeTools/QuestionBank/FileList.vue')
          },
          {
            path: 'schoolQuestionBank',
            name: 'SchoolQuestionBank',
            component: () => import('@/views/home/homeTools/QuestionBank/schoolQuestionBank.vue')
          },
        ]
      },
      // 备课助手
      {
        path: '/prepareLessons',
        name: "PrepareLessons",
        component: () => import('@/views/home/homeTools/prepareLessons/index.vue'),
        children: [
          {
            path: 'coursewareList',
            name: 'CoursewareList',
            component: () => import('@/views/home/homeTools/prepareLessons/coursewareList.vue')
          },
          {
            path: 'scholasticResource',
            name: 'ScholasticResource',
            component: () => import('@/views/home/homeTools/prepareLessons/scholasticResource.vue')
          }
        ]
      },
      {
        path: '/classReport',
        name: "ClassReport",
        component: () => import('@/views/home/homeTools/classReport/Index.vue'),
        // children: [
        // {
        //   path: 'coursewareList',
        //   name: 'CoursewareList',
        //   component: () => import('@/views/home/homeTools/prepareLessons/coursewareList.vue')
        // },
        // {
        //   path: 'scholasticResource',
        //   name: 'ScholasticResource',
        //   component: () => import('@/views/home/homeTools/prepareLessons/scholasticResource.vue')
        // }
        // ]
      },
      {
        path: '/notification',
        component: () => import('@/views/home/notification'),
        children: [{
          path: 'notifyList',
          name: 'NotifyList',
          component: () => import('@/views/home/notification/notifyList')
        }, {
          path: 'editNotify',
          name: 'EditNotify',
          component: () => import('@/views/home/notification/editNotify')
        }]
      },
    ]
  },
  {
    path: '/cloudClassroom',
    name: "CloudClassroom",
    component: () => import('@/views/cloudClassroom/CloudClassroom.vue'),
  },
  {
    path: '/teachingFeedback',
    name: "TeachingFeedback",
    component: () => import('@/views/cloudClassroom/TeachingFeedback.vue'),
  },
  { path: '*', redirect: '/404' }
]

const deployConfig = process.env.VUE_APP_RUNTIME_ENV === 'pc' ? {
  mode: "history",
  base: "/teacher",
} : {}

const router = new VueRouter({
  // mode: "history",
  // base: "/teacher", // pc打包打开上面两行注释，pad打包注释上面两行
  ...deployConfig,
  routes
})

export default router
