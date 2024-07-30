# This tutorial shows how to run Cytocraft on subcell-resolution ST data

## Load packages

```python
from src.cytocraft import craft
gem_path = './demo/merfish_ileum/transcripts.gem.csv'
obs_path = './demo/merfish_ileum/cell_feature.csv'
```

## Read subcell-resolution ST gene expression matrix (gem) file and corresponding cell meta file

```python
gem = craft.read_gem_as_csv(gem_path, sep=',')
gem
```

```python
obs = pd.read_csv(obs_path, sep='\t')
obs
```

## Splitting gem files based on the cell type of the meta file

```python
print(obs.columns)
# keys are from obs column indeces
ct_key = 'cell_type'
ci_key = 'cell_id'
split_paths = craft.split_gem(gem_path, obs, ct_key, ci_key, gsep=',')
```


Index(['cell_id', 'center_x', 'center_y', 'girth', 'area', 'roundness',\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'mRNA_count', 'cell_type'],\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dtype='object')\
split gem path of Myocyte : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Myocyte.tsv\
split gem path of Neuron : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Neuron.tsv\
split gem path of Goblet cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Goblet_cell.tsv\
split gem path of TA : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.TA.tsv\
split gem path of Stem cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Stem_cell.tsv\
split gem path of Paneth cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Paneth_cell.tsv\
split gem path of Macrophage : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Macrophage.tsv\
split gem path of B cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.B_cell.tsv\
split gem path of Enterocyte cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Enterocyte_cell.tsv\
split gem path of Tuft cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Tuft_cell.tsv\
split gem path of T cell : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.T_cell.tsv\
split gem path of Fibroblast : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Fibroblast.tsv\
split gem path of Glia : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Glia.tsv\
split gem path of Vascular : ./demo/merfish_ileum/transcripts.gem.csv.cell_type.Vascular.tsv


## Run Cytocraft

```python
ct_gem_path = './demo/merfish_ileum/transcripts.gem.csv.cell_type.Myocyte.tsv'
SN = os.path.basename(os.path.splitext(ct_gem_path)[0])
gem = craft.read_gem_as_csv(ct_gem_path, sep='\t')
adata = craft.read_gem_as_adata(ct_gem_path,sep='\t')
```

Adding adata in adata.obs['orig.ident'].\
Adding data.position as adata.obsm['spatial'] .\
Adding data.position as adata.obs['x'] and adata.obs['y'] .\
Finished conversion to anndata.


```python
adata = craft.craft(
        gem=gem,
        adata=adata,
        species='Mice',
        nderive=10,
        thresh=0.9,
        thresh_rmsd=0.25,
        seed=999,
        samplename=SN
    )
```

Speceis: Mice\
Sample Name: transcripts.gem.csv.cell_type.Myocyte\
Seed: 999\
Cell Number: 570\
Gene Number: 233\
Threshold for gene filter is: 0.9\
Number of genes used for Rotation Derivation is: 10\
Task ID: 2C5U

Distance between X_new and X_old for loop 1 is: 0.9944597874366184\
Distance between X_new and X_old for loop 2 is: 0.46834165701373814\
Distance between X_new and X_old for loop 3 is: 0.2942829851542298\
Distance between X_new and X_old for loop 4 is: 0.25051306290204695\
Distance between X_new and X_old for loop 5 is: 0.20772909510718088\
Number of total Transcription centers is: 66

## Draw plots

```python
genechr_mice = craft.get_gene_chr(species='Mice')
X = adata.uns['X']
D = craft.gene_gene_distance_matrix(X)
```

66it [00:00, 217.62it/s]

```python
# labels
labels=[]
for g in GeneLists['Lung5_Rep3 macrophage']:
    try:
        labels.append(genechr[g])
    except KeyError:
        labels.append('Unknown')
# cmap
cmap=dict(zip(np.unique(labels), zeileis_28))
```

```python
plot_network(D, labels=labels, cmap=cmap, 
            csep='\n', corder=0, N_neighbor=1, html='GeneConf_Lung5_Rep3_macrophage.html', 
            width=1400, height=1000,edge_scale=0.1, edge_adjust=+1)
```