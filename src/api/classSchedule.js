import request from '@/utils/request'

function getTodayCourse(data) {
    console.log(data);
    return request({
        method: 'get',
        url: '/course_schedule/teacher/today_info',
        params: data
    })
}


export {
    getTodayCourse
}