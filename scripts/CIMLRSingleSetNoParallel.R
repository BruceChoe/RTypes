# Adjust these
dataset = "GBM"
dataPath="D:\\CS 425 Project\\data\\"
resultPath="D:\\CS 425 Project\\results\\"

library(CIMLR)

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
  dataList[[i]] <- t(dataList[[i]])
}

NUMC <- 2:5
k <- CIMLR_Estimate_Number_of_Clusters(dataList, NUMC, cores.ratio = 1/64) # estimate # of clusters 
k <- NUMC[which.min(k$K1)] #heuristic

result <- CIMLR(dataList, k, cores.ratio = 1/64) #looking for k subtypes
print(result$y)

cluster <- result$y$cluster
png(paste(resultPath,"CIMLR_seperation_",dataset,".png"),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
plot(result$ydata,
     col = c(topo.colors(5))[result$y[["cluster"]]],
     xlab = "component 1",
     ylab = "component 2", # assume 2 heuristics 
     pch = 20,
     main = "Cluster Seperation")

dev.off()
#do feature ranking next
gc()