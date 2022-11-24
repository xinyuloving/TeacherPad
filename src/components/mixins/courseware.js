import cos from '@/utils/cos'
import { removeCourseware, updateFileName } from "@/api/prepareLessons"
import moment from "moment"
import { getSuffixImg } from "@/utils/tableTreating"
import { v4 as uuidv4 } from 'uuid'
import { videoFormat } from '@/utils/fileFormat'

export default {
    data() {
        return {
            uploadings: []
        }
    },
    methods: {
        // 删除文件
        async removeFile({ type, id, tencentCosName }, namespace) {
            try {
                // 开启loading效果
                this.isLoading = true;
                if (type === 1) {
                    cos.removeFile({ type: 0, key: tencentCosName });
                } else if (type === 2) {
                    cos.cancelTask(tencentCosName)
                }
                // 调取后端接口 从数据库中删除
                const res = await removeCourseware(
                    JSON.stringify({
                        id,
                        namespace
                    })
                );
                if (res.code === 0) {
                    // 删除成功后将前端数据移除
                    if (type < 2) {
                        this.currentList.splice(this.currentIndex, 1);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                    }
                } else {
                    throw new Error();
                }
                // 关闭loading效果
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "删除失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 获取课件上传后的位置
        getLocation() {
            if (this.currentList.length) {
                let num = this.currentList.findIndex(item => item.type === 1 && (!item.progress || item.progress === 1));
                if (num !== -1) {
                    return num;
                } else {
                    return this.currentList.length;
                }
            } else {
                return 0;
            }
        },
        // input上传事件
        inputUpload(e) {
            e.target.files.forEach((item) => {
                console.log(item)
                // 获取文件后缀名
                const str = item.name.slice(item.name.lastIndexOf("."));
                const suffix = videoFormat().indexOf(str) === -1 ? str : '.mp4';
                // 生成正则
                const reg = new RegExp(suffix, "gi");
                // 如果格式满足则上传文件
                if (item.size / 1024 / 1024 > 200) {
                    // 不满足则取消上传并提示
                    this.$message({
                        message: item.name + "文件超过200M",
                        type: "error",
                    });
                } else if (reg.test(this.fileFormat)) {
                    this.upload(item, suffix, e.target.files.length);
                } else {
                    // 不满足则取消上传并提示
                    this.$message({
                        message: item.name + "上传格式有误",
                        type: "error",
                    });
                }
            });
        },
        // 全选
        checkAll() {
            this.allCheck = !this.allCheck;
            this.currentList.forEach((item) => (item.isCheck = this.allCheck));
        },
        // 单选
        radio(index) {
            this.currentList[index].isCheck = !this.currentList[index].isCheck;
            this.allCheck = this.currentList.every((item) => item.isCheck);
        },
        // 新增数据
        addData(data, index) {
            const myData = {
                ...data,
                children: [],
                createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                isCheck: false,
                parentId: this.parentId,
            };
            if (index > 0) {
                this.currentList.splice(index, 0, myData);
            } else {
                this.currentList.unshift(myData);
            }
        },
        // 更新导航
        updateNav(obj) {
            // 将点击后面的导航数据清除
            this.navList.splice(obj.index + 1);
            this.parentId = obj.to;
            this.isPreview = false;
            this.allCheck = false;
            this.getCwListByParentId && this.getCwListByParentId();
            this.getScholasticList && this.getScholasticList();
        },
        // 重命名
        async rechristen(obj) {
            try {
                // 将输入框关闭
                this.currentList[obj.index].isInput = false;
                // 如果文件名未发生改变则跳出
                if (this.currentList[obj.index].name === obj.name || !obj.name)
                    return;
                // 开启loading效果
                this.isLoading = true;
                // 调取接口更新文件名
                const res = await updateFileName(
                    JSON.stringify({
                        coursewareName: obj.name,
                        id: this.currentList[obj.index].id,
                    })
                );
                if (res.code === 0) {
                    // 修改文件名
                    this.currentList[obj.index].name = obj.name;
                    this.$message({
                        message: '重命名成功',
                        type: 'success'
                    })
                } else {
                    throw new Error()
                }
                // 关闭loading效果
                this.isLoading = false;
            } catch (err) {
                this.$message({
                    message: "重命名失败，请重试",
                    type: "error",
                });
                this.isLoading = false;
                console.log(err);
            }
        },
        // 打开
        open(index) {
            let timer = setTimeout(async () => {
                try {
                    if (this.isLoading) return;
                    this.isLoading = true;
                    // 添加导航数据
                    const obj = this.currentList[index];
                    // 如果点击的是文件夹则打开文件夹  如果是文件则预览文件
                    if (obj.type) {
                        // 开启loading效果
                        const cosName = obj.tencentCosName;
                        const suffix = getSuffixImg(cosName);
                        if (suffix === "jpg") {
                            this.previewType = 1;
                        } else if (suffix === "mp4") {
                            this.previewType = 2;
                        } else if (suffix === "audio") {
                            this.previewType = 3;
                        } else {
                            this.previewType = 0;
                        }
                        if (this.previewType) {
                            // 如果是图片，视频和音频
                            const res = await cos.getObjectUrl({
                                type: 0,
                                key: cosName,
                            });
                            this.previewUrl = res.Url;
                        } else {
                            // 如果是ppt，pdf，doc和表格
                            this.previewUrl = cosName
                        }
                        // // 获取链接成功
                        this.isPreview = true;
                        this.previewObj = obj;
                        this.isLoading = false;
                    } else {
                        // 保存文件夹id
                        this.parentId = obj.id;
                        this.getCwListByParentId && this.getCwListByParentId();
                        if (this.getScholasticList) {
                            if (obj.courseCode) {
                                this.uploadData = {
                                    courseCode: obj.courseCode,
                                    gradeCode: obj.gradeCode
                                }
                            }
                            this.getScholasticList()
                        }
                    }
                    this.navList.push({ name: obj.name, whereTo: obj.id });
                    this.allCheck = false;
                    clearTimeout(timer);
                } catch (err) {
                    this.$message({
                        message: '打开失败，请重试！',
                        type: 'error'
                    });
                    this.isLoading = false;
                    console.log(err);
                }
            }, 0);
        },
        // 上传
        async upload(file, suffix) {
            try {
                // 开启loading效果
                this.isLoading = true;
                const fileName = this.schoolCode + '/' + uuidv4() + suffix;
                // 调取接口  新增课件
                const data = await this.addCourseware(file, fileName);
                // 成功后 定义一条文件夹数据并插入到当前显示数据
                let index = this.getLocation();
                this.addData(
                    {
                        ...data,
                        icon: getSuffixImg(suffix),
                        isInput: false,
                        type: 1,
                        tencentCosName: fileName,
                        size: file.size,
                        curSize: 0,
                        progress: 0
                    },
                    index
                );
                this.isLoading = false;
                let upData = {
                    type: 2,
                    id: data.id,
                    tencentCosName: ''
                }
                this.uploadings.push(upData);
                let obj = this.currentList[index];
                // 上传至腾讯云
                await cos.seniorFile({
                    type: 0,
                    file: file,
                    key: fileName,
                    suffix
                }, (type, cbData) => {
                    // type为1是进度回调
                    if (type === 1) {
                        obj.curSize = cbData.loaded;
                        obj.progress = cbData.percent
                    } else if (type === 2) {
                        upData.tencentCosName = cbData
                    }
                })
                const n = this.uploadings.findIndex(item => item.id === data.id);
                this.uploadings.splice(n, 1);
                // 上传成功后触发数据上传事件
                const str = this.$route.name === 'CoursewareList' ? '1' : '2';
                this.data_triggerEvent({ eventId: 'uploadCourseware', logValue: str, pageId: 'prepareLessons', extraInfo: { fileFormat: suffix } })
            } catch (err) {
                this.$message({
                    message: '添加失败，请重试！',
                    type: 'error'
                });
                this.isLoading = false;
                console.log(err);
            }
        },
    },
    beforeDestroy() {
        this.uploadings.forEach(item => this.removeFile(item, "my_courseware"))
    }
}