
import { mapState, mapGetters, mapMutations } from 'vuex'
import { uploadLogEvent, uploadLogEventList } from '@/api/phenixLog'
export default {
    data() {
        return {
            data_enterTime: 0,
            data_dataInfo: {
                appId: 1,
                platformId: 1,
                pageId: '',
                gradeName: null,
                className: null,
            }
        }
    },
    computed: {
        ...mapGetters({
            _studentList: "studentList"
        })
    },
    methods: {
        ...mapMutations('inCloudClassroom', ['setDataList']),
        // 进入页面记录进入时间
        data_enterPage() {
            this.data_enterTime = new Date().getTime();
        },
        // 退出页面
        /******
         * 
         * @param {Object, String} data 事件数据 如果只有event_id可传string 否则传object
         * 
         * *******/
        data_exitPage(data = {}, isBatch = false) {
            const teacherAccount = this.$store.getters.teacherAccount;
            const exitTime = new Date().getTime();
            const time = exitTime - this.data_enterTime;
            if (typeof data === 'string') {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: exitTime,
                    userId: teacherAccount,
                    extraInfo: { time },
                    eventId: data
                };
                if (isBatch) return this.setDataList(obj);
                this.data_uploadData(obj)
            } else {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: exitTime,
                    userId: teacherAccount,
                    extraInfo: { time },
                    ...data
                };
                if (isBatch) return this.setDataList(obj);
                this.data_uploadData(obj)
            }
        },
        // 事件埋点
        /******
         * 
         * @param {Object, String} data 事件数据 如果只有event_id可传string 否则传object
         * 
         * *******/
        data_triggerEvent(data = {}, isBatch = false) {
            const teacherAccount = this.$store.getters.teacherAccount;
            const time = new Date().getTime();
            if (typeof data === 'string') {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: time,
                    userId: teacherAccount,
                    eventId: data
                }
                if (isBatch) return this.setDataList(obj);
                this.data_uploadData(obj)
            } else {
                const obj = {
                    ...this.data_dataInfo,
                    logTime: time,
                    userId: teacherAccount,
                    ...data
                }
                if (isBatch) return this.setDataList(obj);
                this.data_uploadData(obj)
            }
        },
        async data_uploadData(obj = {}, n = 0) {
            try {
                await uploadLogEvent(JSON.stringify(obj))
            } catch (err) {
                n < 2 && this.data_uploadData(obj, ++n)
            }
        },
        async data_batchUpload(n = 0) {
            try {
                const logEventUploadDTOList = this.$store.state.inCloudClassroom.dataList;
                if (!logEventUploadDTOList.length) return;
                // console.log(logEventUploadDTOList);
                await uploadLogEventList(JSON.stringify({ logEventUploadDTOList }));
                this.setDataList()
            } catch (err) {
                n < 2 ? this.data_batchUpload(++n) : this.setDataList()
            }
        }
    },
    created() {
        const routeName = this.$route?.name;
        switch (routeName) {
            case 'Login':
                this.data_dataInfo.pageId = 'login';
                break;
            case 'Home':
                this.data_dataInfo.pageId = 'home';
                break;
            case 'Timetable':
                this.data_dataInfo.pageId = 'timetable';
                break;
            case 'Seatwork':
                this.data_dataInfo.pageId = 'seatwork';
                break;
            case 'WorkList':
            case 'PublishWork':
                this.data_dataInfo.pageId = 'workManage';
                break;
            case 'FileList':
                this.data_dataInfo.pageId = 'questionBank';
                break;
            case 'SchoolQuestionBank':
                this.data_dataInfo.pageId = 'schoolQuestionBank';
                break;
            case 'CoursewareList':
                this.data_dataInfo.pageId = 'prepareLessons';
                break;
            case 'ScholasticResource':
                this.data_dataInfo.pageId = 'scholasticResource';
                break;
            case 'ClassReport':
                this.data_dataInfo.pageId = 'classReport';
                break;
            case 'NotifyList':
            case 'EditNotify':
                this.data_dataInfo.pageId = 'notification';
                break;
            case 'CloudClassroom': {
                if (this._studentList.length) {
                    const { classInfo } = this._studentList[0];
                    this.data_dataInfo.gradeName = classInfo.gradeName;
                    this.data_dataInfo.className = classInfo.clazzName;
                }
                this.data_dataInfo.pageId = 'cloudClassroom';
                break;
            }
            case 'TeachingFeedback':
                this.data_dataInfo.pageId = 'teachingFeedback';
                break;
            default:
                break;
        }
    }
}