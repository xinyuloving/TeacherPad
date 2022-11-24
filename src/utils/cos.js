// import { reject, resolve } from 'core-js/fn/promise';
import COS from 'cos-js-sdk-v5';
import { v4 as uuidv4 } from 'uuid'
import ci from '@/utils/CISDK'
import store from '@/store'

// 配置存储桶密钥
const cos = new COS({
    // SecretId: 'AKIDIQIuFI4aolRqypPilX2GDtHOFo67rKWR',
    // SecretKey: 'f4C2buwiCPM2QXOyHI2VhbEafTzFDuJS',
    SecretId: 'AKIDYw5xZuylJbdOt74j8JEsFMCl35rMaWCb',
    SecretKey: 'A2e04rPjmY3HFwMVNyIMAizzjCOJxLSI'

});

// 配置存储桶信息
const Buckets = (function () {
    if (process.env.NODE_ENV === 'development') {
        // 开发环境
        return [
            // 课件
            {
                Bucket: 'develop-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'develop-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'preannouncement') {
        // 预发布环境
        return [
            // 课件
            {
                Bucket: 'pre-release-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'pre-release-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'production') {
        // 生产环境
        return [
            // 课件
            {
                Bucket: 'release-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'release-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'ningxia') {
        // 宁夏环境
        return [
            // 课件
            {
                Bucket: 'ningxia-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'ningxia-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    } else if (process.env.NODE_ENV === 'testing') {
        // 测试环境
        return [
            // 课件
            {
                Bucket: 'test-document-1253352532',
                Region: 'ap-shanghai'
            },
            // 试卷
            {
                Bucket: 'test-paper-1253352532',
                Region: 'ap-shanghai'
            }
        ]
    }
})()

// console.log(process.env.DEVICE_ENV)

//   文件上传至存储桶 bucketObj存储桶配置对象 progressCb进度回调
export default {
    // 添加文件
    /**
     * 
     * @param {Object} typeObj type --> 1 表示 图片的存储桶信息；file -->  要上传的文件； key -->  表示文件名 ； flag --> 表示上传的文件是否需要压缩，默认为不需要压缩
     * @param {*} progressCb 回调函数 参数为 res 表示进度信息
     * @returns 
     */
    async uploadFile(typeObj, progressCb) {
        const fileName = typeObj.key || uuidv4();
        return new Promise((resolve, reject) => {
            cos.putObject(
                {
                    ...Buckets[typeObj.type],
                    Key: fileName,
                    Body: typeObj.file,
                    StorageClass: "STANDARD",
                    onProgress: (params) => {
                        // 进度
                        // console.log('mey',params.percent);
                        progressCb && progressCb(Math.floor(params.percent * 100))
                    },
                    // 获取上传编号
                    onTaskReady: res => console.log(res)
                },
                (error, data) => {
                    // console.log(error || data);
                    if (!error && data.statusCode === 200) {
                        // 如果上传成功且statusCode为200
                        // console.log(data);
                        //   console.log("https://" + data.Location);
                        resolve({ url: "http://" + data.Location, fileName })
                    } else {
                        // 上传发生错误时触发
                        reject(error || data)
                    }
                }
            );
        })
    },
    /*******
     * 
     * @param {object} typeObj type => 存储桶类型必传   suffix => 文件后缀名非必传  file => 文件对象必传  key => 文件名 非必传
     * @param {Function} cb 回调函数 非必传 接收上传进度，文件执行结果和文件标识的回调 
     * 
     * ********/
    // 高级上传
    seniorFile(typeObj, cb) {
        let fileName = typeObj.key ? typeObj.key : store.getters.schoolCode + '/' + uuidv4() + (typeObj.suffix || '');
        // if (typeObj.key) {
        //     fileName = typeObj.key
        // } else {
        //     fileName = store.getters.schoolCode + '/' + uuidv4() + (typeObj.suffix || '');
        // }
        return new Promise((resolve, reject) => {
            cos.uploadFile({
                ...Buckets[typeObj.type],
                Key: fileName,
                Body: typeObj.file,
                onFileFinish(err, data, options) {
                    // 每个文件完成或错误回调
                    console.log(options.Key + '上传' + (err ? '失败' : '完成'));
                    cb && cb(0, data)
                },
                onProgress(progressData) {
                    // 上传进度回调
                    console.log(progressData);
                    cb && cb(1, progressData)
                },
                onTaskReady(taskId) {
                    // 任务创建时的回调  生成任务唯一标识
                    console.log(taskId);
                    cb && cb(2, taskId)
                }
            }, (err, data) => {
                if (data && data.statusCode === 200) {
                    console.log(data)
                    resolve({ url: "http://" + data.Location, fileName })
                } else {
                    reject(err || data)
                }
            })
        })
    },
    //获取存储桶的所有数据
    getBucket(typeObj) {
        return new Promise((resolve, reject) => {
            cos.getBucket(
                {
                    ...Buckets[typeObj.type],
                    Prefix: "",
                    Delimiter: ""

                },
                (error, data) => {
                    console.log(error || data);
                    if (!error && data.statusCode === 200) {
                        resolve(data.Contents)
                    } else {
                        reject(error || data)
                    }
                })
        })
    },

    //获取url
    getObjectUrl(typeObj) {
        return new Promise((resolve, reject) => {
            cos.getObjectUrl({
                ...Buckets[typeObj.type],
                Key: typeObj.key,
                Sign: true, //是否返回带有签名的 Url
            }, (error, data) => {
                console.log(error || data);
                if (!error) {
                    resolve(data)
                } else {
                    reject(error || data)
                }
            })
        })
    },
    // 删除文件
    removeFile(typeObj) {
        return new Promise((resolve, reject) => {
            cos.deleteObject(
                {
                    ...Buckets[typeObj.type],
                    Key: typeObj.key
                },
                (error, data) => {

                    console.log(error || data);
                    if (!error && data.statusCode === 204) {
                        resolve()
                    } else {
                        reject(error || data)
                    }
                }
            );
        })

    },
    // 批量删除
    /*****
     * 
     * @param {Object} typeObj type => 存储桶类型必传  keys => 要删除文件的数组 内容为对象 键为key 值为文件名
     * 
     * ****/
    batchRemove(typeObj) {
        return new Promise((resolve, reject) => {
            cos.deleteMultipleObject(
                {
                    ...Buckets[typeObj.type],
                    Objects: typeObj.keys
                },
                (error, data) => {
                    console.log(error || data);
                    if (!error && data.statusCode === 200) {
                        resolve();
                    } else {
                        reject(error || data)
                    }
                }
            )
        })
    },

    /*******
     * 
     * @param {object} typeObj type => 存储桶类型必传  key => 文件名必传  
     * 
     * ********/
    // 获取文件
    getFile(typeObj) {
        return new Promise((resolve, reject) => {
            cos.getObject({
                ...Buckets[typeObj.type],
                Key: typeObj.key
            }, (error, data) => {
                if (!error && data.statusCode === 200) {
                    resolve(data.Body);
                } else {
                    reject(error || data)
                }
            })
        })
    },

    /*******
     * 
     * @param {object} typeObj type => 存储桶类型必传   suffix => 文件后缀名非必传 
     * @param {Function} cb 回调函数 非必传 接收上传进度，文件执行结果和文件标识的回调 
     * 
     * ********/
    // 复制文件
    copyFile(typeObj, cb) {
        return new Promise((resolve, reject) => {
            const fileName = store.getters.schoolCode + '/' + uuidv4() + ('.' + typeObj.suffix || '');
            cos.sliceCopyFile({
                ...Buckets[typeObj.type],
                Key: fileName,
                CopySource: `${Buckets[typeObj.type].Bucket}.cos.${Buckets[typeObj.type].Region}.myqcloud.com/${typeObj.source}`,
                onProgress: function (progressData) {
                    // 进度
                    cb && cb(progressData)
                }
            }, (error, data) => {
                if (!error && data.statusCode === 200) {
                    resolve(fileName);
                } else {
                    reject(error || data)
                }
            })
        })
    },
    /*******
     * 
     * @param {object} typeObj type => 存储桶类型必传  key => 文件名 
     * 
     * ********/
    // 预览文档
    previewTheDocument(typeObj) {
        return new Promise(async (resolve, reject) => {
            try {
                const url = await ci.getPreviewUrl({
                    objectUrl: `${process.env.NODE_ENV === "ningxia" ? 'https' : 'http'}://${Buckets[typeObj.type].Bucket}.cos.${Buckets[typeObj.type].Region}.myqcloud.com/${typeObj.key}`,
                    credentials: {
                        SecretId: 'AKIDYw5xZuylJbdOt74j8JEsFMCl35rMaWCb',
                        SecretKey: 'A2e04rPjmY3HFwMVNyIMAizzjCOJxLSI'
                    }
                })
                if (!typeObj.dom) return resolve(url)
                let demo = ci.config({
                    url,
                    mount: typeObj.dom,
                    mode: 'normal',
                    commonOptions: {
                        isShowTopArea: true,
                        isShowHeader: false,
                        isIframeViewFullscreen: true
                    },
                })
                // iframe样式
                demo.iframe.style.width = '100%';
                demo.iframe.style.height = '100%';
                // console.log();
                // fn(demo)
                resolve(demo)
            } catch (err) {
                reject(err)
            }
        })
    },
    // 列出对象
    listFolder(typeObj) {
        return new Promise((resolve, reject) => {
            cos.getBucket({
                ...Buckets[typeObj.type],
                Prefix: store.getters.schoolCode + '/',    /* Prefix表示列出的object的key以prefix开始，非必须 */
            }, function (error, data) {
                if (!error && data.statusCode === 200) {
                    resolve(fileName);
                } else {
                    reject(error || data)
                }
            });
        })
    },
    /*******
     * 
     * @param {string} taskId 文件上传任务的编号，在调用上传方法时，其 TaskReady 回调会返回该上传任务的 taskId
     * 
     * *******/
    // 取消上传任务
    cancelTask(taskId) {
        cos.cancelTask(taskId)
    }
}

// async function fn(obj) {
//     await obj.ready();
//     obj.PPTApplication().ActivePresentation.View.Zoom = 100
//     await obj.PPTApplication().ActivePresentation.SlideShowSettings.Run()
//     setTimeout(async () => {
//         await obj.PPTApplication().ActivePresentation.SlideShowWindow.View.GotoPreClick()
//         console.log(123);
//     }, 2000);
//     console.log(obj);
//     // const iframeEl = obj.iframe.contentWindow;
//     // console.log(document.querySelector('.web-office-iframe').contentDocument);
//     // console.log(document.querySelector('.web-office-iframe').contentWindow);
// }
