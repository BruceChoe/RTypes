# Adjust these
dataset = "KIRC"
args = commandArgs(trailingOnly=FALSE)
dataPath = args[7]
resultPath = args[8]

library(NEMO)
library(SNFtool)

#load data into dataList
load(dataPath)

#Start: Code Integration
#This format of data organization was code integrated from Dr.Nguyen's lab
patients=rownames(survival)
patients=intersect(patients,rownames(mydatGE))
patients=intersect(patients,rownames(mydatME))
patients=intersect(patients,rownames(mydatMI))
mydatGE=as.matrix(mydatGE[patients,])
mydatME=as.matrix(mydatME[patients,])
mydatMI=as.matrix(mydatMI[patients,])
survival=survival[patients,]
dataList <- list(mydatGE, mydatME, mydatMI)
#End: Code Integration

for (i in 1:length(dataList)) {
  data <- dataList[[i]]
  dataList[[i]] <- t(data)
}

#clustering = nemo.clustering(dataList) # Parameters: num.Clusters and num.neighbors
affinity.graph = nemo.affinity.graph(dataList)
num.clusters = nemo.num.clusters(affinity.graph)
clustering = spectralClustering(affinity.graph, num.clusters) 
names(clustering) = colnames(affinity.graph)

png(paste(resultPath, "NEMO_Heatmap.png", sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
displayClustersWithHeatmap(affinity.graph, clustering)
dev.off()
png(paste(resultPath,"NEMO_Alluvial.png", sep=""),
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
plotAlluvial(affinity.graph, 2:5, col="red")
dev.off()
gc()
