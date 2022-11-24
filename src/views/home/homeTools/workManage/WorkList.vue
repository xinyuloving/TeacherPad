<template>
    <div class="work-list">
        <div class="head">
            <TButton class="btn1" @touch="publish"> 发布作业 </TButton>
            <TButton class="btn2" @touch="batchDel"> 删除作业 </TButton>
        </div>
        <div class="main">
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="400"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                :header-cell-style="{
                    background: '#fafafa',
                    color: '#343434',
                }"
            >
                <el-table-column type="selection" align="center" width="50">
                </el-table-column>
                <el-table-column
                    prop="subjectName"
                    label="作业类型"
                    width="120"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="作业名称"
                    width="160"
                    align="center"
                    show-overflow-tooltip
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
                        <el-button type="text" @click="subPage(scope.row, 2)"
                            >查看</el-button
                        >
                        <el-button
                            type="text"
                            :style="{
                                color: scope.row.isSameDay
                                    ? '#409eff'
                                    : '#409eff75',
                            }"
                            @click="subPage(scope.row, 1)"
                            class="modify-btn"
                            >修改</el-button
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
                    <TButton class="btn1" @touch="del"> 确认删除 </TButton>
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
import TButton from "@/components/FunctionalComp/TButton.vue";
import { getAssignmentList, removeAssignment } from "@/api/user";
import ReconfirmDialog from "@/components/homeToolsPublic/reconfirmDialog.vue";
import TDialog from "@/components/FunctionalComp/TDialog";
// import cos from "@/utils/cos";
import Loading from "@/components/FunctionalComp/Loading";
import moment from "moment";
export default {
    components: {
        TButton,
        ReconfirmDialog,
        TDialog,
        Loading,
    },
    data() {
        return {
            tableData: [],
            // 请求数据
            pageData: {
                page: 1,
                pageSize: 5,
            },
            total: 0,
            teacherName: "",
            isDialog: false,
            delList: [],
            isLoading: false,
            currentDate: moment(new Date()).format("YYYY-MM-DD"),
        };
    },
    methods: {
        // 获取表格每一行的类名
        tableRowClassName({ row }) {
            return row.isSameDay ? "" : "forbidden";
        },
        handleSelectionChange(e) {
            console.log(e);
            this.delList = e;
        },
        publish() {
            // 发布作业
            this.$router.push({ name: "PublishWork", params: { type: 0 } });
        },
        // 修改和查看
        subPage(row, type) {
            // 如果不是当天的作业则只能查看不能修改
            if (type === 1 && !row.isSameDay) return;
            // 路由需要携带的参数
            const obj = {
                classCode: row.clazzCode,
                content: row.content,
                title: row.title,
                subjectCode: row.subjectCode,
                picture: row.picture && row.picture.split(","),
                isSameDay: row.isSameDay,
                id: row.id,
            };
            this.$router.push({
                name: "PublishWork",
                params: { ...obj, type },
            });
        },
        // 再次确认
        again(row) {
            this.delList = [row];
            this.isDialog = true;
        },
        del() {
            this.delList.forEach((item) => {
                this.delAssignment(item.id);
                // item.picture && this.batchRemoveByCos(item.picture.split(","));
                for (let i = 0; i < this.tableData.length; i++) {
                    // console.log(item.id, this.tableData[i].id);
                    if (item.id === this.tableData[i].id) {
                        console.log(i);
                        this.tableData.splice(i, 1);
                    }
                }
                // if (item.picture) this.batchRemoveByCos(item.picture.split(','))
            });
            this.isDialog = false;
        },
        // 批量删除
        batchDel() {
            if (!this.delList.length)
                return this.$message({
                    message: "请选择作业！",
                    type: "warning",
                });
            this.isDialog = true;
        },
        // 删除作业
        async delAssignment(id) {
            try {
                // console.log({id: row.id});
                const res = await removeAssignment({ id });
                console.log(res);
                if (!this.tableData.length && this.pageData.page !== 1) {
                    this.pageData.page--;
                    this.getAssignmentList();
                } else if (this.pageData.page === 1 && this.total > 5) {
                    this.getAssignmentList();
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 从腾讯云批量删除
        // async batchRemoveByCos(files) {
        //     try {
        //         const list = [];
        //         files.forEach((item) => list.push({ Key: item }));
        //         await cos.batchRemove({
        //             type: 0,
        //             keys: list,
        //         });
        //     } catch (err) {
        //         console.log(err);
        //     }
        // },
        // 页码变更事件
        pageChange(e) {
            this.pageData.page = e;
            this.getAssignmentList();
        },
        // 获取作业列表
        async getAssignmentList() {
            try {
                this.isLoading = true;
                const { data } = await getAssignmentList(
                    JSON.stringify(this.pageData)
                );
                console.log(data);
                data.assignmentList.forEach((item) => {
                    item.teacherName = this.teacherName;
                    item.gradeAndClass = item.gradeName + item.clazzName;
                    item.isSameDay = this.currentDate === item.date;
                });
                this.tableData = data.assignmentList;
                this.total = data.total;
                this.isLoading = false;
            } catch (err) {
                this.isLoading = false;
                console.log(err);
            }
        },
    },

    created() {
        this.teacherName =
            this.$store._modules.root.state.teacher.teacherInfo.name;
        this.getAssignmentList();
    },
};
</script>

<style lang="less" scoped>
.work-list {
    width: 100%;
    height: 100%;
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
}
</style>
