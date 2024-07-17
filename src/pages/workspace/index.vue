<template>
    <div class="card h-full flex flex-col py-10 px-1/9 items-center">
        <div class="flex flex-col my-2 w-200 mt-20">
            <div class="text-4xl mt-5 font-600 text-center">Task Query</div>
            <div class="flex flex-col mt-5 justify-center items-center">
                <el-input
                    type="text"
                    v-model:value="inputdata.taskid"
                    size="small"
                    placeholder="Please enter your task ID"
                    class="w-170 h-10 s"
                >
                    <template #append>
                        <el-button type="primary" :icon="Search">Search</el-button>
                    </template>
                </el-input>
                <div class="text-lg text-gray-600 mt-2">
                    You could check the submitted task by Task ID.
                </div>
            </div>
        </div>
        <n-alert type="info" closable :bordered="false" class="w-320 bg-[#9ab4c5] mt-10">
            <template #icon>
                <el-icon class="text-lg mt-2 text-[#34498E]">
                    <InfoFilled />
                </el-icon>
            </template>
            <template #header>
                <p class="text-xl text-gray-50">Notice</p>
            </template>
            <div id="notice" class="text-lg text-gray-50">
                <p class="mb-2">Dear esteemed users,</p>
                <p class="mb-2">
                    If you encounter any further errors, please do not hesitate to contact us via
                    email at
                    <strong class="text-[#ee7e7d] font-400 mx-1 text-[18px]">
                        <a href="mailto:syang58-c@my.cityu.edu.hk">xxx-c@my.cityu.edu.hk</a>
                    </strong>

                    . We assure you that our team is dedicated to resolving any issues as quickly
                    and efficiently as possible, and we will respond to your concerns at the
                    earliest.
                </p>
                <p class="mb-2">We thank you for your patience and understanding.</p>
            </div>
        </n-alert>
        <div class="grid place-items-center my-2 mt-20">
            <div class="mt-1.5 flex flex-row justify-center items-center refr w-200">
                <div class="text-4xl text-3 font-500">Submitted Task(s)</div>
                <n-button class="ml-3" size="large" round @click="refresh($event)" color="#626aef">
                    <el-icon class="mr-2">
                        <Refresh />
                    </el-icon>
                    Refresh Status
                </n-button>
            </div>
            <div class="text-lg text-gray-600 mt-3">
                Click refresh button to refresh task status.
            </div>
        </div>

        <div class="my-6 tb" v-loading="loading">
            <n-data-table
                :columns="columns"
                :data="taskList"
                :row-key="rowKey"
                :scroll-x="1500"
                :max-height="1600"
                :pagination="pagination"
            />
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="Task Log" width="75%">
        <log v-model:taskid="taskid" :enableTab="true" :enableTable="true" />
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import { NButton, NTag } from 'naive-ui'
import {} from '@vicons/ionicons5'
import { Search, Refresh, InfoFilled } from '@element-plus/icons-vue' /* RefreshRight */
import axios from 'axios'
// import { ElNotification } from 'element-plus'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import log from '../task/log.vue'
import { encrypt } from '@/utils/crypto'

const inputdata = ref({
    taskid: '',
})

const userid = ref()
const loading = ref(false)
const taskdata = ref([] as any[])
const dialogVisible = ref(false)
const taskid = ref('')

const refreshTaskResultfromDB = async () => {
    await axios.post(`/tasks/refresh/`, null, {
        baseURL: '/api',
        timeout: 10000,
    })
}

onBeforeMount(async () => {
    refreshTaskResultfromDB()

    const { isCookieExist, userId, getUserIdFromCookie } = useUserIdGenerator()

    getUserIdFromCookie()
    userid.value = userId.value as string
    const CookieExist = ref(isCookieExist())
    if (CookieExist.value) {
        loading.value = true
        const response = await axios.get(`/tasks/list/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                userid: userid.value,
            },
        })
        const { data } = response
        taskdata.value = data.results
        loading.value = false
    } else {
        window.$message.warning('Please agree with cookie', {
            closable: true,
            duration: 5000,
        })
    }
})

const taskList = computed(() => {
    return taskdata.value
})

// const taskList = computed({
//     get() {
//         return taskdata.value
//     },
//     set() {
//         taskList.value = taskdata.value
//     },
// })

type RowData = {
    id: number
    analysis_type: string
    is_demo_input: boolean
    status: any
    created_at: string
    actions: any
}
const rowKey = (row: RowData) => {
    return row.id
}

const router = useRouter()

const refreshfunction = async () => {
    loading.value = true
    const response = await axios.get(`/tasks/list/`, {
        baseURL: '/api',
        timeout: 50000,
        params: {
            userid: userid.value,
        },
    })
    const { data } = response
    taskdata.value = data.results
    loading.value = false
}

const refresh = async (event: any) => {
    const ts = event.target
    ts.blur()
    refreshTaskResultfromDB()
    refreshfunction()
}

const canceltask = async (thistaskid: any) => {
    const postdata = new FormData()
    postdata.append('taskid', thistaskid)
    await axios.post(`/tasks/cancel/`, postdata, {
        baseURL: '/api',
        timeout: 10000,
    })
    refreshfunction()
}

const viewdetail = (row: any) => {
    if (row.status === 'Success' || row.status === 'Failed') {
        if (row.analysis_type === 'Single Celltype Mode') {
            router.push({
                path: '/task/result/conformation/single_celltype_mode',
                query: {
                    taskid: encrypt(
                        row.id,
                        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
                    ),
                },
            })
        } else if (row.analysis_type === 'Multi-Celltype Mode') {
            router.push({
                path: '/task/result/conformation/multi_celltype_mode',
                query: {
                    taskid: encrypt(
                        row.id,
                        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
                    ),
                },
            })
        } else if (row.analysis_type === 'Topology Construction') {
            router.push({
                path: '/task/result/conformation/topology',
                query: {
                    taskid: encrypt(
                        row.id,
                        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
                    ),
                },
            })
        }
    }
    // ======= Archive =======
    // else if (row.status === 'Failed') {
    //     window.$message.warning('Task is Failed, please view task detail ', {
    //         closable: true,
    //         duration: 5000,
    //     })
    // }
    else if (row.status === 'Running') {
        window.$message.warning('Task is Running, please wait for a moment ', {
            closable: true,
            duration: 5000,
        })
    } else if (row.status === 'Submitted') {
        window.$message.warning('Task is Submitted, please wait for a moment ', {
            closable: true,
            duration: 5000,
        })
    }
}

const getStatus = (status: any) => {
    if (status === 'Running') {
        return 'info'
    }
    if (status === 'Success') {
        return 'success'
    }
    if (status === 'Failed' || status === 'Canceled') {
        return 'error'
    }
    if (status === 'Created') {
        return 'warning'
    }
    return 'warning'
}

const pagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    'show-quick-jumper': true,
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    },
})

const action_list = (row: any) => {
    const this_list = []
    if (row.status === 'Created' || row.status === 'Running') {
        this_list.push(
            h(
                NButton,
                {
                    strong: true,
                    size: 'small',
                    type: 'primary',
                    // disabled: row.status === 'Success' || row.status === 'Canceled',
                    color: '#35488E',
                    style: {
                        width: '100px',
                    },
                    onClick: () => {
                        canceltask(row.id)
                    },
                },
                {
                    default: () => {
                        return 'Cancel Task'
                    },
                }
            )
        )
    } else if (row.status === 'Success' || row.status === 'Failed') {
        this_list.push(
            h(
                NButton,
                {
                    strong: true,
                    size: 'small',
                    type: 'primary',
                    // disabled: row.status !== 'Success',
                    color: '#35488E',
                    style: {
                        width: '100px',
                    },
                    onClick: () => {
                        viewdetail(row)
                    },
                },
                {
                    default: () => {
                        return 'View Result'
                    },
                }
            )
        )
    }
    this_list.push(
        h(
            NButton,
            {
                strong: true,
                size: 'small',
                type: 'primary',
                color: '#35758e',
                style: {
                    width: '75px',
                },
                onClick: () => {
                    dialogVisible.value = true
                    taskid.value = row.id
                },
            },
            {
                default: () => {
                    return 'Task Log'
                },
            }
        )
    )
    return this_list
}

const colwidth = {
    id: 70,
    species: 50,
    analysis_type: 80,
    status: 50,
    created_at: 90,
    actions: 80,
}
const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            title: 'Task ID',
            key: 'id',
            align: 'center',
            sorter: 'default',
            defaultSortOrder: 'descend',
            width: colwidth.id,
        },
        {
            title: 'Species',
            key: 'species',
            align: 'center',
            width: colwidth.species,
            filterOptions: [
                {
                    label: 'Human',
                    value: 'Human',
                },
                {
                    label: 'Mouse',
                    value: 'Mouse',
                },
                {
                    label: 'Axolotl',
                    value: 'Axolotl',
                },
                {
                    label: 'Monkey',
                    value: 'Monkey',
                },
            ],
            filter(value: any, row: any) {
                return row.species === value
            },
        },
        {
            title: 'Analysis Type',
            key: 'analysis_type',
            align: 'center',
            width: colwidth.analysis_type,
            filterOptions: [
                {
                    label: 'Single Celltype Mode',
                    value: 'Single Celltype Mode',
                },
                {
                    label: 'Multi-Celltype Mode',
                    value: 'Multi-Celltype Mode',
                },
                {
                    label: 'Topology Construction',
                    value: 'Topology Construction',
                },
            ],
            filter(value: any, row: any) {
                return row.analysis_type === value
            },
        },
        {
            title: 'Status',
            key: 'status',
            align: 'center',
            width: colwidth.status,
            filterOptions: [
                {
                    label: 'Success',
                    value: 'Success',
                },
                {
                    label: 'Failed',
                    value: 'Failed',
                },
                {
                    label: 'Running',
                    value: 'Running',
                },
                {
                    label: 'Submitted',
                    value: 'Submitted',
                },
            ],
            filter(value: any, row: any) {
                return row.status === value
            },
            render(row: any) {
                return h('div', [
                    h(
                        NTag,
                        {
                            type: getStatus(row.status),
                            size: 'small',
                        },
                        {
                            default: () => row.status,
                        }
                    ),
                ])
            },
        },
        {
            title: 'Created Time',
            key: 'created_at',
            align: 'center',
            width: colwidth.created_at,
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            width: colwidth.actions,
            fixed: 'right',
            render(row: any) {
                return h(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-around',
                        },
                    },
                    action_list(row)
                )
            },
        },
    ]
}

const columns = createColumns()
</script>

<style scoped>
.el-input {
    --el-input-border-radius: 20px;
}

.el-input:hover {
    --el-input-hover-border-color: #626aef;
    --el-input-focus-border-color: #626aef;
    --el-input-border-color: #626aef;
}

.s >>> .el-input__wrapper {
    padding: 1px 20px;
    font-size: medium;
    color: #495057;
}

.s >>> .el-input-group__append {
    background-color: #626aef;
    color: white;
    font-size: 13px;
}

.s >>> .el-input-group__append:hover {
    background-color: white;
    color: #626aef;
    --el-input-border-color: #626aef;
}

.tb >>> .n-data-table.n-data-table--bordered .n-data-table-wrapper {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.tb >>> .n-data-table .n-data-table-wrapper {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.tb >>> .n-data-table .n-data-table-th {
    --n-th-font-weight: bold;
    --n-th-icon-color: white;
    background-color: #c5d4dd !important;
}
</style>
