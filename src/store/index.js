import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import teacher from './modules/teacher'
import student from './modules/student'
import cloudClassroom from "./modules/cloudClassroom/index.js"
import imStore from "./modules/imStore"
import questionBank from './modules/questionBank'
import signCourseware from './modules/signCourseware'
import inCloudClassroom from './modules/inCloudClassroom'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    teacher,
    student,
    imStore,
    cloudClassroom,
    questionBank,
    signCourseware,
    inCloudClassroom,
  },
  getters
})

export default store