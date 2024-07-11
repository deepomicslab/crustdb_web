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
                <div class="text-4xl font-500 mb-8">Slices</div>
            </div>
            <div class="w-350" v-loading="loaddata">
                <n-data-table
                    :data="crustList"
                    :columns="columns"
                    :pagination="pagination"
                    :max-height="700"
                    :row-key="rowKey"
                    :scroll-x="2300"
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
import { SpeciesColor, STPlatformColor, DiseaseStageColor } from '@/utils/crustdb'

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

    // From Slice List
    const response2 = await axios.get(`/slice/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            doi: datasetdata.value.doi,
        },
    })

    crustdata.value = response2.data.results
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
    router.push({
        path: '/database/slice/detail',
        query: { id: row.id },
    })
}

const publication = (row: any) => {
    console.log(row)
    router.push({
        path: '/database/dataset/detail',
        query: { id: row.publication_id },
    })
}

type RowData = {
    n_slices: number
    n_cell_types: number
    n_conformations: number
    n_cells: number
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
    slice_id: 170,
    species: 140,
    st_platform: 100,
    disease_stage: 100,
    developmental_stage: 100,
    sex: 70,
    n_slices: 90,
    n_cell_types: 90,
    n_conformations: 90,
    n_cells: 90,
    actions: 140,
}

const createColumns = (): DataTableColumns<RowData> => {
    return [
        // id
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Slice ID' }), 'Slice ID')
            },
            key: 'slice_id',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.slice_id,
        },
        // species
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Species' }), 'Species')
            },
            key: 'species',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.species,
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
        // st_platform
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'ST Platform' }),
                    'st_platform'
                )
            },
            key: 'st_platform',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.st_platform,
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
        // disease_stage
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Disease Stage' }),
                    'disease_stage'
                )
            },
            key: 'disease_stage',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.disease_stage,
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
                    'developmental_stage'
                )
            },
            key: 'developmental_stage',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.developmental_stage,
        },
        // sex
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Sex' }), 'sex')
            },
            key: 'sex',
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: col_width.sex,
        },
        // n_cell_types
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Number of Cell Types' }),
                    'Number of Cell Types'
                )
            },
            key: 'n_cell_types',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_cell_types,
        },
        // n_conformations
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Number of Conformations' }),
                    'Number of Conformations'
                )
            },
            key: 'n_conformations',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_conformations,
        },
        // n_cells
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Total Number of Cells' }),
                    'Total Number of Cells'
                )
            },
            key: 'n_cells',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width.n_cells,
        },
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
                            { default: () => 'Slice Details' }
                        ),
                        h(
                            NButton,
                            {
                                strong: true,
                                size: 'small',
                                type: 'info',
                                onClick: () => publication(row),
                            },
                            { default: () => 'Publication Details' }
                        ),
                    ]
                )
            },
        },
    ]
}

const columns = createColumns()
</script>
