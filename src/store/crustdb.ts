import { defineStore } from 'pinia'

export const useCrustDBStore = defineStore('crustdbData', () => {
    const detailsDistanceList = ref([])
    return {
        detailsDistanceList,
    }
})
