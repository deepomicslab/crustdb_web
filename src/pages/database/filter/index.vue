<template>
    <div class="h-full flex flex-col py-10 px-30 justify-start items-center">
        <div class="text-3xl text-gray-600">Record Filter</div>
        <div
            class="rounded w-280 h-150 mt-15 rounded-xl"
            style="box-shadow: 0 0 64px #cfd5db"
            v-loading="loading"
        >
            <div class="mt-25">
                <el-form status-icon label-width="auto" label-position="right">
                    <el-row justify="space-evenly">
                        <el-col :span="11">
                            <el-form-item label="ST Platform">
                                &nbsp;&nbsp;
                                <el-select
                                    v-model="filterform.st_platform"
                                    placeholder="Select ST Platform"
                                    class="w-60"
                                    clearable
                                >
                                    <el-option
                                        v-for="option in stPlatformDict"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Species">
                                &nbsp;&nbsp;
                                <el-select
                                    v-model="filterform.species"
                                    placeholder="Select species"
                                    multiple
                                    clearable
                                    class="w-60"
                                >
                                    <el-option
                                        v-for="option in speciesDict"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mt-4" justify="space-evenly">
                        <el-col :span="11">
                            <el-form-item label="Cell Type">
                                &nbsp;&nbsp;
                                <el-input
                                    v-model="filterform.celltype"
                                    class="w-60"
                                    placeholder="Input Cell Type"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Developmental Stage">
                                &nbsp;&nbsp;
                                <el-select
                                    v-model="filterform.dev_stage"
                                    placeholder="Select developmental stage"
                                    multiple
                                    clearable
                                    class="w-60"
                                >
                                    <el-option
                                        v-for="option in devDict"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mt-4" justify="space-evenly">
                        <el-col :span="11">
                            <el-form-item label="Disease Status">
                                &nbsp;&nbsp;
                                <el-select
                                    v-model="filterform.disease_stage"
                                    placeholder="Select disease status"
                                    class="w-60"
                                    clearable
                                >
                                    <el-option
                                        v-for="option in diseaseStageDict"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Conformation Number">
                                &nbsp;&nbsp;
                                <el-input
                                    v-model.number="filterform.conformation_num_min"
                                    class="w-25"
                                    type="number"
                                    min="0"
                                />
                                <div class="mx-3">
                                    <el-icon>
                                        <Minus />
                                    </el-icon>
                                </div>
                                <el-input
                                    v-model.number="filterform.conformation_num_max"
                                    class="w-26"
                                    type="number"
                                    min="0"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mt-4" justify="space-evenly">
                        <el-col :span="11">
                            <el-form-item label="Transcription Center Number">
                                &nbsp;&nbsp;
                                <el-input
                                    v-model.number="filterform.inferred_trans_center_num_min"
                                    class="w-25"
                                    type="number"
                                    min="0"
                                />
                                <div class="mx-3">
                                    <el-icon>
                                        <Minus />
                                    </el-icon>
                                </div>
                                <el-input
                                    v-model.number="filterform.inferred_trans_center_num_max"
                                    class="w-26"
                                    type="number"
                                    min="0"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Gene Number">
                                &nbsp;&nbsp;
                                <el-input
                                    v-model.number="filterform.gene_num_min"
                                    class="w-25"
                                    type="number"
                                    min="0"
                                />
                                <div class="mx-3">
                                    <el-icon>
                                        <Minus />
                                    </el-icon>
                                </div>
                                <el-input
                                    v-model.number="filterform.gene_num_max"
                                    class="w-26"
                                    type="number"
                                    min="0"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mt-4" justify="space-evenly">
                        <el-col :span="11">
                            <el-form-item label="Sex" class="ml-0">
                                &nbsp;&nbsp;
                                <el-radio-group v-model="filterform.sex" class="w-70">
                                    <el-radio label="Female" />
                                    <el-radio label="Male" />
                                    <el-radio label="all" />
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="Cell Number">
                                &nbsp;&nbsp;
                                <el-input
                                    v-model.number="filterform.cell_num_min"
                                    class="w-25"
                                    type="number"
                                    min="0"
                                />
                                <div class="mx-3">
                                    <el-icon>
                                        <Minus />
                                    </el-icon>
                                </div>
                                <el-input
                                    v-model.number="filterform.cell_num_max"
                                    class="w-26"
                                    type="number"
                                    min="0"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="mt-12">
                        <el-col :span="24" class="text-center">
                            <el-button type="primary" @click="submitFilter">Submit</el-button>
                            <el-button type="info" @click="resetFilterForm()">Reset</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="mt-4" justify="center">
                        <el-col :span="15">
                            <el-alert
                                v-if="showError"
                                v-model:title="alertTitle"
                                type="error"
                                center
                                show-icon
                            />
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { Minus } from '@element-plus/icons-vue'
import { stPlatformDict, diseaseStageDict, speciesDict, devDict } from '@/utils/crustdb'
import { useQueryStore } from '@/store/query'

const queryStore = useQueryStore()
const loading = ref(false)

const filterform = ref({
    st_platform: '',
    species: [],
    celltype: '',
    dev_stage: [],
    disease_stage: '',
    sex: 'all',
    gene_num_min: 0,
    gene_num_max: 25000,
    cell_num_min: 0,
    cell_num_max: 37000,
    conformation_num_min: 0,
    conformation_num_max: 5,
    inferred_trans_center_num_min: 0,
    inferred_trans_center_num_max: 9000,
})
const router = useRouter()
const showError = ref(false)
const alertTitle = ref('Please select/fill at least one filter')

const checkNumericField = (field: string | number, label: string) => {
    if (Number.isNaN(field)) {
        showError.value = true
        alertTitle.value = `${label}: please input a number`
        return false
    }
    if ((field as number) < 0) {
        showError.value = true
        alertTitle.value = `${label}: please input a positive number`
        return false
    }
    return true
}
const isAllNumericFieldValid = () => {
    if (checkNumericField(filterform.value.gene_num_max, 'Gene Number') === false) {
        return false
    }
    if (checkNumericField(filterform.value.gene_num_min, 'Gene Number') === false) {
        return false
    }
    if (filterform.value.gene_num_max < filterform.value.gene_num_min) {
        showError.value = true
        alertTitle.value = `Gene Number: start value should be smaller than end value`
        return false
    }
    if (checkNumericField(filterform.value.cell_num_max, 'Cell Number') === false) {
        return false
    }
    if (checkNumericField(filterform.value.cell_num_min, 'Cell Number') === false) {
        return false
    }
    if (filterform.value.cell_num_max < filterform.value.cell_num_min) {
        showError.value = true
        alertTitle.value = `Cell Number: start value should be smaller than end value`
        return false
    }
    if (checkNumericField(filterform.value.conformation_num_min, 'Conformation Number') === false) {
        return false
    }
    if (checkNumericField(filterform.value.conformation_num_max, 'Conformation Number') === false) {
        return false
    }
    if (filterform.value.conformation_num_max < filterform.value.conformation_num_min) {
        showError.value = true
        alertTitle.value = `Conformation Number: start value should be smaller than end value`
        return false
    }
    if (
        checkNumericField(
            filterform.value.inferred_trans_center_num_min,
            'Transcription Center Number'
        ) === false
    ) {
        return false
    }
    if (
        checkNumericField(
            filterform.value.inferred_trans_center_num_max,
            'Transcription Center Number'
        ) === false
    ) {
        return false
    }
    if (
        filterform.value.inferred_trans_center_num_max <
        filterform.value.inferred_trans_center_num_min
    ) {
        showError.value = true
        alertTitle.value = `Transcription Center Number: start value should be smaller than end value`
        return false
    }
    return true
}
const submitFilter = async () => {
    if (isAllNumericFieldValid() === false) {
        showError.value = true
    } else {
        loading.value = true
        queryStore.filterdata = JSON.stringify(filterform.value)
        router.push({
            path: `/database/filter/result`,
        })
    }

    loading.value = false
}
const resetFilterForm = () => {
    filterform.value = {
        st_platform: '',
        species: [],
        celltype: '',
        dev_stage: [],
        disease_stage: '',
        sex: 'all',
        gene_num_min: 0,
        gene_num_max: 25000,
        cell_num_min: 0,
        cell_num_max: 37000,
        conformation_num_min: 0,
        conformation_num_max: 5,
        inferred_trans_center_num_min: 0,
        inferred_trans_center_num_max: 9000,
    }
}
</script>

<style>
.el-icon.info-icon {
    color: #79bbff;
}

.el-form-item__label-wrap {
    margin-right: 0px !important;
}

.el-form-item__label {
    padding-right: 3px !important;
}

.el-row {
    position: relative;
}

.info-icon {
    margin-right: 32px;
}
</style>
