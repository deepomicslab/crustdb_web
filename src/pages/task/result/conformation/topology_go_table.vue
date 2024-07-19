<template>
    <div class="w-350 mt-5 ml-15">
        <div class="flex flex-row">
            <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">GO vis info</h1>
        </div>
        <div class="mt-8">
            <n-data-table
                :data="goListVis"
                :columns="columns_vis"
                :pagination="pagination_vis"
                :max-height="700"
                :row-key="rowKeyVis"
                :scroll-x="1200"
            />
        </div>
        <div class="flex flex-row">
            <h1 class="text-3xl mt-5 ml-5 font-500 text-[#3262a8]">GO full info</h1>
        </div>
        <div class="mt-8">
            <n-data-table
                :data="goListFull"
                :columns="columns_full"
                :pagination="pagination_full"
                :max-height="700"
                :row-key="rowKeyFull"
                :scroll-x="2800"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
// import axios from 'axios'
import { reactive, toRefs } from 'vue'
import { NTooltip } from 'naive-ui'

const props = defineProps<{
    go_info
    go_original_info
}>()
const { go_info, go_original_info } = toRefs(props)

const goListVis = computed(() => {
    const thisgoListVis = []
    const Gene_set_list = Array.from(go_info.value.Gene_set)
    Gene_set_list.forEach((element, idx) => {
        thisgoListVis.push({
            Gene_set: element,
            Term: go_info.value.Term[idx],
            p_inv: go_info.value.p_inv[idx],
            Hits_ratio: go_info.value.Hits_ratio[idx],
        })
    })
    return thisgoListVis
})
const goListFull = computed(() => {
    const thisgoListFull = []
    const Gene_set_list = Array.from(go_original_info.value.Gene_set)
    // console.log('--------------------------------------Gene_set_list', Gene_set_list)
    Gene_set_list.forEach((element, idx) => {
        thisgoListFull.push({
            Gene_set: element,
            Term: go_original_info.value.Term[idx],
            Overlap: go_original_info.value.Overlap[idx],
            P_value: go_original_info.value.P_value[idx],
            Adjusted_P_value: go_original_info.value.Adjusted_P_value[idx],
            Old_P_value: go_original_info.value.Old_P_value[idx],
            Old_Adjusted_P_value: go_original_info.value.Old_Adjusted_P_value[idx],
            Odds_Ratio: go_original_info.value.Odds_Ratio[idx],
            Combined_Score: go_original_info.value.Combined_Score[idx],
            Genes: go_original_info.value.Genes[idx],
        })
    })
    return thisgoListFull
})

const pagination_vis = reactive({
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
const pagination_full = reactive({
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

const col_width_vis = {
    Gene_set: 80,
    Term: 200,
    p_inv: 60,
    Hits_ratio: 60,
}
const col_width_full = {
    Gene_set: 80,
    Term: 200,
    Overlap: 60,
    P_value: 60,
    Adjusted_P_value: 60,
    Old_P_value: 60,
    Old_Adjusted_P_value: 60,
    Odds_Ratio: 60,
    Combined_Score: 60,
    Genes: 100,
}

type RowDataVis = {
    Gene_set: string
    Term: string
    p_inv: string
    Hits_ratio: string
}
type RowDataFull = {
    Gene_set: string
    Term: string
    Overlap: string
    P_value: string
    Adjusted_P_value: string
    Old_P_value: string
    Old_Adjusted_P_value: string
    Odds_Ratio: string
    Combined_Score: string
    Genes: string
}

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const rowKeyVis = (row: RowDataVis) => {
    return row.id
}
const rowKeyFull = (row: RowDataFull) => {
    return row.id
}

const createColumnsVis = (): DataTableColumns<RowDataVis> => {
    return [
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Term' }), 'Term')
            },
            key: 'Term',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_vis.Term,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Gene Set' }), 'Gene Set')
            },
            key: 'Gene_set',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_vis.Gene_set,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'p_inv' }), 'p_inv')
            },
            key: 'p_inv',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_vis.p_inv,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Hits_ratio' }), 'Hits_ratio')
            },
            key: 'Hits_ratio',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_vis.Hits_ratio,
        },
    ]
}
const createColumnsFull = (): DataTableColumns<RowDataFull> => {
    return [
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Term' }), 'Term')
            },
            key: 'Term',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Term,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Gene Set' }), 'Gene Set')
            },
            key: 'Gene_set',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Gene_set,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Overlap' }), 'Overlap')
            },
            key: 'Overlap',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Overlap,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'P_value' }), 'P_value')
            },
            key: 'P_value',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.P_value,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Adjusted_P_value' }),
                    'Adjusted_P_value'
                )
            },
            key: 'Adjusted_P_value',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Adjusted_P_value,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Old_P_value' }),
                    'Old_P_value'
                )
            },
            key: 'Old_P_value',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Old_P_value,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Old_Adjusted_P_value' }),
                    'Old_Adjusted_P_value'
                )
            },
            key: 'Old_Adjusted_P_value',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Old_Adjusted_P_value,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Odds_Ratio' }), 'Odds_Ratio')
            },
            key: 'Odds_Ratio',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Odds_Ratio,
        },
        {
            title() {
                return renderTooltip(
                    h('div', null, { default: () => 'Combined_Score' }),
                    'Combined_Score'
                )
            },
            key: 'Combined_Score',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Combined_Score,
        },
        {
            title() {
                return renderTooltip(h('div', null, { default: () => 'Genes' }), 'Genes')
            },
            key: 'Genes',
            align: 'center',
            sorter: true,
            ellipsis: {
                tooltip: true,
            },
            width: col_width_full.Genes,
        },
    ]
}

const columns_vis = createColumnsVis()
const columns_full = createColumnsFull()
</script>
