<template>
    <div class="flex flex-col justify-center items-center">
        <div class="mt-10 w-9/10 mb-10" v-if="props.enableTable">
            <el-descriptions class="text-lg" :column="2" size="large" border v-loading="loading">
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    {{ taskdata.results.id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Using Demo File</div>
                    </template>
                    {{ taskdata.results.is_demo_input }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Species</div>
                    </template>
                    {{ taskdata.results.species }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task Status</div>
                    </template>
                    <el-tag :type="getStatus(taskdata.results.status)" size="large">
                        {{ taskdata.results.status }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Analysis Type</div>
                    </template>
                    {{ taskdata.results.analysis_type }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Created At</div>
                    </template>
                    {{ taskdata.results.created_at }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="w-9/10" v-if="props.enableTab">
            <el-tabs
                v-model="activeName"
                class="text-xl"
                type="card"
                @tab-click="handletabClick"
                v-loading="loading"
            >
                <!-- <el-tab-pane v-for="key in taskdata.results.modulelist" :key="key" :name="key">
                    <template #label>
                        <span class="custom-tabs-label text-2xl">
                            <span>{{ key }}</span>
                        </span>
                    </template>
                </el-tab-pane> -->
                Craft Log
                <el-scrollbar :class="logStyle" v-loading="consoleloading">
                    <n-code :code="taskmoduledetail.craftlog" word-wrap show-line-numbers />
                </el-scrollbar>
                <br />
                Sbatch Log
                <el-scrollbar :class="logStyle" v-loading="consoleloading">
                    <n-code :code="taskmoduledetail.sbatchlog" word-wrap show-line-numbers />
                </el-scrollbar>
                <br />
                Sbatch Error
                <el-scrollbar :class="logStyle" v-loading="consoleloading">
                    <n-code :code="taskmoduledetail.sbatcherror" word-wrap show-line-numbers />
                </el-scrollbar>
            </el-tabs>
        </div>
        <div class="w-full" v-if="!props.enableTab">
            Craft Log
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.craftlog" word-wrap show-line-numbers />
            </el-scrollbar>
            <br />
            Sbatch Log
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.sbatchlog" word-wrap show-line-numbers />
            </el-scrollbar>
            <br />
            Sbatch Error
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.sbatcherror" word-wrap show-line-numbers />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import axios from 'axios'

// const route = useRoute()
// const taskid = computed(() => route.query?.taskid as string)

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

const props = defineProps({
    taskid: String,
    enableTable: Boolean,
    enableTab: Boolean,
})
const taskid = computed(() => {
    return props.taskid as string
})
const activeName = ref('')
const taskdata = ref({
    results: {
        id: 0,
        user_id: 0,
        is_demo_input: true,
        analysis_type: '',
        species: '',
        status: '',
        created_at: '',
        input_path: [] as any[],
    },
})
const taskmoduledetail = ref({
    status: '',
    sbatchlog: '',
    sbatcherror: '',
    craftlog: '',
})
const loading = ref(false)
const consoleloading = ref(false)
// const logStyle = computed(
//     () => {
//         console.log('log style')
//         return 'h-96 bg-dark p-4 text-light' ? props.enableTable : 'h-150 bg-dark p-4 text-light'
//     }
//     // 'h-96 bg-dark p-4 text-light' ? props.enableTable : 'h-150 bg-dark p-4 text-light'
// )
const logStyle = ref('h-150 bg-dark p-4 text-light')

const fetchData = async () => {
    loading.value = true
    consoleloading.value = true
    if (props.enableTab || props.enableTable) {
        const response2 = await axios.get(`/tasks/detail/`, {
            baseURL: '/api',
            timeout: 100000,
            params: {
                taskid: taskid.value,
            },
        })
        taskdata.value = response2.data
        // console.log('response2.data.results', response2.data.results)
        // const { modulelist } = response2.data.results
        // taskdata.value.results.modulelist = JSON.parse(modulelist.replace(/'/g, '"'))
        // taskdata.value.results.task_detail = JSON.parse(response2.data.results.task_detail)
        // const firstModule = taskdata.value.results.modulelist.slice(0, 1)[0]
        // activeName.value = firstModule
        // module = firstModule
        console.log('taskdata.value', taskdata.value)
        loading.value = false
    }

    const response3 = await axios.get(`/tasks/detail/log/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
        },
    })
    taskmoduledetail.value.sbatchlog = response3.data.sbatch_log
    taskmoduledetail.value.sbatcherror = response3.data.sbatch_error
    taskmoduledetail.value.craftlog = response3.data.craft_log
    consoleloading.value = false
}

onBeforeMount(async () => {
    await fetchData()
})

watch(taskid, async () => {
    await fetchData()
})

const handletabClick = async (tab: any) => {
    consoleloading.value = true
    const response3 = await axios.get(`/tasks/detail/log/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
            moudlename: tab.props.name,
        },
    })
    taskmoduledetail.value.sbatchlog = response3.data.sbatch_log
    taskmoduledetail.value.sbatcherror = response3.data.sbatch_error
    taskmoduledetail.value.craftlog = response3.data.craft_log
    consoleloading.value = false
}
</script>
