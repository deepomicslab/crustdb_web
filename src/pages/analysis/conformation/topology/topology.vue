<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef">
            <div class="flex flex-col h-400">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Topology</div>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="text-white hover:text-white focus:text-white active:text-white ml-70"
                        @click="openrundemodialog"
                    >
                        Run Demo
                    </el-button>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="ml-5 text-white hover:text-white focus:text-white active:text-white"
                        @click="godemo"
                    >
                        View Demo Result
                    </el-button>
                    <el-button round size="large" color="#34498E" @click="gosubmithelper">
                        Submission Helper
                    </el-button>
                    <el-button round size="large" color="#34498E" class="ml-5">
                        <a
                            href="https://github.com/deepomicslab/PhageScope/issues"
                            target="_blank"
                            class="btn"
                        >
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
                <div class="font-600 text-3xl ml-20 mt-10">
                    1. Specify Species
                    <n-form-item class="w-75">
                        <n-select
                            v-model:value="thisspeciesoption"
                            :options="speciesoptions"
                            placeholder="Search Species"
                        />
                    </n-form-item>
                </div>
                <div class="font-600 text-3xl ml-20 mt-10">
                    2. Input Gene Coordinates
                    <n-button
                        text
                        href="https://cygraph.deepomics.org/demo_input/craft_single_celltype/Mice_endo/SS200000108BR_A3A4_scgem.Endothelial_cell.csv"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Input Example of Topology Construction (Species Human)
                    </n-button>
                </div>

                <div class="flex flex-row justify-center">
                    <div
                        class="rounded w-190 h-90 mt-5 rounded-2xl"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <n-upload
                            v-model:file-list="fileList"
                            directory-dnd
                            :default-upload="false"
                            accept=".csv"
                            @update:file-list="handleFileListChange"
                            @remove="remove"
                            show-remove-button
                        >
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p
                                        class="text-sp mt-3 mb-3 text-opacity-100"
                                        style="color: #f07167"
                                    >
                                        File size should be less than 100MB
                                    </p>
                                    <p class="text-sp mb-3 text-opacity-100" style="color: #f07167">
                                        Supported formats: .csv
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>
                </div>
                <div class="mt-20 flex flex-row justify-center">
                    <el-button
                        size="large"
                        color="#34498E"
                        :width="70"
                        class="text-white hover:text-white focus:text-white active:text-white text-2xl"
                        @click="submit"
                    >
                        Submit
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <el-dialog
        v-model="rundemodialogVisible"
        title="Do you confirm to run demo?"
        width="30%"
        align-center
    >
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

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const userid = ref('')
const rundemodialogVisible = ref(false)

const speciesoptions = [
    {
        label: 'Mouse',
        value: 'Mouse',
    },
    {
        label: 'Human',
        value: 'Human',
    },
    {
        label: 'Axolotl',
        value: 'Axolotl',
    },
    {
        label: 'Monkey',
        value: 'Monkey',
    },
]
const thisspeciesoption = ref('')

/* eslint-disable */
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.csv)$/g) === null) {
        window.$message.error('Uploaded file must be in .csv format.', {
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
        submitfile.value = data[0].file
        fileList.value[0] = data[0]
    }
}
const remove = () => {
    submitfile.value = undefined
    fileList.value.pop()
}

const router = useRouter()

const godemo = () => {
    // -99 is the demo_user. Se details in crustdb_api/01_database_add_data.py
    router.push({
        path: '/task/result/conformation/single_celltype_mode', query: {
            taskid: encrypt(
                '-99', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2')
        }
    })
}

const submit = async () => {
    const submitdata = new FormData()
    const precheck = ref(false)

    if (thisspeciesoption.value === '') {
        window.$message.error('Please specify species', {
            closable: true,
            duration: 5000,
        })
        precheck.value = false
        return
    }
    submitdata.append('species', thisspeciesoption.value)
    submitdata.append('analysistype', 'Topology Construction')
    submitdata.append('userid', userid.value)
    submitdata.append('inputtype', 'upload')

    if (typeof submitfile.value === 'undefined') {
        window.$message.error('Please upload gene coordinates', {
            closable: true,
            duration: 5000,
        })
        precheck.value = false
    } else {
        submitdata.append('gene_coord', submitfile.value as File)
        precheck.value = true
    }

    if (precheck.value) {

        // for (var pair of submitdata.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }
        try {
            const response = await axios.post(`/analyze/craft_topology/`, submitdata, {
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
        submitdata.append('analysistype', 'Topology Construction')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('species', 'Human') // customised at this time
        const response = await axios.post(`/analyze/craft_topology/`, submitdata, {
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
