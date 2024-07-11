<template>
    <div class="flex flex-col py-5 px-20">
        <!-- main table -->
        <div class="flex flex-col mx-1/10 justify-start">
            <div class="w-300 mt-18 ml-10">
                <div class="flex flex-row w-350 border-b-2 border-gray-300">
                    <div class="text-4xl font-500 mb-8">Slice Information</div>
                </div>
                <!-- here to change the size of canvas -->
                <el-descriptions
                    class="w-330 text-xl mt-8"
                    :column="2"
                    size="large"
                    border
                    v-loading="loaddata"
                >
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">ST Platform</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].st_platform }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">Species</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].species }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">Disease Stage</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].disease_stage }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">Developmental Stage</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].developmental_stage }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">Sex</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].sex }}
                    </el-descriptions-item>
                    <el-descriptions-item :width="165">
                        <template #label>
                            <div class="cell-item">Publication Title</div>
                        </template>
                        {{ detailsdata[0] && detailsdata[0].publication_title }}
                    </el-descriptions-item>
                </el-descriptions>
                <!-- <el-scrollbar style="box-shadow: 0 0 64px #cfd5db" class="h-200 w-300">
                        <div id="myEcharts" ref="echartlineDom"></div>
                    </el-scrollbar> -->
            </div>

            <div class="w-300 mt-18 ml-10">
                <div class="flex flex-row w-350 border-b-2 border-gray-300">
                    <div class="text-4xl font-500 mb-8">Slice Visualization</div>
                </div>
                <div class="flex flex-row">
                    <!-- here to change the size of canvas -->
                    <div class="w-300 mb-10 mt-7 p-5 ml-5" style="box-shadow: 0 0 64px #cfd5db">
                        <div id="myEcharts" class="w-280 h-190" ref="echartlineDom"></div>
                    </div>
                    <!-- <el-scrollbar style="box-shadow: 0 0 64px #cfd5db" class="h-200 w-300">
                        <div id="myEcharts" ref="echartlineDom"></div>
                    </el-scrollbar> -->
                </div>
            </div>
            <!-- <div class="w-330 mt-20">
                <div class="flex flex-row w-200">
                    <div class="text-4xl font-500 mb-8">Comparative Tree for the Cluster</div>
                </div>
                <el-scrollbar style="box-shadow: 0 0 64px #cfd5db" class="h-200 w-300">
                    <div id="myEcharts" class="h-140" ref="echartlineDom"></div>
                </el-scrollbar>
            </div> -->
            <div class="w-330 mt-15 ml-10">
                <div class="flex flex-row w-350 border-b-2 border-gray-300">
                    <div class="text-4xl font-500 mb-8">Conformations</div>
                </div>
                <!-- :pagination="pagination" -->
                <div class="w-350" v-loading="loading">
                    <n-data-table
                        :data="phageList"
                        :columns="columns"
                        :max-height="700"
                        :row-key="rowKey"
                        :scroll-x="2800"
                        @update:checked-row-keys="handleCheck"
                        @update:filters="handleUpdateFilter"
                        @update:sorter="handleSorterChange"
                    />
                </div>
            </div>
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
import * as echarts from 'echarts'
import { celltypeDict, sexDict, devDict } from '@/utils/crustdb'

const pagevalue = ref(1)
const pageSize = ref(30)
const datasets = ref('crustdb_main')
const crust_num = ref()
const loading = ref(false)
const loaddata = ref(false)
const searchinput = ref('')

// const phagedata = useRequest(() => phageService.getPhageList(pagevalue.value, pageSize.value)).data
const phagedata = ref()
const adata = ref()

const crusturl = ref(`/crustdb_main/slice/`)
const route = useRoute()
const sliceid = computed(() => route.query?.id as number)

const filter_dict = ref('')
const sorter_dict = ref('')

const option = ref({})
const uniqueAnnotations = ref([])

const detailsdata = ref({
    st_platform: '',
    species: '',
    disease_stage: '',
    developmental_stage: '',
    sex: '',
    slice_id: '',
    publication_title: '',
    n_cell_types: 0,
    n_conformations: 0,
    n_cells: 0,
})

let mylineEcharts

const visSymbolSize = (n_spots: number) => {
    if (n_spots > 20000) return 2
    if (n_spots > 10000) return 3
    if (n_spots > 7000) return 4
    if (n_spots > 3000) return 7
    return 12
}

const top_gap = (n_annotations: number) => {
    if (n_annotations < 20) return '90%'
    if (n_annotations < 29) return '85%'
    if (n_annotations < 34) return '80%'
    return '75%'
}

const preprocess_scatter = () => {
    uniqueAnnotations.value = Array.from(new Set(adata.value.annotation))
    const seriesData = uniqueAnnotations.value.map((annotation, index) => {
        const filteredData = adata.value.x.reduce((result, xValue, i) => {
            if (adata.value.annotation[i] === annotation) {
                result.push([xValue, adata.value.y[i]])
            }
            return result
        }, [])
        return {
            name: annotation,
            type: 'scatter',
            symbolSize: visSymbolSize(adata.value.x.length),
            data: filteredData,
            emphasis: {
                focus: 'series',
            },
            itemStyle: {
                color: `hsl(${index * (360 / uniqueAnnotations.value.length)}, 70%, 50%)`,
            },
        }
    })

    option.value = {
        title: {
            text: `${phagedata.value.results[0].slice_id}`,
            left: 'center',
        },
        tooltip: {
            show: true,
            formatter(param) {
                return `${param.seriesName}<br/>(${param.data[0]}, ${param.data[1]})` // Thhs is the standarized coordinates instead of the ones in the adata / mets.csv
            },
        },
        toolbox: {
            itemSize: 20,
            iconStyle: {
                borderColor: '#34498e',
            },
            feature: {
                saveAsImage: {},
            },
        },
        xAxis: {
            splitLine: { show: false },
            show: false,
        },
        yAxis: {
            splitLine: { show: false },
            show: false,
        },
        legend: {
            left: '10%',
            top: top_gap(uniqueAnnotations.value.length),
            // orient: 'horizontal',
            data: uniqueAnnotations.value,
        },
        series: seriesData,
    }
}

const chartOption = () => {
    mylineEcharts.setOption(option.value)
}

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
            slice_id: sliceid.value,
        },
    })
    const { data } = response
    phagedata.value = data
    crust_num.value = phagedata.value.count
    loading.value = false

    loaddata.value = true
    const response1 = await axios.get('/slice/', {
        baseURL: '/api',
        timeout: 100000,
        params: {
            slice_id: sliceid.value,
        },
    })
    detailsdata.value = response1.data.results
    loaddata.value = false

    const response2 = await axios.get('/slice/adata/', {
        baseURL: '/api',
        timeout: 100000,
        params: {
            slice_id: sliceid.value,
        },
    })
    adata.value = response2.data

    preprocess_scatter()
})

const echartlineDom = ref<HTMLElement | null>(null)

onMounted(async () => {
    mylineEcharts = echarts.init(echartlineDom.value as HTMLElement)
    chartOption()
})

watch(adata, () => {
    chartOption()
})

const phageList = computed(() => {
    return _.map(phagedata.value?.results, (row: any) => {
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
// Color: info, success, warning, error
const SpeciesColor = (style: any) => {
    if (style === 'Ambystoma mexicanum (Axolotl)') {
        return 'success'
    }
    if (style === 'Homo sapiens (Human)') {
        return 'info'
    }
    return 'warning'
}
const STPlatformColor = (style: any) => {
    if (style === 'Stereo-seq') {
        return 'success'
    }
    if (style === 'CosMx') {
        return 'info'
    }
    return 'warning' // MERFISH
}
const DiseaseStageColor = (style: any) => {
    if (style === 'Normal') {
        return 'info'
    }
    return 'error'
}

const col_width = {
    // total 2500
    publication_doi: 170,
    st_platform: 120,
    species: 220,
    disease_stage: 180,
    developmental_stage: 150,
    sex: 70,
    cell_type: 130,
    slice_id: 320,
    conformations: 110,
    cell_num: 105,
    gene_num: 105,
    inferred_trans_center_num: 180,
    actions: 130,
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        // {
        //     type: 'selection',
        // },
        // publication_doi
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Publication DOI' }),
                    'publication doi'
                )
            },
            fixed: 'left',
            // key: 'publication_doi',
            key: 'doi',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.publication_doi,
        },
        // st_platform
        {
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
        {
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
        {
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
            width: col_width.developmental_stage,
            filterOptions: devDict,
            // filter(value: any, row: any) {
            //     return row.developmental_stage === value
            // },
            filter: true,
        },
        // sex
        {
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
        // cell_type
        {
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
            width: col_width.slice_id,
        },
        // conformations
        {
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
            // sorter: 'default',
            sorter: true,
            // sortOrder: false,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.cell_num,
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
            // sorter: 'default',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.gene_num,
        },
        // inferred_trans_center_num
        {
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
        {
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
