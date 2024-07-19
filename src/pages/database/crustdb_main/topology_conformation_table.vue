<template>
    <el-descriptions
        class="w-130 h-120 text-xl mt-8"
        :column="1"
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
                <div class="cell-item">Proportion of genes used for Rotation Derivation</div>
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
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { ref } from 'vue'

const props = defineProps<{
    detailsdata
}>()
const { detailsdata } = toRefs(props)

const loaddata = ref(false)
</script>
