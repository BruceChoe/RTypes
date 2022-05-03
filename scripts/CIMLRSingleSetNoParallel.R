# Adjust these
dataset = "KIRC"
dataPath="C:\\Users\\bruce\\Documents\\GitHub\\RTypes\\scripts\\"
resultPath="C:\\Users\\bruce\\Documents\\GitHub\\RTypes\\scripts\\results\\"

#if (!require("BiocManager", quietly = TRUE))
#  install.packages("BiocManager")
#BiocManager::install("SIMLR", force = TRUE)

library(SIMLR)
data("BuettnerFlorian")
bf_view <- BuettnerFlorian$in_X
#load data into dataList
load(paste(dataPath, dataset, ".RData" ,sep=""))

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

#Load and transpose data
for (i in 1:length(dataList)) {
  dataList[[i]] <- t(dataList[[i]])
}

#Parameters
NUMC <- 2:5
k <- SIMLR_Estimate_Number_of_Clusters(dataList[[3]], NUMC, cores.ratio = 1/2) # estimate # of clusters 
#k <- NUMC[which.min(k$K1)] #heuristic

#x <- as.numeric(dataList[[2]])
#matrix = matrix(unlist(dataList[[2]]))

#Attempt SIMLR analysis
result <- SIMLR(X = mydatGE, c = k, cores.ratio = 1/2) #looking for k subtypes
print(result$y)

cluster <- result$y$cluster

# Visualize Results
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
