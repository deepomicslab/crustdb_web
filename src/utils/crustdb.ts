export const celltypeDict = [
    {
        label: 'cckIN',
        value: 'cckIN',
    },
    {
        label: 'Cell',
        value: 'Cell Type',
    },
    {
        label: 'CMPN',
        value: 'CMPN',
    },
    {
        label: 'CP',
        value: 'CP',
    },
    {
        label: 'dEGC',
        value: 'dEGC',
    },
    {
        label: 'dNBL1',
        value: 'dNBL1',
    },
    {
        label: 'dNBL2',
        value: 'dNBL2',
    },
    {
        label: 'dNBL3',
        value: 'dNBL3',
    },
    {
        label: 'dNBL4',
        value: 'dNBL4',
    },
    {
        label: 'dNBL5',
        value: 'dNBL5',
    },
    {
        label: 'dpEX',
        value: 'dpEX',
    },
    {
        label: 'Immature_cckIN',
        value: 'Immature_cckIN',
    },
    {
        label: 'Immature_CMPN',
        value: 'Immature_CMPN',
    },
    {
        label: 'Immature_DMIN',
        value: 'Immature_DMIN',
    },
    {
        label: 'Immature_dpEX',
        value: 'Immature_dpEX',
    },
    {
        label: 'Immature_mpEX',
        value: 'Immature_mpEX',
    },
    {
        label: 'Immature_MSN',
        value: 'Immature_MSN',
    },
    {
        label: 'Immature_nptxEX',
        value: 'Immature_nptxEX',
    },
    {
        label: 'MCG',
        value: 'MCG',
    },
    {
        label: 'mpEX',
        value: 'mpEX',
    },
    {
        label: 'mpIN',
        value: 'mpIN',
    },
    {
        label: 'MSN',
        value: 'MSN',
    },
    {
        label: 'nptxEX',
        value: 'nptxEX',
    },
    {
        label: 'npyIN',
        value: 'npyIN',
    },
    {
        label: 'ntng1IN',
        value: 'ntng1IN',
    },
    {
        label: 'Oligo',
        value: 'Oligo',
    },
    {
        label: 'ribEGC',
        value: 'ribEGC',
    },
    {
        label: 'scgnIN',
        value: 'scgnIN',
    },
    {
        label: 'sfrpEGC',
        value: 'sfrpEGC',
    },
    {
        label: 'sstIN',
        value: 'sstIN',
    },
    {
        label: 'tlNBL',
        value: 'tlNBL',
    },
    {
        label: 'Unknown',
        value: 'Unknown',
    },
    {
        label: 'VLMC',
        value: 'VLMC',
    },
    {
        label: 'wntEGC',
        value: 'wntEGC',
    },
]

export const sexDict = [
    {
        label: 'Female',
        value: 'Female',
    },
    {
        label: 'Male',
        value: 'Male',
    },
]

export const devDict = [
    {
        label: 'Adult',
        value: 'Adult',
    },
    {
        label: 'Developmental Stage',
        value: 'Developmental Stage',
    },
    {
        label: 'Juvenile',
        value: 'Juvenile',
    },
    {
        label: 'Metamorphosis',
        value: 'Metamorphosis',
    },
    {
        label: 'Stage 44',
        value: 'Stage 44',
    },
    {
        label: 'Stage 54',
        value: 'Stage 54',
    },
    {
        label: 'Stage 57',
        value: 'Stage 57',
    },
]

// Color: info, success, warning, error, normal

export const SpeciesColor = (style: any) => {
    if (style === 'Ambystoma mexicanum (Axolotl)') {
        return 'success'
    }
    if (style === 'Homo sapiens (Human)') {
        return 'info'
    }
    return 'warning'
}

export const STPlatformColor = (style: any) => {
    if (style === 'Stereo-seq') {
        return 'success'
    }
    if (style === 'CosMx') {
        return 'info'
    }
    return 'warning' // MERFISH
}

export const DiseaseStageColor = (style: any) => {
    if (style === 'Normal') {
        return 'info'
    }
    return 'error'
}
