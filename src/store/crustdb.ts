import { defineStore } from 'pinia'

export const useCrustDBStore = defineStore('crustdbData', () => {
    const detailsDistanceList = ref([])
    const nodesCoord = ref([])
    const nodesIndex = ref([])
    const edgeList = ref([])
    return {
        detailsDistanceList,
        nodesCoord,
        nodesIndex,
        edgeList,
    }
})
