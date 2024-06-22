<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="mt-18">
            <div class="flex flex-row border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Task Result Page</div>
                <div class="mt-1.5 ml-0">
                    <div class="text-4xl font-500 mb-4">
                        <el-button type="primary" class="ml-5" @click="choosecelltypetoshow">
                            Choose Cell Type
                        </el-button>
                    </div>
                </div>
                <div class="mt-1.5 ml-0">
                    <div class="text-4xl font-500 mb-4">
                        <el-button type="primary" class="ml-5" @click="choosecelltypetodownload">
                            Download Result
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-10">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Task Result</div>
        </div>
        <div class="w-330 mt-5">
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
                    <el-tag
                        :type="taskdata.results.status === 'Success' ? 'success' : 'warning'"
                        size="large"
                    >
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
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Seed</div>
                    </template>
                    {{ detailsdata && detailsdata.seed }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Sample Name</div>
                    </template>
                    {{ detailsdata && detailsdata.sample_name }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Threshold for gene filter</div>
                    </template>
                    {{ detailsdata && detailsdata.gene_filter_threshold }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">
                            Proportion of genes used for Rotation Derivation
                        </div>
                    </template>
                    {{ detailsdata && detailsdata.anchor_gene_proportion }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    {{ detailsdata && detailsdata.task_id }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Number of total Transcription centers</div>
                    </template>
                    {{ detailsdata && detailsdata.inferred_trans_center_num }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="mt-18">
            <div class="text-3xl mt-5 ml-7 font-500 text-[#3262a8]">Convergence Curve</div>
        </div>
        <div class="mt-5">
            <div id="myEcharts" class="h-140" ref="echartlineDom"></div>
        </div>
    </div>
    <el-dialog
        v-model="choosecelltypetoshowdialogVisible"
        title="Select cell type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox v-for="v in taskresultdatakeys" :key="v" :label="v" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="selecttoshowcancelrequest">Cancel</el-button>
                <el-button type="primary" @click="selecttoshowconfirmrequest">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="choosecelltypetodownloaddialogVisible"
        title="Select cell type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="v in taskresultdatakeys" :key="v" :label="v" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="selecttodownloadcancelrequest">Cancel</el-button>
                <el-button @click="selecttodownloadallrequest">Select All</el-button>
                <el-button type="primary" @click="selecttodownloadconfirmrequest">
                    Download
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'
// import { usetaskStore } from '@/store/task'
// import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
// import { Reader } from '@vicons/ionicons5'
// import { lifestyleoption } from '@/utils/overview'
// import log from '../../log.vue'
import { decrypt } from '@/utils/crypto'

// const dialogVisible = ref(false)
const route = useRoute()
const echartlineDom = ref<HTMLElement | null>(null)
// const taskStore = usetaskStore()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})
// const lifestyledata = ref([] as any[])

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

const taskresultdata = ref()
const taskresultdatakeys = ref()
const detailsdata = ref()
const loaddata = ref(false)

let mylineEcharts: echarts.ECharts
const choosecelltypetoshowdialogVisible = ref(false)
const choosecelltypetodownloaddialogVisible = ref(false)
const checkList = ref([] as any[])

const selecttoshowcancelrequest = () => {
    checkList.value.length = 0
    choosecelltypetoshowdialogVisible.value = false
}

const selecttoshowconfirmrequest = () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select one cell type to show', {
            closable: true,
            duration: 5000,
        })
    } else {
        const selectedCellType = checkList.value[0]
        checkList.value.length = 0 // clear the checkList
        detailsdata.value = taskresultdata.value[selectedCellType]
        choosecelltypetoshowdialogVisible.value = false
    }
}

const choosecelltypetoshow = () => {
    choosecelltypetoshowdialogVisible.value = true
}

const selecttodownloadcancelrequest = () => {
    checkList.value.length = 0
    choosecelltypetodownloaddialogVisible.value = false
}

const selecttodownloadallrequest = () => {
    checkList.value = toRaw(taskresultdatakeys.value)
}

const selecttodownloadconfirmrequest = () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select at least one cell type to download', {
            closable: true,
            duration: 5000,
        })
    } else {
        window.open(
            `/api/tasks/zip/?taskid=${taskdata.value.results.id}&celltypes=${checkList.value}`,
            '_blank'
        )
    }
}

const choosecelltypetodownload = () => {
    choosecelltypetodownloaddialogVisible.value = true
}

onBeforeMount(async () => {
    const response2 = await axios.get(`/tasks/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    taskdata.value = response2.data

    loaddata.value = true
    const response3 = await axios.get(`/tasks/detail/result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            celltype: '',
        },
    })
    const [data1, data2] = response3.data

    taskresultdatakeys.value = data1
    taskresultdata.value = data2
    // console.log('taskresultdatakeys', taskresultdatakeys.value[0])
    detailsdata.value = taskresultdata.value[taskresultdatakeys.value[0]]
    // console.log('taskresultdatakeys', taskresultdatakeys.value)
    // console.log('taskresultdata', taskresultdata.value)
    loaddata.value = false

    // const response = await axios.get(`tasks/result/modules/`, {
    //     baseURL: '/api',
    //     timeout: 10000,
    //     params: {
    //         module: 'lifestyle',
    //         taskid: taskid.value,
    //     },
    // })
    // const { data } = response
    // lifestyledata.value = data.results

    // const lifestyleCounts = _.countBy(data.results, 'lifestyle')

    // const result = _.map(lifestyleCounts, (value, key) => {
    //     return { value, name: key }
    // })
    // lifestyleoption.series[0].data = result
    // const myEcharts = echarts.init(echartlineDom.value as HTMLElement)
    // myEcharts.setOption(lifestyleoption)
})

const chartOption = () => {
    mylineEcharts.setOption({
        title: {
            text: `Convergence of Cytocraft Conformation`,
            left: 'center',
        },
        tooltip: {},
        toolbox: {
            itemSize: 20,
            iconStyle: {
                borderColor: '#34498e',
            },
            feature: {
                dataView: { readOnly: true },
                saveAsImage: {},
            },
        },
        xAxis: {
            name: 'Iteration',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true,
            data: _.range(detailsdata.value.distance_list.length),
            axisLabel: {
                rotate: 0,
                fontSize: 13,
            },
        },
        yAxis: {
            name: 'cvRMSD',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true,
            type: 'value',
        },
        series: [
            {
                name: 'Iteration number',
                type: 'line',
                data: detailsdata.value.distance_list,
            },
        ],
    })
}

onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
    chartOption()
})

watch(detailsdata, () => {
    chartOption()
})
</script>
