<template>
    <div class="flex flex-col w-full h-380 justify-start items-center bg-[#f8f9fa]">
        <n-alert type="info" closable :bordered="false" class="w-320 bg-[#9ab4c5] mt-10">
            <template #icon>
                <el-icon class="text-lg mt-2 text-[#34498E]">
                    <InfoFilled />
                </el-icon>
            </template>
            <template #header>
                <p class="text-xl text-gray-50">Notice</p>
            </template>
            <div id="notice" class="text-lg text-gray-50">
                <p class="mb-2">
                    If you encounter any errors, please do not hesitate to contact us via email at
                    <strong class="text-[#ee7e7d] font-400 mx-1 text-[18px]">
                        <a href="mailto:syang58-c@my.cityu.edu.hk">syang58-c@my.cityu.edu.hk</a>
                    </strong>
                </p>
                <p class="mb-2">We thank you for your patience and understanding.</p>
            </div>
        </n-alert>
        <div style="box-shadow: 0 0 64px #cfd5db" class="w-320 h-50 mt-10 mb-10">
            <div class="text-[22px] px-9 py-2 leading-10 text-gray-700 bg-gray-300">
                If you want to use PhageScope,
                <strong class="text-[#ee7e7d] font-400 mx-1 text-[22px]">
                    <a
                        href="https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkad979/7334092"
                    >
                        please cite our publication.
                    </a>
                </strong>
            </div>
            <div class="text-[18px] px-9 py-2 leading-10 text-gray-700">
                Ruo Han Wang, Shuo Yang, Zhixuan Liu, Yuanzheng Zhang, Xueying Wang, Zixin Xu,
                Jianping Wang, Shuai Cheng Li, PhageScope: a well-annotated bacteriophage database
                with automatic analyses and visualizations, Nucleic Acids Research, 2023;, gkad979,
                https://doi.org/10.1093/nar/gkad979
            </div>
        </div>
        <div class="flex flex-row w-full h-full justify-center items-center">
            <div class="h-200 w-360 flex flex-row">
                <div class="w-180 flex flex-col justify-start items-center">
                    <div class="flex flex-row">
                        <div class="mr-5">
                            <el-image
                                class="mt-7"
                                src="/png/p5.png"
                                style="width: 60px; height: 60px"
                            ></el-image>
                        </div>

                        <div class="text-5xl font-700 text-[#3e5294] mt-10">Our Team</div>
                    </div>

                    <div style="box-shadow: 0 0 64px #cfd5db" class="w-150 h-160 mt-15">
                        <div
                            class="text-[21px] px-19.5 py-16 leading-12 mt-5 text-justify text-gray-700"
                        >
                            We are a diverse team of talented undergraduate students, Ph.D.
                            candidates, and postdoctoral researchers, led by Dr. Shuai Cheng LI at
                            the City University of Hong Kong. Our team comprises individuals with
                            extensive expertise in bioinformatics, clinical pathology, and computer
                            science. If you have any inquiries or require further information,
                            please feel free to reach out to us at
                            <strong class="text-[#ee7e7d] font-400 mx-1 text-[21px]">
                                syang58-c@my.cityu.edu.hk
                            </strong>
                        </div>
                    </div>
                </div>
                <div class="w-160 flex flex-col justify-start items-center ml-15">
                    <div class="flex flex-col justify-center items-center">
                        <el-avatar shape="circle" :size="150" fit="fill" src="/png/lsc.jpg" />
                        <div class="mt-3 text-lg font-500">LI Shuaicheng</div>
                    </div>
                    <div class="flex flex-row justify-around w-160 mt-5">
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="fill" src="/png/wrh.jpg" />
                            <div class="mt-3 text-lg font-500">WANG Ruohan</div>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="fill" src="/png/ys.jpg" />
                            <div class="mt-3 text-lg font-500">YANG Shuo</div>
                        </div>
                    </div>
                    <div class="flex flex-row justify-around w-160 mt-5">
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="fill" src="/png/lzx.jpg" />
                            <div class="mt-3 text-lg font-500">LIU Zhixuan</div>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="cover" src="/png/zyz.jpg" />
                            <div class="mt-3 text-lg font-500">ZHANG Yuanzheng</div>
                        </div>
                    </div>
                    <div class="flex flex-row justify-around w-160 mt-5">
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="cover" src="/png/wxy.jpg" />
                            <div class="mt-3 text-lg font-500">WANG Xueying</div>
                        </div>
                        <div class="flex flex-col justify-center items-center">
                            <el-avatar shape="circle" :size="150" fit="cover" src="/png/xzx.jpg" />
                            <div class="mt-3 text-lg font-500">XU Zixin</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>
