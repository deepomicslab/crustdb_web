<template>
    <div class="flex flex-col py-5 px-20">
        <!-- main table -->
        <!-- <div class="flex flex-col mx-1/10 justify-start"> -->
        <!-- <div class="w-300 mt-18 ml-10">
                <div class="flex flex-row w-350 border-b-2 border-gray-300">
                    <div class="text-4xl font-500 mb-8">Slice Visualization</div>
                </div>
                <div class="flex flex-row">
                    <div class="w-300 mb-10 mt-7 p-5 ml-5" style="box-shadow: 0 0 64px #cfd5db">
                        <div id="myEcharts" class="w-280 h-190" ref="echartlineDom"></div>
                    </div>
                </div>
            </div> -->
        <!-- Cell Type Informatin table -->

        <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Cell Type Information</div>
            </div>
            <el-descriptions
                class="w-330 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loading"
            >
                <el-descriptions-item :width="165" v-if="common_items.includes('cell_type')">
                    <template #label>
                        <div class="cell-item">Cell Type</div>
                    </template>
                    <!-- {{ common_item_values && common_item_values.cell_type }} -->
                    {{ common_item_values.cell_type }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('cell_num')">
                    <template #label>
                        <div class="cell-item">Total Cell Number</div>
                    </template>
                    {{ common_item_values.cell_num }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('slice_id')">
                    <template #label>
                        <div class="cell-item">Slice ID</div>
                    </template>
                    {{ common_item_values.slice_id }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('conformation_num')">
                    <template #label>
                        <div class="cell-item">Total Conformation Number</div>
                    </template>
                    {{ common_item_values.conformation_num }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('doi')">
                    <template #label>
                        <div class="cell-item">Publication DOI</div>
                    </template>
                    {{ common_item_values.doi }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('st_platform')">
                    <template #label>
                        <div class="cell-item">ST Platform</div>
                    </template>
                    {{ common_item_values.st_platform }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('disease_stage')">
                    <template #label>
                        <div class="cell-item">Disease Stage</div>
                    </template>
                    {{ common_item_values.disease_stage }}
                </el-descriptions-item>
                <el-descriptions-item
                    :width="165"
                    v-if="common_items.includes('developmental_stage')"
                >
                    <template #label>
                        <div class="cell-item">Developmental Stage</div>
                    </template>
                    {{ common_item_values.developmental_stage }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('sex')">
                    <template #label>
                        <div class="cell-item">Sex</div>
                    </template>
                    {{ common_item_values.sex }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('species')">
                    <template #label>
                        <div class="cell-item">Species</div>
                    </template>
                    {{ common_item_values.species }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" v-if="common_items.includes('gene_num')">
                    <template #label>
                        <div class="cell-item">Total Gene Number</div>
                    </template>
                    {{ common_item_values.gene_num }}
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Slices</div>
            </div>
            <!-- :pagination="pagination" -->
            <div class="w-350" v-loading="loading">
                <n-data-table
                    :data="phageList"
                    :columns="columns"
                    :max-height="700"
                    :row-key="rowKey"
                    :scroll-x="2000"
                    @update:checked-row-keys="handleCheck"
                    @update:filters="handleUpdateFilter"
                    @update:sorter="handleSorterChange"
                />
            </div>
        </div>
        <!-- </div> -->

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
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { h } from 'vue'
// import { NButton, NTag, NEllipsis, NTooltip } from 'naive-ui'
import { NButton, NTag, NTooltip } from 'naive-ui'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import _ from 'lodash'
import axios from 'axios'
// import * as echarts from 'echarts'
import {
    celltypeDict,
    sexDict,
    devDict,
    SpeciesColor,
    STPlatformColor,
    DiseaseStageColor,
} from '@/utils/crustdb'

const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('crustdb_main')
const loading = ref(false)
const searchinput = ref('')

const phagedata = ref()

const crusturl = ref(`/crustdb_main/celltype/`)
const route = useRoute()
const sliceid = computed(() => route.query?.celltype as string)
const celltype = computed(() => route.query?.celltype as string)

const filter_dict = ref('')
const sorter_dict = ref('')

const common_items = ref([])
const uncommon_items = ref([])
const common_item_values = ref([])

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
            cell_type: celltype.value,
        },
    })
    const [data, data2, data3, data4] = response.data.results
    phagedata.value = data
    common_items.value = data2
    uncommon_items.value = data3
    common_item_values.value = data4
    loading.value = false

    // const response2 = await axios.get('/slice/adata/', {
    //     baseURL: '/api',
    //     timeout: 100000,
    //     params: {
    //         slice_id: sliceid.value,
    //     },
    // })
    // adata.value = response2.data

    // preprocess_scatter()
})

// onMounted(async () => {
//     mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
//     chartOption()
// })

const phageList = computed(() => {
    return _.map(phagedata.value, (row: any) => {
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
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
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
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
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
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
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
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const router = useRouter()

const detail = (row: any) => {
    router.push({
        path: '/database/crustdb_main/detail',
        query: { crustdb_main_id: row.id, details_uid: '' },
    })
}

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

type RowData = {
    publication_doi: string
    st_platform: string
    species: string
    disease_stage: string
    developmental_stage: string
    sex: string
    cell_type: string
    slice_id: string
    conformations: number
    cell_num: number
    gene_num: number
    actions: string
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

const col_width = {
    // total 2500
    cell_type: 130,
    cell_num: 105,
    slice_id: 320,
    conformations: 110,
    publication_doi: 170,
    st_platform: 120,
    species: 220,
    disease_stage: 180,
    developmental_stage: 150,
    sex: 70,
    gene_num: 105,
    inferred_trans_center_num: 180,
    actions: 130,
}

const createColumns = (): DataTableColumns<RowData> => {
    const to_return_createColumns = []
    const col_template = {
        // {
        //     type: 'selection',
        // },
        // cell_type
        cell_type: {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Cell Type' }), 'cell type')
            },
            key: 'cell_type',
            align: 'center',
            width: col_width.cell_type,
            filterOptions: celltypeDict,
            // filter(value: any, row: any) {
            //     return row.cell_type === value
            // },
            filter: true,
            render(row: any) {
                return h('div', [
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
        // cell_num
        cell_num: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Cell Number' }),
                    'cell number'
                )
            },
            key: 'cell_num',
            align: 'center',
            // sorter: 'default',
            sorter: true,
            // sortOrder: false,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.cell_num,
        },
        // slice_id
        slice_id: {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Slice ID' }), 'slice ID')
            },
            fixed: 'left',
            key: 'slice_id',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.slice_id,
        },
        // conformation_num
        conformation_num: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Conformations' }),
                    'conformations'
                )
            },
            key: 'conformation_num',
            align: 'center',
            // sorter: 'default',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.conformations,
        },
        // publication_doi
        doi: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Publication DOI' }),
                    'publication doi'
                )
            },
            // key: 'publication_doi',
            key: 'doi',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.publication_doi,
        },
        // st_platform
        st_platform: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'ST Platform' }),
                    'ST Platform'
                )
            },
            key: 'st_platform',
            align: 'center',
            width: col_width.st_platform,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Stereo-seq',
                    value: 'Stereo-seq',
                },
                {
                    label: 'CosMx',
                    value: 'CosMx',
                },
                {
                    label: 'MERFISH',
                    value: 'MERFISH',
                },
            ],
            // filter(value: any, row: any) {
            //     return row.st_platform === value
            // },
            filter: true,
            // filterOptionValues: [],
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: STPlatformColor(row.st_platform),
                            size: 'small',
                        },
                        {
                            default: () => row.st_platform,
                        }
                    ),
                ])
            },
        },
        // species
        species: {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Species' }), 'species')
            },
            key: 'species',
            align: 'center',
            width: col_width.species,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Homo sapiens (Human)',
                    value: 'Homo sapiens (Human)',
                },
                {
                    label: 'Ambystoma mexicanum (Axolotl)',
                    value: 'Ambystoma mexicanum (Axolotl)',
                },
            ],
            // filter(value: any, row: any) {
            //     return row.species === value
            // },
            filter: true,
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
        // disease_stage
        disease_stage: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Disease Stage' }),
                    'disease stage'
                )
            },
            key: 'disease_stage',
            align: 'center',
            width: col_width.disease_stage,
            ellipsis: {
                tooltip: true,
            },
            filterOptions: [
                {
                    label: 'Normal', //
                    value: 'Normal',
                },
                {
                    label: 'Non-Small Cell Lung Cancer IIB',
                    value: 'Non-Small Cell Lung Cancer IIB',
                },
                {
                    label: 'Non-Small Cell Lung Cancer IIIA',
                    value: 'Non-Small Cell Lung Cancer IIIA',
                },
            ],
            // filter(value: any, row: any) {
            //     return row.disease_stage === value
            // },
            filter: true,
            render(row: any) {
                return h('div', {}, [
                    h(
                        NTag,
                        {
                            type: DiseaseStageColor(row.disease_stage),
                            size: 'small',
                        },
                        {
                            default: () => row.disease_stage,
                        }
                    ),
                ])
            },
        },
        // developmental_stage
        developmental_stage: {
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
            width: col_width.developmental_stage,
            filterOptions: devDict,
            // filter(value: any, row: any) {
            //     return row.developmental_stage === value
            // },
            filter: true,
        },
        // sex
        sex: {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Sex' }), 'sex')
            },
            key: 'sex',
            align: 'center',
            width: col_width.sex,
            filterOptions: sexDict,
            // filter(value: any, row: any) {
            //     return row.sex === value
            // },
            filter: true,
        },
        // gene_num
        gene_num: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Gene Number' }),
                    'gene number'
                )
            },
            key: 'gene_num',
            align: 'center',
            // sorter: 'default',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.gene_num,
        },
        // inferred_trans_center_num
        inferred_trans_center_num: {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Transcription Center Number' }),
                    'Transcription Center Number'
                )
            },
            key: 'inferred_trans_center_num',
            align: 'center',
            // sorter: 'default',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.inferred_trans_center_num,
        },
        // slice_name
        // gene_filter_threshold
        // anchor_gene_proportion
        // inferred_trans_center_num
        // actions
        actions: {
            title: 'Action',
            key: 'actions',
            align: 'center',
            width: col_width.actions,
            fixed: 'right',
            render(row: any) {
                return h(
                    'div',
                    {
                        style: {
                            // display: 'flex',
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
                            { default: () => 'Conformation Detail' }
                        ),
                        // h(
                        //     NButton,
                        //     {
                        //         strong: true,
                        //         size: 'small',
                        //         type: 'primary',
                        //         onClick: () => download(row),
                        //     },
                        //     {
                        //         default: () => 'Download',
                        //     }
                        // ),
                    ]
                )
            },
        },
    }
    const potential_items = [
        'slice_id',
        'doi',
        'st_platform',
        'species',
        'disease_stage',
        'developmental_stage',
        'sex',
        'cell_type',
        'conformation_num',
        'cell_num',
        'gene_num',
        'inferred_trans_center_num',
    ]

    to_return_createColumns.push(col_template.slice_id)

    function myFunction(value) {
        if (value === 'slice_id') {
            return
        }
        if (uncommon_items.value.includes(value)) {
            to_return_createColumns.push(col_template[value])
        }
    }
    potential_items.forEach(myFunction)

    to_return_createColumns.push(col_template.actions)

    return to_return_createColumns
}

const columns = ref()
columns.value = createColumns()
watch(common_items, () => {
    columns.value = createColumns()
})

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

const handleSorterChange = async sorter => {
    sorter_dict.value = sorter
    searchinput.value = ''
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}

const handleUpdateFilter = async filters => {
    filter_dict.value = filters
    loading.value = true
    const response = await axios.get(crusturl.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            slice_id: sliceid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    phagedata.value = data
    loading.value = false
}
</script>

<style scoped>
:deep .n-data-table-th {
    text-align: center;
}

:deep .n-data-table-td {
    text-align: center;
}
</style>
