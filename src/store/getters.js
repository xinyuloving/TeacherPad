const getters = {
    token: state => state.teacher.token,
    teacherAccount: state => state.teacher.teacherAccount,
    teacherPhone: state => state.teacher.teacherInfo.phoneNumber,
    teacherId: state => state.teacher.teacherId,
    schoolCode: state => state.teacher.schoolCode,
    groupId: state => state.inCloudClassroom.groupID,
    IMSdkState: state => state.imStore.IMSdkState,
    studentList: state => state.inCloudClassroom.studentList,
    folderId: state => state.questionBank.folderId,
    coursewareList: state => state.signCourseware.coursewareList,
    teachClasses: state => state.teacher.teacherInfo.teachClasses,
    teachSubjects: state => state.teacher.teacherInfo.teachSubjects,
    classroomList: state => state.teacher.classroomList,
    classroomInfo: state => state.signCourseware.classroomInfo,
    facilityENV: state => state.teacher.facilityENV,
    roleCode: state => state.teacher.teacherRole.code,
}
export default getters