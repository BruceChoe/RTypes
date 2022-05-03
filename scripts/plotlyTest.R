# Adjust these 
dataset = "KIRC"
dataPath="C:\\Users\\Bruce Choe\\Documents\\GitHub\\scripts\\"

#library(PINSPlus)
library(SNFtool)

print("libloaded")

#Start: Code Integration
#This format of data organization was code integrated from Dr.Nguyen's lab
#load data into dataList
#load(paste(dataPath, dataset, ".RData" ,sep=""))
load("C:\\Users\\Bruce Choe\\Documents\\CS 425 Project\\data\\KIRC.RData")
patients=rownames(survival)
patients=intersect(patients,rownames(mydatGE))
patients=intersect(patients,rownames(mydatME))
patients=intersect(patients,rownames(mydatMI))
mydatGE=as.matrix(mydatGE[patients,])
mydatME=as.matrix(mydatME[patients,])
mydatMI=as.matrix(mydatMI[patients,])
survival=survival[patients,]
#End: Code  Integration

#Load gene expression matrices into list
dataList <- list(mydatGE, mydatME, mydatMI)

#SNF parameters
K = 20;		# number of neighbors, usually (10~30)
alpha = 0.3;  	# hyperparameter, usually (0.3~0.8)
NIT = 10; 	# Number of Iterations, usually (10~20)

WList <- list() # create list to store similarity graphs 

#Prep individual data matrices for fusion
for (i in 1:length(dataList)) {
  data <- dataList[[i]] #
  data <- standardNormalization(data) #normalize matrix
  PSM <- dist2(as.matrix(data), as.matrix(data));  #calculate pair-wise distance
  W <- affinityMatrix(PSM, K, alpha)  # construct similarity graphs
  WList[[i]] <- W #Load affinity matrices into list
}

W = SNF(WList, K, NIT) # construct status matrix by fusing all graphs
C = estimateNumberOfClustersGivenGraph(W)[[1]] #[[1]] takes eigen-gap best to estimate clusters
group = spectralClustering(W,C) # final subtype info; affinity, # clusters, type
write.table(W, file="wMatrix.txt", row.names=TRUE, col.names=TRUE) 
write.table(C, file="cMatrix.txt", row.names=TRUE, col.names=TRUE)
write.table(group, file="groupMatrix.txt", row.names=TRUE, col.names=TRUE)

#VISUALIZATION 
# Get Group information
print(W)
write.csv(W, "W.csv")
write.csv(group, "group.csv")
print(group)
displayClustersWithHeatmap(W, group)

plot(dataList[[2]], col=group, main='Data type 1')

#View plots
png(paste("C:\\Users\\Bruce Choe\\Documents\\CS 425 Project\\results","SNF_HeatMap_",dataset,".png",sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)

dev.off()
png(paste(resultPath,"SNF_Alluvial_",dataset,".png",sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)

plotAlluvial(W, 1:C, col="red")
dev.off()
gc()

# plotly library test
library(plotly)
fig <- plot_ly(z = W, type = "heatmap")
fig
