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
                class="w-350 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loaddata"
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Data UID</div>
                    </template>
                    {{ detailsdata.repeat_data_uid }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Seed</div>
                    </template>
                    {{ detailsdata.seed }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Sample Name</div>
                    </template>
                    {{ detailsdata.sample_name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Threshold for gene filter</div>
                    </template>
                    {{ detailsdata.gene_filter_threshold }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            Proportion of genes used for Rotation Derivation
                        </div>
                    </template>
                    {{ detailsdata.anchor_gene_proportion }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    {{ detailsdata.task_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Number of total Transcription centers</div>
                    </template>
                    {{ detailsdata.inferred_trans_center_num }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- Gene Annotation -->
        <!-- <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Gene Annotation</div>
            </div>
            <div class="flex flex-row w-350 justify-between mb-5 mt-8">
                <el-button @click="downloadtsv">
                    <template #icon>
                        <n-icon>
                            <di />
                        </n-icon>
                    </template>
                    Download Gene Annotation Data
                </el-button>
            </div>
            <div class="w-350" v-loading="loaddata">
                <n-data-table
                    :data="proteinList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="250"
                    :row-key="rowKey"
                />
            </div>
        </div> -->

        <!-- Annotated Genome Map -->
        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Annotated Genome Map</div>
                <div class="mt-1.5 ml-10">
                    <el-button @click="showswicth" v-show="annoshow">View in Circo</el-button>
                    <el-button @click="showswicth" v-show="!annoshow">View in Detail</el-button>
                </div>
            </div>
            <div
                style="box-shadow: 0 0 64px #cfd5db"
                class="w-310 h-200 mt-5 ml-10 mb-20"
                v-show="annoshow"
            >
                <annotation />
            </div>
        </div>
        <div
            style="box-shadow: 0 0 64px #cfd5db"
            class="w-350 h-250 ml-2 mt-5 mb-20"
            v-show="!annoshow"
        >
            <circo />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phageterminator.length !== 0">
            <terminator />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phagetrna.length !== 0">
            <trna />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phageanti.length !== 0">
            <anti />
        </div>
        <div class="mt-20 ml-10" v-show="phageStore.phagecrispr.length !== 0">
            <crispr />
        </div>
        <div
            class="mt-20 ml-10"
            v-show="phageStore.phagearvf.ar.length !== 0 || phageStore.phagearvf.vf.length !== 0"
        >
            <arvf />
        </div>
        <div class="mt-20 ml-10 mb-20" v-show="phageStore.phagetransprotein.length !== 0">
            <transprotein />
        </div>
    </div>

    <el-dialog v-model="proteinVisible" title="Protein Detail" width="90%">
        <proteindetail v-model:proteinInfo="proteinInfo" v-model:dataset="datasets" />
    </el-dialog>
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
// import { NButton, NTag } from 'naive-ui'
// import _ from 'lodash'
import { reactive, ref } from 'vue'
// import { datasetList } from '@/utils/phage'
import proteindetail from '../protein/detail.vue'
// import annotation from '../../visualize/components/annotation.vue'
// import circo from '../../visualize/components/circo.vue'
// import terminator from '../phage/terminator.vue'
// import anti from '../phage/anti.vue'
// import crispr from '../phage/crispr.vue'
// import trna from '../phage/trna.vue'
// import transprotein from '../phage/transprotein.vue'
// import arvf from '../phage/arvf.vue'
import { usePhageStore } from '@/store/phage'
// import { useVisualizeStore } from '@/store/visualize'
// const visualizeStore = useVisualizeStore()

const phageStore = usePhageStore()
const loaddata = ref(false)
// const annoshow = ref(true)
// const showswicth = () => {
//     annoshow.value = !annoshow.value
// }
const route = useRoute()
// const phageid = computed(() => route.query?.phageid as number)
const phageid = computed(() => route.query?.crustdb_main_id as number)
const repeatuid = computed(() => route.query?.details_uid as string)

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

const proteinVisible = ref(false)
// const proteindata = ref([] as any[])
const proteinInfo = ref()
const datasets = ref('')

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
        console.log(data_uid) // Stage44.CP_1XOH
        selectRepeatCheckList.value.length = 0 // clear the checkList
        // window.open(`/api/database/crustdb_main/detail?id=${phageid.value}`, '_blank')
        const response2 = await axios.get(`/details`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                details_uid: data_uid, // details.repeat_data_uid
            },
        })
        // console.log('=============================== response2')
        // console.log(response2)
        detailsdata.value = response2.data
        selectRepeatDialogVisible.value = false
    }
}

const updateRepeatList = () => {
    repeat_data_uid_list.value.length = 0
    for (let i = 0; i < phagedata.value.repeat_data_uid_list.length; i += 1) {
        repeat_data_uid_list.value.push(
            `${phagedata.value.uniq_data_uid}_${phagedata.value.repeat_data_uid_list[i]}`
        )
    }
}

const download = () => {
    updateRepeatList()
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [phageid.value]
}

const selectRepeat = () => {
    updateRepeatList()
    selectRepeatDialogVisible.value = true
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
        // alert(phagedata.value.uniq_data_uid)
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
    // alert(detailsdata.value)

    phageStore.phageaccid = data.Acession_ID
    // const response2 = await axios.get(`/proteins`, {
    //     baseURL: '/api',
    //     timeout: 10000,
    //     params: {
    //         phageid: phageid.value,
    //     },
    // })
    // const prodata = response2.data
    // proteindata.value = prodata
    // phageStore.phageprotein = prodata
    loaddata.value = false

    // const response3 = await axios.get(`phage/fasta/`, {
    //     baseURL: '/api',
    //     timeout: 10000,
    //     params: {
    //         phageid: phageid.value,
    //     },
    // })

    phageStore.phagefastadata = response3.data
    // phageStore.phagedataloaded = true
})

// const phagedetail = computed(() => phagedata.value)

// const proteinList = computed(() => proteindata.value)
// const genes = computed(() => {
//     return proteinList.value.length
// })

// const formatLengthNumber = num => {
//     return num
// if (num >= 1000000) {
//     return `${(num / 1000000).toFixed(0)}, ${((num / 1000).toFixed(0) % 1000)
//         .toString()
//         .padStart(3, '0')}, ${(num % 1000).toString().padStart(3, '0')}`
// }
// if (num >= 1000) {
//     return `${(num / 1000).toFixed(0)}, ${(num % 1000).toString().padStart(3, '0')}`
// }
// return num.toString()
// }
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
// type RowData = {
//     id: number
//     Phage_Acession_ID: string
//     protein_id: string
//     annotate_Source: string
//     protein_product: string
//     protein_sort_class: string
//     start_point: string
//     end_point: string
//     strand: string
// }
// const rowKey = (row: RowData) => {
//     return row.id
// }
// const createColumns = (): DataTableColumns<RowData> => [
//     {
//         type: 'selection',
//     },
//     {
//         title: 'Protein ID',
//         key: 'Protein_id',
//         align: 'center',
//         width: '150',
//     },
//     {
//         title: 'Source',
//         key: 'Source',
//         align: 'center',
//         width: '120px',
//     },
//     {
//         title: 'Function classification',
//         key: 'Protein_function_classification',
//         align: 'center',
//         width: '250px',
//         filterOptions: [
//             {
//                 label: 'hypothetical',
//                 value: 'hypothetical',
//             },
//             {
//                 label: 'infection',
//                 value: 'infection',
//             },
//             {
//                 label: 'assembly',
//                 value: 'assembly',
//             },
//             {
//                 label: 'unsorted',
//                 value: 'unsorted',
//             },
//             {
//                 label: 'replication',
//                 value: 'replication',
//             },
//             {
//                 label: 'packaging',
//                 value: 'packaging',
//             },
//             {
//                 label: 'lysis',
//                 value: 'lysis',
//             },
//             {
//                 label: 'regulation',
//                 value: 'regulation',
//             },
//             {
//                 label: 'immune',
//                 value: 'immune',
//             },
//             {
//                 label: 'integration',
//                 value: 'integration',
//             },
//             {
//                 label: 'tRNA',
//                 value: 'tRNA',
//             },
//             {
//                 label: 'mix',
//                 value: 'mix',
//             },
//         ],
//         filter(value: any, row: any) {
//             return row.Protein_function_classification.includes(value)
//         },
//         render(row: any) {
//             const tagnode = []
//             const classlist = row.Protein_function_classification.split(';').slice(
//                 0,
//                 -1
//             ) as string[]
//             classlist.forEach((item, index) => {
//                 tagnode.push(
//                     h(
//                         NTag,
//                         {
//                             size: 'small',
//                             type: 'info',
//                         },
//                         {
//                             default: () => {
//                                 return classlist[index]
//                             },
//                         }
//                     )
//                 )
//             })
//             return h(
//                 'div',
//                 { style: { width: '250px', display: 'flex', justifyContent: 'space-around' } },
//                 tagnode
//             )
//         },
//     },
//     {
//         title: 'Protein Product',
//         key: 'Protein_product',
//         align: 'center',
//         width: '250px',
//         ellipsis: {
//             tooltip: true,
//         },
//     },
//     {
//         title: 'Start Point',
//         key: 'Start_location',
//         align: 'center',
//         width: '120px',
//         sorter: 'default',
//     },
//     {
//         title: 'End Point',
//         key: 'Stop_location',
//         align: 'center',
//         width: '120px',
//         sorter: 'default',
//     },
//     {
//         title: 'Strand',
//         key: 'Strand',
//         width: '90px',
//         align: 'center',
//     },
//     {
//         title: 'Action',
//         key: 'actions',
//         width: 100,
//         align: 'center',
//         render(row) {
//             return h(
//                 'div',
//                 {
//                     style: {
//                         display: 'flex',
//                         justifyContent: 'center',
//                     },
//                 },
//                 [
//                     h(
//                         NButton,
//                         {
//                             strong: true,
//                             tertiary: true,
//                             size: 'small',
//                             type: 'info',
//                             onClick: () => {
//                                 proteinInfo.value = row
//                                 proteinVisible.value = true
//                             },
//                         },
//                         { default: () => 'Detail' }
//                     ),
//                 ]
//             )
//         },
//     },
// ]
// const columns = createColumns()
// const complete = (comp: any) => {
//     if (comp === 'Medium-quality') {
//         return 'info'
//     }
//     if (comp === 'High-quality') {
//         return 'success'
//     }
//     if (comp === 'Low-quality') {
//         return 'warning'
//     }
//     if (comp === 'Complete') {
//         return 'success'
//     }
//     return 'warning'
// }
// const lifestyleColor = (style: any) => {
//     if (style === 'virulent') {
//         return 'error'
//     }
//     return 'info'
// }
// const downloadtsv = () => {
//     console.log(proteinList.value)
//     if (proteinList.value.length !== 0) {
//         const headers = _.keys(proteinList.value[0])
//         const formattedData = [headers]
//         proteinList.value.forEach(item => {
//             const row = _.values(item)
//             formattedData.push(row)
//         })
//         const tsvContent = formattedData.map(row => row.join('\t')).join('\n')
//         const blob = new Blob([tsvContent], { type: 'text/tab-separated-values' })
//         const url = URL.createObjectURL(blob)
//         const link = document.createElement('a')
//         link.href = url
//         link.download = 'gene_annotation.tsv'
//         link.style.display = 'none'
//         document.body.appendChild(link)
//         link.click()
//         URL.revokeObjectURL(url)
//         document.body.removeChild(link)
//     }
// }
// const gohost = () => {
//     router.push({
//         path: `/database/host/list`,
//         query: {
//             rank: 'host',
//             node: phagedetail.value.host,
//         },
//     })
// }
</script>
