<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Publication Details</div>
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
                        <div class="cell-item">Publication DOI</div>
                    </template>
                    {{ datasetdata.doi }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Journal</div>
                    </template>
                    {{ datasetdata.journal }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" span="2">
                    <template #label>
                        <div class="cell-item">Title</div>
                    </template>
                    {{ datasetdata.title }}
                </el-descriptions-item>
                <el-descriptions-item :width="165" span="2">
                    <template #label>
                        <div class="cell-item">Abstract</div>
                    </template>
                    {{ datasetdata.abstract }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Author</div>
                    </template>
                    {{ datasetdata.author }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Volume</div>
                    </template>
                    {{ datasetdata.volume }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Number</div>
                    </template>
                    {{ datasetdata.number }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Pages</div>
                    </template>
                    {{ datasetdata.pages }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Year</div>
                    </template>
                    {{ datasetdata.year }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Publisher</div>
                    </template>
                    {{ datasetdata.publisher }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Conformations</div>
            </div>
            <div class="w-350" v-loading="loaddata">
                <n-data-table
                    :data="crustList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="700"
                    :row-key="rowKey"
                    :scroll-x="2600"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import axios from 'axios'
import { reactive, ref } from 'vue'
// import { useCrustDBStore } from '@/store/crustdb'
import { NButton, NTag, NTooltip } from 'naive-ui'
import { celltypeDict, sexDict, devDict } from '@/utils/crustdb'

// const crustdbStore = useCrustDBStore()
const loaddata = ref(false)
const route = useRoute()
const datasetid = computed(() => route.query?.id as number)

const datasetdata = ref({
    st_platform: '',
    species: '',
    disease_stage: '',
    developmental_stage: '',
    sex: '',
    cell_type: '',
    cell_num: 0,
    gene_num: 0,
    uniq_data_uid: '',
    slice_name: '',
    repeat_data_uid_list: [],
})

const crustdata = ref([] as any[])

onBeforeMount(async () => {
    // From table Dataset Details
    loaddata.value = true
    const response = await axios.get(`dataset/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: datasetid.value,
        },
    })
    const { data } = response
    datasetdata.value = data

    // From conformations
    const response2 = await axios.get(`crustdb_main/dataset/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            doi: datasetdata.value.doi,
        },
    })
    crustdata.value = response2.data
    loaddata.value = false
})

const crustList = computed(() => crustdata.value)

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

const router = useRouter()
const detail = (row: any) => {
    // router.push({ path: '/database/phage/detail', query: { phageid: row.id } })
    router.push({
        path: '/database/crustdb_main/detail',
        query: { crustdb_main_id: row.id, details_uid: '' },
    })
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
    if (style === 'Stereo-Seq') {
        return 'success'
    }
    if (style === 'CosMx') {
        return 'info'
    }
    return 'warning' // Merfish
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
    actions: 130,
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        {
            type: 'selection',
        },
        // for test
        // {
        //     title() {
        //         return renderTooltip(h('div', null, { default: () => 'UID' }), 'uid')
        //     },
        //     key: 'uniq_data_uid',
        //     align: 'center',
        //     ellipsis: {
        //         tooltip: true,
        //     },
        //     width: 120,
        // },
        // {
        //     title() {
        //         return renderTooltip(h('div', null, { default: () => 'UID' }), 'uid')
        //     },
        //     key: 'repeat_data_uid_list',
        //     align: 'center',
        //     ellipsis: {
        //         tooltip: true,
        //     },
        //     width: 70,
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
                    label: 'Stereo-Seq',
                    value: 'Stereo-Seq',
                },
                {
                    label: 'CosMx',
                    value: 'CosMx',
                },
                {
                    label: 'Merfish',
                    value: 'Merfish',
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
</script>
