dataset = "GBM"
dataPath="D:\\CS 425 Project\\data\\"
resultPath="D:\\CS 425 Project\\results\\"

library(NEMO)
library(SNFtool)

#load data into dataList
load(paste(dataPath, dataset, ".RData" ,sep=""))
patients=rownames(survival)
patients=intersect(patients,rownames(mydatGE))
patients=intersect(patients,rownames(mydatME))
patients=intersect(patients,rownames(mydatMI))
mydatGE=as.matrix(mydatGE[patients,])
mydatME=as.matrix(mydatME[patients,])
mydatMI=as.matrix(mydatMI[patients,])
survival=survival[patients,]
dataList <- list(mydatGE, mydatME, mydatMI)

for (i in 1:length(dataList)) {
  data <- dataList[[i]]
  dataList[[i]] <- t(data)
}

#clustering = nemo.clustering(dataList) # Parameters: num.Clusters and num.neighbors
affinity.graph = nemo.affinity.graph(dataList)
num.clusters = nemo.num.clusters(affinity.graph)
clustering = spectralClustering(affinity.graph, num.clusters) 
names(clustering) = colnames(affinity.graph)

#displayClusters(affinity.graph, clustering)

png(paste(resultPath,"SNF_HeatMap_",dataset,".png"),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
displayClustersWithHeatmap(W, group)
dev.off()
png(paste(resultPath,"SNF_Alluvial_",dataset,".png"),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
plotAlluvial(W, 2:5, col="red")
dev.off()
gc()
