# This tutorial explains graph attributes resulted from Topology Construction analysis

We have created a graph representation of a set of genes with known spatial locations. We constructed the graph using some algorithms, including 

- K-Nearest Neighbors (KNN)
- Radius Nearest Neighbors (RNN) 
- Shared Nearest Neighbors(SNN)
- Minimum Spanning Tree (MST)

The resulting graph captures the intricate web of relationships and interactions between the genes based on their physical proximity and expression patterns.

## 3D & 2D topology visualization

To gain a deeper understanding of the structure and properties of this gene network, we have calculated several key metrics:

**Centrality Measures**, including **degree**, **betweenness**, and **closeness centrality**, provides insights into individual genes' relative importance and influence within the network.

**PageRank** ranks the significance of each gene based on the quantity and quality of its connections, giving us an overview of the network's hierarchy and highlighting the "hub" genes that play crucial roles in information flow.

**Modularity** reveals the strength of naturally occurring communities or modules within the gene network.

**Assortativity** measures the tendency of nodes to connect with other nodes with similar degrees. 

Positive assortativity suggests that high-degree nodes connect with other high-degree nodes, while negative assortativity indicates a preference for high-degree nodes to connect with low-degree nodes.

The **span** of a graph represents the maximum distance between any two nodes, indicating the overall reach and coverage of the network.

**Average Branching Factor** measures the graph's complexity, indicating the average number of connections per node. It provides insights into the overall interconnectedness of the network.

## GO visualization

By treating the connected nodes in our topological map as distinct components, we could apply **Gene Ontology (GO)** enrichment analysis to uncover the biological processes, molecular functions, and cellular components associated with each gene community.

Gene Ontology is a comprehensive knowledge base that provides a standardized vocabulary to describe the roles and attributes of genes across various organisms. 
By mapping our genes of interest to their corresponding GO terms, we could identify the overrepresented functional categories within each network component. 
By using GO analysis, we could hypothesize about the potential biological functions and interactions that may be taking place in these spatially organized gene clusters.

**Gene set** refers to a group of genes with the same characteristics.