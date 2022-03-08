# Adjust these 
dataset = "KIRC"
args = commandArgs(trailingOnly=FALSE)
dataPath = args[7]
resultPath = args[8]
#library(PINSPlus)
library(SNFtool)

#Start: Code Integration
#This format of data organization was code integrated from Dr.Nguyen's lab
#load data into dataList
load(dataPath)
patients=rownames(survival)
patients=intersect(patients,rownames(mydatGE))
patients=intersect(patients,rownames(mydatME))
patients=intersect(patients,rownames(mydatMI))
mydatGE=as.matrix(mydatGE[patients,])
mydatME=as.matrix(mydatME[patients,])
mydatMI=as.matrix(mydatMI[patients,])
survival=survival[patients,]
#End: Code  Integration

dataList <- list(mydatGE, mydatME, mydatMI)

#RUNSNF
K = 20;		# number of neighbors, usually (10~30)
alpha = 0.5;  	# hyperparameter, usually (0.3~0.8)
NIT = 10; 	# Number of Iterations, usually (10~20)

WList <- list()
for (i in 1:length(dataList)) {
  data <- dataList[[i]]
  data <- standardNormalization(data)
  PSM <- dist2(as.matrix(data), as.matrix(data));  #calculate pair-wise distance
  W <- affinityMatrix(PSM, K, alpha)  # construct similarity graphs
  WList[[i]] <- W
}
W = SNF(WList, K, NIT) # construct status matrix 
C = estimateNumberOfClustersGivenGraph(W)[[1]] 
group = spectralClustering(W,C) # final subtype info

#list(cluster = group, rt = running_time)
#result$survival <- survival

#VISUALIZATION 
#print(W)
#print(group)
#displayClustersWithHeatmap(W, group)

png(paste(resultPath, "SNF_Heatmap.png", sep=""), #paste(resultPath,"SNF_HeatMap_",dataset,".png",sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
displayClustersWithHeatmap(W, group)
dev.off()
png(paste(resultPath, "SNF_Alluvial.png", sep=""), #paste(resultPath,"SNF_Alluvial_",dataset,".png",sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
plotAlluvial(W, 2:5, col="red")
dev.off()
gc()
