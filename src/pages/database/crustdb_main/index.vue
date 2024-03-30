<template>
    <div class="flex flex-col py-5 px-20">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">CyGraph Samples</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4 items-center">
            <div class="mt-1.5 ml-1 felx flex-row justify-start items-center">
                <div>
                    <el-button class="mb-1" @click="gofilter">
                        <n-icon class="mr-2">
                            <FunnelOutline />
                        </n-icon>
                        Record Filter
                    </el-button>

                    <el-dropdown class="mx-4">
                        <el-button>
                            <template #icon>
                                <n-icon>
                                    <downicon />
                                </n-icon>
                            </template>
                            Download Data
                            <el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="downloadall" v-if="false">
                                    All Data
                                </el-dropdown-item>
                                <el-dropdown-item @click="downloadselected">
                                    Selected Data
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>

            <div class="flex flex-row justify-start">
                <div class="mt-2 text-lg">
                    <el-tooltip
                        effect="dark"
                        content="Fuzzy string search on columns (ST Platform, Species, Disease Stage, Developmental Stage, Sex, Cell Type, Slice ID)"
                        placement="top"
                        class="mt-4"
                    >
                        <el-icon class="text-base text-[#34498E]">
                            <InfoFilled />
                        </el-icon>
                    </el-tooltip>
                    Search:
                </div>
                <el-input class="w-50 ml-3" size="small" v-model="searchinput">
                    <template #append>
                        <el-button :icon="Search" @click="filtersearch" />
                    </template>
                </el-input>
                <el-button class="mt-1 ml-2" :icon="RefreshRight" circle @click="resetsearch" />
            </div>
        </div>

        <!-- navigation bar with anchor -->
        <!-- Filtering, by ST_platform -->
        <div class="flex flex-row justify-between">
            <el-menu
                :default-active="datasets"
                class="el-menu-demo h-14 mt-2 w-77/100"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="crustdb_main" class="text-lg">All</el-menu-item>
                <el-menu-item index="crustdb_stereo" class="text-lg">Stereo-Seq</el-menu-item>
                <el-menu-item index="crustdb_cosmx" class="text-lg">CosMx</el-menu-item>
                <el-menu-item index="crustdb_merfish" class="text-lg">Merfish</el-menu-item>
            </el-menu>
            <div class="flex flex-row mt-7 text-[16px] font-400">
                <div># CyGraph samples</div>
                <div class="ml-5">{{ crust_num }}</div>
            </div>
        </div>

        <!-- main table -->
        <div v-loading="loading" class="h-420">
            <n-data-table
                :columns="columns"
                :data="phageList"
                :row-key="rowKey"
                :scroll-x="1900"
                :max-height="1600"
                @update:checked-row-keys="handleCheck"
                @update:filters="handleUpdateFilter"
            />
        </div>

        <!-- change page button -->
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-20"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="30"
                :page-sizes="[30, 50, 100]"
                show-quick-jumper
                :item-count="count"
                @update:page="pagechange"
                @update:page-size="pagesizechange"
            >
                <template #prev>
                    <n-button @click="prevPage" v-bind:disabled="pagevalue === 1" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronBack />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronForward />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>

    <el-dialog
        v-model="downloaddialogVisible"
        title="Select download data"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <!-- <el-checkbox label="Download FASTA Data" /> -->
                <!-- <el-checkbox label="Download GBK Data" /> -->
                <!-- <el-checkbox label="Download ADATA" />
                <el-checkbox label="Download Zip Data" /> -->
                <!-- <el-checkbox
                    v-for="(v, idx) in downloadDataName"
                    :key="v"
                    :label="'(Repeat #' + (idx + 1) + ') Download ' + v + '.zip'"
                /> -->
                <el-checkbox
                    v-for="v in downloadDataName"
                    :key="v"
                    :label="'Download ' + v + '.zip'"
                />
                <!-- <el-checkbox label="Download Meta Data" /> -->
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloaddialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="filterVisible" width="70%" height="80%" align-center>
        <div class="h-180">
            <filterview />
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { h } from 'vue'
// import { NButton, NTag, NEllipsis, NTooltip } from 'naive-ui'
import { NButton, NTag, NTooltip } from 'naive-ui'
import {
    FunnelOutline,
    ChevronBack,
    ChevronForward,
    CloudDownloadOutline as downicon,
} from '@vicons/ionicons5'
// import { Search, RefreshRight, ArrowDown, InfoFilled, Switch } from '@element-plus/icons-vue'
import { Search, RefreshRight, ArrowDown, InfoFilled } from '@element-plus/icons-vue'
import _ from 'lodash'
import axios from 'axios'
import filterview from '../filter/index.vue'
// import { datasetDict, datasetList } from '@/utils/phage'
// import { celltypeDict } from '@/utils/phage'
import { celltypeDict, sexDict, devDict } from '@/utils/crustdb'

const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('crustdb_main')
const crust_num = ref()
const loading = ref(false)
const searchinput = ref('')

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data
const phagedata = ref()

const crusturl = ref(`/crustdb_main/`)
const route = useRoute()

onBeforeMount(async () => {
    if (route.query?.dataset) {
        datasets.value = route.query?.dataset as string
        crusturl.value = `/${route.query?.dataset}/`
    }
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    crust_num.value = phagedata.value.count
    loading.value = false
})

const phageList = computed(() => {
    return _.map(phagedata.value?.results, (row: any) => {
        // eslint-disable-next-line
        // row.gc_content = Number(parseFloat(row.gc_content).toFixed(2))
        return row
    })
})

const count = computed(() => phagedata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const prevPage = async () => {
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagechange = async () => {
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const router = useRouter()

const filterVisible = ref(false)

const gofilter = () => {
    filterVisible.value = true
}
const detail = (row: any) => {
    // router.push({ path: '/database/phage/detail', query: { phageid: row.id } })
    router.push({
        path: '/database/crustdb_main/detail',
        query: { crustdb_main_id: row.id, details_uid: '' },
    })
}

const downloaddialogVisible = ref(false)
const downloadtype = ref('')
const checkList = ref([] as any[])
const downloadDataName = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select one zip data to download', {
            closable: true,
            duration: 5000,
        })
    } else if (downloadtype.value === 'selected') {
        window.open(`/api/crustdb_main/zip/?crustids=${checkedRowKeysRef.value}`, '_blank')
    } else if (downloadtype.value === 'single') {
        window.open(
            `/api/crustdb_main/zip/?crustid=${checkedRowKeysRef.value[0]}&checkList=${checkList.value}`,
            '_blank'
        )
    } else if (downloadtype.value === 'all') {
        window.open(`/api/crustdb_main/zip/`, '_blank')
    }
    checkList.value.length = 0 // clear the checkList means clear the picked items 取消选中
}
const downloadselected = () => {
    if (checkedRowKeysRef.value.length === 0) {
        window.$message.warning('Please select data', {
            closable: true,
            duration: 5000,
        })
    } else {
        downloaddialogVisible.value = true
        downloadtype.value = 'selected'
        downloadDataName.value.length = 0
        downloadDataName.value.push('selected')
    }
}
const downloadall = () => {
    downloaddialogVisible.value = true
    downloadtype.value = 'all'
    downloadDataName.value.length = 0
    downloadDataName.value.push('all')
}
const download = (row: any) => {
    downloadtype.value = 'single'
    downloaddialogVisible.value = true
    checkedRowKeysRef.value = [row.id]
    downloadDataName.value.length = 0
    for (let i = 0; i < row.repeat_data_uid_list.length; i += 1) {
        downloadDataName.value.push(`${row.uniq_data_uid}_${row.repeat_data_uid_list[i]}`)
    }
}

type RowData = {
    data_uid: string
    cell_type: string
    slice_id: string
    ST_platform: string
    species: string
    developmental_stage: string
    disease_steps: string
    sex: string
    slice_name: string
    cell_num: number
    gene_num: number
    gene_filter_threshold: number
    anchor_gene_proportion: number
    inferred_trans_center_num: string
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}
const rowKey = (row: RowData) => {
    return row.id
}
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
const SpeciesColor = (style: any) => {
    if (style === 'Axolotl') {
        // wait to see how many colors needed
        return 'error'
    }
    return 'info'
}
const STPlatformColor = (style: any) => {
    if (style === 'Stereo-Seq') {
        return 'error'
    }
    return 'info'
}
const DiseaseStageColor = (style: any) => {
    if (style === 'Normal') {
        return 'info'
    }
    return 'error'
}

const filtersearch = async () => {
    loading.value = true
    crusturl.value = 'crustdb_main/search/'
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            search: searchinput.value,
        },
    })
    phagedata.value = response.data
    loading.value = false
}
const resetsearch = async () => {
    crusturl.value = '/crustdb_main/'
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            type: 'selection',
        },
        // ST_platform
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'ST Platform' }),
                    'ST Platform'
                )
            },
            key: 'ST_platform',
            align: 'center',
            width: 100,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Stereo-Seq',
                    value: 'Stereo-Seq',
                },
                {
                    label: 'Wait for other label',
                    value: 'Wait for other label',
                },
            ],
            filter(value: any, row: any) {
                return row.ST_platform === value
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: STPlatformColor(row.ST_platform),
                            size: 'small',
                        },
                        {
                            default: () => row.ST_platform,
                        }
                    ),
                ])
            },
        },
        // species
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Species' }), 'species')
            },
            key: 'species',
            align: 'center',
            width: 170,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Axolotl',
                    value: 'Axolotl',
                },
                {
                    label: 'Not Axolotl',
                    value: 'Not_Axolotl',
                },
            ],
            filter(value: any, row: any) {
                return row.species === value
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: SpeciesColor(row.species),
                            size: 'small',
                        },
                        {
                            default: () => row.species,
                        }
                    ),
                ])
            },
        },
        // disease_steps
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Disease Stage' }),
                    'disease stage'
                )
            },
            key: 'disease_steps',
            align: 'center',
            width: 110,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'wait for other label', //
                    value: 'wait for other label',
                },
                {
                    label: 'Normal',
                    value: 'Normal',
                },
            ],
            filter(value: any, row: any) {
                return row.disease_steps === value
            },
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: DiseaseStageColor(row.disease_steps),
                            size: 'small',
                        },
                        {
                            default: () => row.disease_steps,
                        }
                    ),
                ])
            },
        },
        // developmental_stage
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Developmental Stage' }),
                    'developmental stage'
                )
            },
            key: 'developmental_stage',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 140,
            filterOptions: devDict,
            filter(value: any, row: any) {
                return row.developmental_stage === value
            },
        },
        // sex
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Sex' }), 'sex')
            },
            key: 'sex',
            align: 'center',
            width: 70,
            filterOptions: sexDict,
            filter(value: any, row: any) {
                return row.sex === value
            },
        },
        // cell_type
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Cell Type' }), 'cell type')
            },
            key: 'cell_type',
            align: 'center',
            width: 100,
            filterOptions: celltypeDict,
            filter(value: any, row: any) {
                return row.cell_type === value
            },
            render(row: any) {
                return h('div', { style: { width: '100px' } }, [
                    h(
                        NTag,
                        {
                            type: 'info',
                            size: 'small',
                            round: true,
                        },
                        {
                            default: () => {
                                return row.cell_type
                            },
                        }
                    ),
                ])
            },
        },
        // slice_id
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Slice ID' }), 'slice ID')
            },
            key: 'slice_id',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 260,
        },
        // cell_num
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Cell Number' }),
                    'cell number'
                )
            },
            key: 'cell_num',
            align: 'center',
            sorter: 'default',
            ellipsis: {
                tooltip: true,
            },
            width: 90,
        },
        // gene_num
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Gene Number' }),
                    'gene number'
                )
            },
            key: 'gene_num',
            align: 'center',
            sorter: 'default',
            ellipsis: {
                tooltip: true,
            },
            width: 100,
        },
        // slice_name
        // gene_filter_threshold
        // anchor_gene_proportion
        // inferred_trans_center_num
        // actions
        {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: 130,
            fixed: 'right',
            render(row: any) {
                return h(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                        },
                    },
                    [
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'info',
                                onClick: () => detail(row),
                            },
                            { default: () => 'Detail' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'primary',
                                onClick: () => download(row),
                            },
                            {
                                default: () => 'Download',
                            }
                        ),
                    ]
                )
            },
        },
    ]
}

const columns = createColumns()

const paginationReactive = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    showQuickJumper: true,
    onChange: (page: number) => {
        paginationReactive.page = page
    },
})
const handleSelectSet = async (value: any) => {
    crusturl.value = `/${value}/`

    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
