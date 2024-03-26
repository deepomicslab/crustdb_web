<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">CrustDB Informtion</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="download">
                        <template #icon>
                            <n-icon>
                                <di />
                            </n-icon>
                        </template>
                        Download CrustDB Data
                    </el-button>
                </div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="selectRepeat">
                        <template #icon>
                            <n-icon>
                                <selectIcon />
                            </n-icon>
                        </template>
                        Choose Repeat #
                    </el-button>
                </div>
            </div>

            <!-- Phage Informatin table -->
            <el-descriptions
                class="w-330 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loaddata"
            >
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Data UID</div>
                    </template>
                    {{ detailsdata.repeat_data_uid }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Seed</div>
                    </template>
                    {{ detailsdata.seed }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Sample Name</div>
                    </template>
                    {{ detailsdata.sample_name }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Threshold for gene filter</div>
                    </template>
                    {{ detailsdata.gene_filter_threshold }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">
                            Proportion of genes used for Rotation Derivation
                        </div>
                    </template>
                    {{ detailsdata.anchor_gene_proportion }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    {{ detailsdata.task_id }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Number of total Transcription centers</div>
                    </template>
                    {{ detailsdata.inferred_trans_center_num }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Convergence Curve</h1>
            </div>
            <!-- <div class="flex flex-row justify-between mt-6 ml-8 w-285">
                <n-form-item label="Please choose plot type" class="w-100">
                    <n-select
                        v-model:value="linechartvalue"
                        :options="linechartoptions"
                        @update:value="detailsdata"
                    ></n-select>
                </n-form-item>
            </div> -->
            <div class="flex flex-row">
                <div class="w-300 h-150 mb-10 mt-5 p-5 ml-8" style="box-shadow: 0 0 64px #cfd5db">
                    <div id="myEcharts" class="h-140" ref="echartlineDom"></div>
                </div>
            </div>
        </div>
    </div>
    <el-dialog
        v-model="downloadphagedialogVisible"
        title="Select download data"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox
                    v-for="v in repeat_data_uid_list"
                    :key="v"
                    :label="'Download ' + v + '.zip'"
                />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloadphagedialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="selectRepeatDialogVisible" title="Select repeat #" width="30%" align-center>
        <div>
            <el-checkbox-group v-model="selectRepeatCheckList" :max="1">
                <el-checkbox
                    v-for="(v, idx) in repeat_data_uid_list"
                    :key="v"
                    :label="'(Repeat #' + (idx + 1) + ') ' + v"
                />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="selectRepeatDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="selectRepeatRequest">Select</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { CloudDownloadOutline as di, AddCircleOutline as selectIcon } from '@vicons/ionicons5'
//
import axios from 'axios'
import { reactive, ref } from 'vue'
import * as echarts from 'echarts'
import _ from 'lodash'
import { usePhageStore } from '@/store/phage'
// import { useCrustDBStore } from '@/store/crustdb'

const phageStore = usePhageStore()
// const crustdbStore = useCrustDBStore()
const loaddata = ref(false)
const route = useRoute()
const phageid = computed(() => route.query?.crustdb_main_id as number)
const repeatuid = computed(() => route.query?.details_uid as string)
let mylineEcharts

const phagedata = ref({
    ST_platform: '',
    species: '',
    disease_steps: '',
    developmental_stage: '',
    sex: '',
    cell_type: '',
    cell_num: 0,
    gene_num: 0,
    uniq_data_uid: '',
    slice_name: '',
    repeat_data_uid_list: [],
})

const detailsdata = ref({
    repeat_data_uid: '',
    seed: 0,
    sample_name: '',
    gene_filter_threshold: '',
    anchor_gene_proportion: 0,
    task_id: '',
    inferred_trans_center_num: 0,
    distance_list: [],
})

const echartlineDom = ref<HTMLElement | null>(null)
// const linechartvalue = ref('Convergence of Conformation with Cytocraft')
// const linechartoptions = [
//     {
//         label: 'ST Platform Distribution',
//         value: 'ST Platform Distribution',
//     },
//     {
//         label: 'ST Platform Distribution',
//         value: 'ST Platform Distribution',
//     },
// ]

const downloadphagedialogVisible = ref(false)

const selectRepeatDialogVisible = ref(false)
const repeat_data_uid_list = ref([] as any[])

const downloadtype = ref('')
const checkList = ref([] as any[])
const selectRepeatCheckList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
// const router = useRouter()

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select one zip data to download', {
            closable: true,
            duration: 5000,
        })
    } else {
        window.open(
            `/api/crustdb_main/zip/?crustid=${checkedRowKeysRef.value[0]}&checkList=${checkList.value}`,
            '_blank'
        )
    }
    checkList.value.length = 0
}

const selectRepeatRequest = async () => {
    if (selectRepeatCheckList.value.length === 0) {
        window.$message.warning('Please select one repeat', {
            closable: true,
            duration: 5000,
        })
    } else {
        const data_uid = selectRepeatCheckList.value[0].split(' ')[2]
        // console.log(data_uid) // Stage44.CP_1XOH
        selectRepeatCheckList.value.length = 0 // clear the checkList
        const response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: data_uid, // details.repeat_data_uid
            },
        })
        detailsdata.value = response2.data
        selectRepeatDialogVisible.value = false
    }
}

const chartOption = () => {
    mylineEcharts.setOption({
        title: {
            text: `Convergence of Conformation with Cytocraft\n${detailsdata.value.repeat_data_uid}`,
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
                // magicType: { type: ['line', 'bar'] },
                // restore: {},
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
                name: 'CrustDB',
                type: 'line',
                data: detailsdata.value.distance_list,
            },
        ],
    })
}
const updateRepeatList = () => {
    repeat_data_uid_list.value.length = 0
    for (let i = 0; i < phagedata.value.repeat_data_uid_list.length; i += 1) {
        repeat_data_uid_list.value.push(
            `${phagedata.value.uniq_data_uid}_${phagedata.value.repeat_data_uid_list[i]}`
        )
    }
}
const selectRepeat = () => {
    updateRepeatList()
    selectRepeatDialogVisible.value = true
}
const download = () => {
    updateRepeatList()
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [phageid.value]
}

onBeforeMount(async () => {
    // From table crustdb_main
    loaddata.value = true
    phageStore.phagedataloaded = false
    phageStore.phageid = phageid.value
    // const response = await axios.get(`/phage/detail`, {
    const response = await axios.get(`/crustdb_main/detail`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: phageid.value, // crustdb_main.id
        },
    })
    const { data } = response
    phagedata.value = data

    // From table details
    let response2 = null
    if (repeatuid.value === '') {
        response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                crustdb_main_id: phagedata.value.uniq_data_uid, // details.repeat_data_uid
            },
        })
    } else {
        response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: repeatuid.value, // details.repeat_data_uid
            },
        })
    }

    detailsdata.value = response2.data // show the 1st repeat, by default
    // crustdbStore.detailsDistanceList = detailsdata.value.distance_list
    loaddata.value = false
})
onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
    chartOption()
})

watch(detailsdata, () => {
    chartOption()
})

const pagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    },
})
</script>
