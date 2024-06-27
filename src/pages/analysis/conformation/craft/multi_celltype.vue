<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef">
            <div class="flex flex-col h-400">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Multi-Celltype Mode</div>
                    <el-button round size="large" color="#EE7E7D"
                        class="text-white hover:text-white focus:text-white active:text-white ml-70"
                        @click="openrundemodialog">
                        Run Demo
                    </el-button>
                    <el-button round size="large" color="#EE7E7D"
                        class="ml-5 text-white hover:text-white focus:text-white active:text-white" @click="godemo">
                        View Demo Result
                    </el-button>
                    <el-button round size="large" color="#34498E" @click="gosubmithelper">
                        Submission Helper
                    </el-button>
                    <el-button round size="large" color="#34498E" class="ml-5">
                        <a href="https://github.com/deepomicslab/PhageScope/issues" target="_blank" class="btn">
                            Report bug
                        </a>
                    </el-button>
                </div>
                <div class="text-lg font-500 ml-20 mt-3 w-9/10 flex flex-row">
                    <el-icon class="text-lg mt-1 mr-2 text-[#34498E]">
                        <InfoFilled />
                    </el-icon>
                    It takes a few minutes to
                    <p class="text-[#EE7E7D] mx-2" @click="godemo">RUN DEMO.</p>
                    Click
                    <p class="text-[#EE7E7D] mx-2">VIEW DEMO RESULT</p>
                    to see the precomputed demo results immediately.
                </div>
                <!-- <div class="font-600 text-3xl ml-20 mt-10">
                    1. Specify Species
                    <n-form-item class="w-75">
                        <n-select
                            v-model:value="thisspeciesoption"
                            :options="speciesoptions"
                            placeholder="Search Species"
                        />
                    </n-form-item>
                </div> -->

                <div class="font-600 text-3xl ml-20 mt-10">
                    2. Input Gene Expression Matrix
                    <n-button text
                        href="https://cygraph.deepomics.org/demo_input/craft_multi_celltype/merfish_ileum/baysor_transcripts.gem.csv"
                        tag="a" target="_blank" type="primary" class="text-lg">
                        See Input Example of Multi-Celltype Mode (Species Mice)
                    </n-button>
                </div>
                <div class="flex flex-row justify-center">
                    <div class="rounded w-190 h-90 mt-5 rounded-2xl" style="box-shadow: 0 0 64px #cfd5db">
                        <n-upload v-model:file-list="csvFileList" directory-dnd :default-upload="false"
                            accept=".csv, .tsv, .txt" @update:file-list="handleCSVFileListChange"
                            @remove="csvFileRemove" show-remove-button>
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p class="text-sp mt-3 mb-3 text-opacity-100" style="color: #f07167">
                                        File size should be less than 100MB
                                    </p>
                                    <p class="text-sp mb-3 text-opacity-100" style="color: #f07167">
                                        Supported formats: .csv / .tsv / .txt
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>
                </div>

                <div class="font-600 text-3xl ml-20 mt-10">
                    3. Input Cell Features
                    <n-button text
                        href="https://cygraph.deepomics.org/demo_input/craft_multi_celltype/merfish_ileum/baysor_cell_feature.csv"
                        tag="a" target="_blank" type="primary" class="text-lg">
                        See Input Example of Multi-Celltype Mode (Species Mice)
                    </n-button>
                </div>
                <div class="flex flex-row justify-center">
                    <div class="rounded w-190 h-90 mt-5 rounded-2xl" style="box-shadow: 0 0 64px #cfd5db">
                        <n-upload v-model:file-list="featureFileList" directory-dnd :default-upload="false"
                            accept=".csv, .tsv, .txt" @update:file-list="handleFeatureFileListChange"
                            @remove="featureFileRemove" show-remove-button>
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p class="text-sp mt-3 mb-3 text-opacity-100" style="color: #f07167">
                                        File size should be less than 100MB
                                    </p>
                                    <p class="text-sp mb-3 text-opacity-100" style="color: #f07167">
                                        Supported formats: .csv / .tsv / .txt
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>
                </div>
                <div class="font-600 text-3xl ml-20 mt-10">4. Parameters</div>
                <div class="flex flex-row justify-center">
                    <div class="rounded w-200 h-115 mt-15 rounded-xl" style="box-shadow: 0 0 64px #cfd5db">
                        <div class="mt-10">
                            <el-form status-icon label-width="auto" label-position="right">
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Species of the input data">
                                            <el-select v-model="paramform.species" placeholder="Please Select"
                                                class="w-60" clearable>
                                                <el-option v-for="option in speciesoptions" :key="option.value"
                                                    :label="option.label" :value="option.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Input gene expression matrix separator">
                                            <el-select v-model="paramform.sep" placeholder="Please Select" class="w-60"
                                                clearable>
                                                <el-option v-for="option in fileseparatoroptions" :key="option.value"
                                                    :label="option.label" :value="option.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Annotation file separator">
                                            <el-select v-model="paramform.csep" placeholder="Please Select" class="w-60"
                                                clearable>
                                                <el-option v-for="option in fileseparatoroptions" :key="option.value"
                                                    :label="option.label" :value="option.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Key of celltype column in the annotation file">
                                            <el-input v-model="paramform.ctkey" class="w-60" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Key of cell id column in the annotation file">
                                            <el-input v-model="paramform.cikey" class="w-60" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="# of gene for rotation derivation (recommend: 10)">
                                            <el-input v-model="paramform.number" class="w-60" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="mt-10">
                                    <el-col :span="24" class="text-center">
                                        <el-button type="info" @click="resetFilterForm()">
                                            Reset
                                        </el-button>
                                    </el-col>
                                </el-row>
                                <!-- <el-row class="mt-4" justify="center">
                                    <el-col :span="14">
                                        <el-alert
                                            v-if="showError"
                                            v-model:title="alertTitle"
                                            type="error"
                                            center
                                            show-icon
                                        />
                                    </el-col>
                                </el-row> -->
                            </el-form>
                        </div>
                    </div>
                </div>

                <!--
                <div class="font-600 text-3xl ml-20 mt-10">
                    4. Separator of the input gene expression matrix file
                    <n-form-item class="w-75">
                        <n-select
                            v-model:value="thisfileseparatoroption"
                            :options="fileseparatoroptions"
                        />
                    </n-form-item>
                </div>-->
                <div class="mt-20 flex flex-row justify-center">
                    <el-button size="large" color="#34498E" :width="70"
                        class="text-white hover:text-white focus:text-white active:text-white text-2xl" @click="submit">
                        Submit
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <el-dialog v-model="rundemodialogVisible" title="Do you confirm to run demo?" width="30%" align-center>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="canceldemo">No</el-button>
                <el-button type="primary" @click="submitdemo">Yes</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'

const paramform = ref({
    species: '',
    sep: '',
    ctkey: 'leiden_final',
    csep: '',
    cikey: 'cell',
    number: '10',
})

const resetFilterForm = () => {
    paramform.value = {
        species: '',
        sep: '',
        ctkey: 'leiden_final',
        csep: '',
        cikey: 'cell',
        number: '10',
    }
}

// const showError = ref(false)

// const fileList = ref<UploadFileInfo[]>([])
const csvFileList = ref<UploadFileInfo[]>([])
const featureFileList = ref<UploadFileInfo[]>([])
// const submitfile = ref<File>()
const submitcsvfile = ref<File>()
const submitfeaturefile = ref<File>()
const userid = ref('')
const rundemodialogVisible = ref(false)

const speciesoptions = [
    {
        label: 'Mice',
        value: 'Mice',
    },
    {
        label: 'Mouse',
        value: 'Mouse',
        disabled: true,
    },
    {
        label: 'Human',
        value: 'Human',
        disabled: true,
    },
    {
        label: 'Axolotls',
        value: 'Axolotls',
        disabled: true,
    },
    {
        label: 'Axolotl',
        value: 'Axolotl',
        disabled: true,
    },
    {
        label: 'Monkey',
        value: 'Monkey',
        disabled: true,
    },
]
const fileseparatoroptions = [
    {
        label: "tab '\\t'",
        value: 'tab',
    },
    {
        label: "space ' '",
        value: 'space',
    },
    {
        label: "comma ','",
        value: 'comma',
    },
]
// const thisspeciesoption = ref('')
// const thisfileseparatoroption = ref('')

/* eslint-disable */
const handleCSVFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.csv)$/g) === null && data[0].name.match(/(.tsv)$/g) && data[0].name.match(/(.txt)$/g)) {
        window.$message.error('Uploaded file must be in .csv / .tsv / .txt format.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        window.$message.error('Uploaded file cannot be empty.', { closable: true, duration: 5000 })
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 100) {
        window.$message.error('Uploaded file cannot exceed 100MB.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length > 1) {
        window.$message.error('Cannot upload more than one files.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length === 1) {
        submitcsvfile.value = data[0].file
        csvFileList.value[0] = data[0]
    }
}
const handleFeatureFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.csv)$/g) === null && data[0].name.match(/(.tsv)$/g) && data[0].name.match(/(.txt)$/g)) {
        window.$message.error('Uploaded file must be in .csv / .tsv / .txt format.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        window.$message.error('Uploaded file cannot be empty.', { closable: true, duration: 5000 })
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 100) {
        window.$message.error('Uploaded file cannot exceed 100MB.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length > 1) {
        window.$message.error('Cannot upload more than one files.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length === 1) {
        submitfeaturefile.value = data[0].file
        featureFileList.value[0] = data[0]
    }
}
const csvFileRemove = () => {
    submitcsvfile.value = undefined
    csvFileList.value.pop()
}
const featureFileRemove = () => {
    submitfeaturefile.value = undefined
    featureFileList.value.pop()
}

const router = useRouter()

const godemo = () => {
    // -99 is the demo_user. Se details in crustdb_api/01_database_add_data.py
    router.push({
        path: '/task/result/conformation/multi_celltype_mode', query: {
            taskid: encrypt(
                '-98', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2')
        }
    })
}

function isPositiveNumber(str: string) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}
const checkParaForm = () => {
    if (paramform.value.species === '') {
        window.$message.error('Please specify species', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    if (paramform.value.sep === '') {
        window.$message.error('Please specify gene expression matrix separator', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    if (paramform.value.csep === '') {
        window.$message.error('Please specify annotation file separator', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    if (paramform.value.ctkey === '') {
        window.$message.error('Please input the key of celltype column in the annotation file', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    if (paramform.value.cikey === '') {
        window.$message.error('Please input the key of cell id column in the annotation file', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    if (!isPositiveNumber(paramform.value.number) || parseInt(paramform.value.number) <= 0) {
        window.$message.error('The gene number should be positive integer', {
            closable: true,
            duration: 5000,
        })
        return false
    }
    return true
}

const submit = async () => {
    console.log('paramform', paramform.value)

    const submitdata = new FormData()

    // if (thisspeciesoption.value === '') {
    //     window.$message.error('Please specify species', {
    //         closable: true,
    //         duration: 5000,
    //     })
    //     return
    // }
    // if (thisfileseparatoroption.value === '') {
    //     window.$message.error('Please specify file separator', {
    //         closable: true,
    //         duration: 5000,
    //     })
    //     return
    // }
    // submitdata.append('species', thisspeciesoption.value)
    // submitdata.append('species', 'Mice')
    // submitdata.append('fileseparator', thisfileseparatoroption.value)
    // submitdata.append('fileseparator', 'comma')
    submitdata.append('analysistype', 'Multi-Celltype Mode')
    submitdata.append('userid', userid.value)
    submitdata.append('inputtype', 'upload')

    if (typeof submitcsvfile.value === 'undefined') {
        window.$message.error('Please upload gene expression matrix', {
            closable: true,
            duration: 5000,
        })
        return
    }
    submitdata.append('CSV', submitcsvfile.value as File)

    if (typeof submitfeaturefile.value === 'undefined') {
        window.$message.error('Please upload cell features', {
            closable: true,
            duration: 5000,
        })
        return
    }
    submitdata.append('feature', submitfeaturefile.value as File)

    if (checkParaForm() === false) {
        // showError.value = true
        return
    }
    submitdata.append('species', paramform.value.species)
    submitdata.append('sep', paramform.value.sep)
    submitdata.append('ctkey', paramform.value.ctkey)
    submitdata.append('csep', paramform.value.csep)
    submitdata.append('cikey', paramform.value.cikey)
    submitdata.append('number', paramform.value.number)

    // for (var pair of submitdata.entries()) {
    //     console.log(pair[0] + ', ' + pair[1]);
    // }
    try {
        window.$message.info("Please wait for several seconds. You will be directed to the Workspace after the task is created successfully", {
            closable: true,
            duration: 20000,
        })
        const response = await axios.post(`/analyze/craft_multi_celltype/`, submitdata, {
            baseURL: '/api',
            timeout: 100000,
            headers: { 'Content-Type': 'multipart/form-data' },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        })
        const { data } = response

        if (data.status === 'Create Success') {
            window.$message.success(data.message, {
                closable: true,
                duration: 5000,
            })
            router.push({
                path: '/workspace/',
            })
        } else {
            window.$message.error(data.message, {
                closable: true,
                duration: 5000,
            })
        }
    } catch (err) {
        console.log(err)
    }
}

const openrundemodialog = () => {
    rundemodialogVisible.value = true
}

const canceldemo = () => {
    rundemodialogVisible.value = false
}

const submitdemo = async () => {
    const submitdata = new FormData()
    const precheck = ref(true)

    if (precheck.value) {
        submitdata.append('analysistype', 'Multi-Celltype Mode')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('fileseparator', 'comma')
        submitdata.append('species', 'Mice') // customised at this time
        const response = await axios.post(`/analyze/craft_multi_celltype/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        if (data.status === 'Create Success') {
            window.$message.success(data.message, {
                closable: true,
                duration: 5000,
            })
            router.push({
                path: '/workspace/',
            })
        } else {
            window.$message.error(data.message, {
                closable: true,
                duration: 5000,
            })
        }
    }
}
onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})

const gosubmithelper = () => {
    router.push({ path: '/tutorial', query: { type: 'analysis' } })
}
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
    height: 48px !important;
}
</style>
