<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="mt-18 ml-10">
            <div class="flex flex-row border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Task Result Page</div>
            </div>
        </div>
        <div class="mt-5 ml-15">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Task Result</div>
        </div>
        <div class="w-330 mt-5 ml-15">
            <el-descriptions class="w-330 text-xl mt-8" :column="2" size="large" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    <div class="cell-item">{{ taskdata.results.id }}</div>
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
                    <el-tag :type="StatusColor(taskdata.results.status)" size="large">
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
        <div class="mt-18" v-if="!craftsuccess">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Craft Output</div>
        </div>
        <div class="mt-18" v-if="!craftsuccess && detailsdata">
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="detailsdata.log_lines" word-wrap show-line-numbers />
            </el-scrollbar>
        </div>
    </div>
    <topologyVis :taskid="taskid" v-if="craftsuccess" />
</template>

<script setup lang="ts">
import axios from 'axios'
import { decrypt } from '@/utils/crypto'
import { StatusColor } from '@/utils/crustdb'
import topologyVis from './topology_vis.vue'

const craftsuccess = ref(true)
const logStyle = ref('h-150 bg-dark p-4 text-light')
const consoleloading = ref(false)

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})

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

const detailsdata = ref()

onBeforeMount(async () => {
    const response2 = await axios.get(`/tasks/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    taskdata.value = response2.data
    if (taskdata.value.results.status === 'Success') {
        craftsuccess.value = true
    } else if (taskdata.value.results.status === 'Failed') {
        craftsuccess.value = false
    }

    // if (taskdata.value.results.status === 'Success') {
    //     loaddata.value = true
    //     const response3 = await axios.get(`/tasks/detail/result/`, {
    //         baseURL: '/api',
    //         timeout: 10000,
    //         params: {
    //             taskid: taskid.value,
    //             celltype: '',
    //         },
    //     })
    //     const [data1, data2] = response3.data

    //     taskresultdatakeys.value = data1
    //     taskresultdata.value = data2
    //     detailsdata.value = taskresultdata.value[taskresultdatakeys.value[0]]
    //     loaddata.value = false
    // } else if (taskdata.value.results.status === 'Failed') {
    //     consoleloading.value = true
    //     const response3 = await axios.get(`/tasks/detail/result_log/`, {
    //         baseURL: '/api',
    //         timeout: 100000,
    //         params: {
    //             taskid: taskid.value,
    //         },
    //     })
    //     const [data1, data2] = response3.data

    //     taskresultdatakeys.value = data1
    //     taskresultdata.value = data2
    //     detailsdata.value = taskresultdata.value[taskresultdatakeys.value[0]]
    //     consoleloading.value = false
    // }
})
</script>
