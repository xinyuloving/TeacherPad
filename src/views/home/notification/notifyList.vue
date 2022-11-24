<template>
    <div class="notify-list">
        <div class="head">
            <TButton class="btn1" @touch="$router.push({ name: 'EditNotify' })"> 发布通知 </TButton>
            <TButton class="btn2" @touch="del(0)"> 删除通知 </TButton>
        </div>
        <div class="main">
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="400"
                @selection-change="handleSelectionChange"
                :header-cell-style="{
                    background: '#fafafa',
                    color: '#343434',
                }"
            >
                <el-table-column type="selection" align="center" width="50">
                </el-table-column>
                <el-table-column
                    prop="topic"
                    label="通知标题"
                    width="160"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="gradeAndClass"
                    label="发布班级"
                    align="center"
                    width="200"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="teacherName"
                    width="160"
                    label="发布者"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="发布时间"
                    align="center"
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="200"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button class="my-but" type="text" @click="look(scope.row)"
                            >查看</el-button
                        >
                        <el-button
                            class="remove-btn"
                            @click="again(scope.row)"
                            type="text"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                background
                @current-change="pageChange"
                layout="prev, pager, next, jumper"
                :current-page="pageData.page"
                :page-size="pageData.pageSize"
                :total="total"
            >
            </el-pagination>
        </div>
        <!-- 二次确认框 -->
        <TDialog
            :visible.sync="isDialog"
            :dialogConStyle="{
                background: '#F1F1F3',
                width: '5.2rem',
                height: '3rem',
            }"
        >
            <template v-slot:header>
                <div class="d-title">删除</div>
            </template>
            <template v-slot>
                <div class="d-content">
                    删除后学生端将同步删除， 确认删除吗？
                </div>
            </template>
            <template v-slot:footer>
                <div class="d-but">
                    <TButton class="btn1" @touch="delNotifyById"> 确认删除 </TButton>
                    <TButton class="btn2" @touch="isDialog = false">
                        取消
                    </TButton>
                </div>
            </template>
        </TDialog>
        <!-- 加载效果 -->
        <Loading contentText="加载中" v-if="isLoading" />
    </div>
</template>

<script>
import TButton from '@/components/FunctionalComp/TButton.vue'
import TDialog from "@/components/FunctionalComp/TDialog";
// import cos from "@/utils/cos";
import Loading from "@/components/FunctionalComp/Loading";
import { getNotifys, delNotifyById } from '@/api/notify'

export default {
    name: 'NotifyList',

    components: {
        TButton,
        TDialog,
        Loading
    },

    data() {
        return {
            tableData: [],
            // 请求数据
            pageData: {
                page: 1,
                pageSize: 5,
                account: this.$store.getters.teacherAccount
            },
            total: 0,
            teacherName: "",
            isDialog: false,
            delList: [],
            isLoading: false,
            teacherName: this.$store.state.teacher.teacherInfo.name,
            delIds: [],
            delType: 0,
            // delImgs: []
        };
    },

    methods: {
        handleSelectionChange(e) {
            if (e.length) {
                this.delIds[0] = e.map(item => item.id);
                let arr = [];
                e.forEach(item => {
                    arr.push(...JSON.parse(item.images))
                })
                // this.delImgs[0] = arr.map(i => ({Key: i}))
            } else {
                this.delIds[0] = null
            }
        },
        // 页码发生改变
        pageChange(e) {
            this.pageData.page = e;
            this.getNotifys()
        },
        look(row) {
            this.$router.push({ name: 'EditNotify', params: row })
        },
        again(row) {
            this.delIds[1] = [row.id];
            // this.delImgs[1] = JSON.parse(row.images).map(i => ({Key: i}));
            this.del(1)
        },
        // 删除
        del(n) {
            if (!n && !this.delIds[0]) return this.$message({
                message: '请选择要删除的通知！',
                type: 'warning'
            })
            this.delType = n;
            this.isDialog = true
        },
        // 获取通知列表
        async getNotifys() {
            try {
                this.isLoading = true;
                const { data } = await getNotifys(this.pageData);
                this.total = data.count;
                let arr = [];
                data.noticeSendParamList.forEach(item => {
                    arr.push({...item, 
                        gradeAndClass: item.gradeName + item.clazzName,
                        teacherName: this.teacherName  
                    })
                });
                this.tableData = arr;
                this.isLoading = false;
                console.log(arr);
            } catch (err) {
                this.isLoading = false;
                console.log(err);
            }
        },
        // 删除通知
        async delNotifyById() {
            try {
                this.isDialog = false;
                this.isLoading = true;
                await delNotifyById(JSON.stringify(this.delIds[this.delType]));
                // this.batchRemoveImg()
                this.getNotifys()
            } catch(err) {
                this.isLoading = false;
                this.$message({
                    message: '删除失败，请重试！',
                    type: 'error'
                })
                console.log(err);
            }
        },
        // async batchRemoveImg() {
        //     try {
        //         const res = await cos.batchRemove({
        //             type: 0,
        //             keys: this.delImgs[this.delType]
        //         })
        //         console.log(res);
        //     } catch(err) {
        //         console.log(err);
        //     }
        // }
    },

    created() {
        this.getNotifys()
    }
}
</script>

<style lang="less" scoped>
.notify-list {
    .head {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.3rem;
        .btn1 {
            width: 1.67rem;
            height: 0.42rem;
            background: #3e83f8;
            border-radius: 0.08rem;
            font-size: 0.23rem;
            font-weight: 400;
            color: #fff;
            margin: 0 0.25rem 0 0;
        }
        .btn2 {
            width: 1.67rem;
            height: 0.42rem;
            background: #fa6363;
            border-radius: 0.08rem;
            font-size: 0.23rem;
            font-weight: 400;
            color: #fff;
        }
    }
    .main {
        .modify-btn {
            margin: 0 0.05rem;
        }
        .remove-btn {
            color: #fa6363;
            margin-left: 0;
        }
        .el-pagination {
            margin-top: 10px;
            text-align: right;
        }
        .el-table {
            /deep/ .forbidden {
                color: #60626673;
            }
        }
    }
    .t-dialog-wrapper {
        .d-title {
            font-size: 0.27rem;
            font-weight: 600;
            line-height: 2.4;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #dedede;
        }
        .d-content {
            font-size: 0.23rem;
            text-align: center;
            padding: 0.3rem 0.5rem 0.5rem;
        }
        .d-but {
            width: 100%;
            height: 0.8rem;
            display: flex;
            justify-content: space-evenly;
            .btn1 {
                font-size: 0.23rem;
                width: 2.2rem;
                height: 0.5rem;
                color: #fff;
                background: #3e83f8;
            }
            .btn2 {
                width: 2.2rem;
                height: 0.5rem;
                background: #fff;
                border-radius: 0.08rem;
                font-size: 0.23rem;
                font-weight: 400;
                color: #333;
            }
        }
    }
    .my-but {
        margin-right: 10px;
    }
}
</style>