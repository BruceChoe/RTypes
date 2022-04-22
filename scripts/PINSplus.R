# Adjust these
dataset = "KIRC"
args = commandArgs(trailingOnly=FALSE)
dataPath = args[7]
resultPath = args[8]
#BiocManager::install("impute")
library(PINSPlus)

#Start: Code Integration
#This format of data organization was code integrated from Dr.Nguyen's lab
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
singleResult <- PerturbationClustering(mydatGE)
subtypeResults <- SubtypingOmicsData(dataList = dataList)

pca_generate.function <- function(pca_x, cluster, dataset, matrix_name) {
  plot(
    prcomp(x = pca_x)$x,
    col = cluster,
    main = paste("Principle Component Analysis of ", dataset, "_", matrix_name, sep="")
  )
  legend(
    "topright",
    legend = paste("Cluster", sort(unique(cluster)), sep = " "),
    fill = sort(unique(cluster))
  )
}

png(paste(resultPath, "PINSPlus_", dataset, "_GE",".png", sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
pca_generate.function(subtypeResults$dataTypeResult[[1]]$pca$x, subtypeResults$dataTypeResult[[1]]$cluster, dataset, "GE")
dev.off()

png(paste(resultPath, "PINSPlus_", dataset, "_ME",".png", sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
pca_generate.function(subtypeResults$dataTypeResult[[2]]$pca$x, subtypeResults$dataTypeResult[[2]]$cluster, dataset, "ME")
dev.off()

png(paste(resultPath, "PINSPlus_", dataset, "_MI",".png", sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
pca_generate.function(subtypeResults$dataTypeResult[[3]]$pca$x, subtypeResults$dataTypeResult[[3]]$cluster, dataset, "MI")
dev.off()

#plot(
#  prcomp(singleResult$pca$x)$x,
#  col = singleResult$cluster,
#  main = "Principle Component Analysis Plot Single"
#)

#Start: Code Integration
#This method of generating survival plots was taught from the PINSPlus documentation and modified to fit our data
cluster1=subtypeResults$cluster1;
cluster2=subtypeResults$cluster2
a <- intersect(unique(cluster2), unique(cluster1))
names(a) <- intersect(unique(cluster2), unique(cluster1))
a[setdiff(unique(cluster2), unique(cluster1))] <- seq(setdiff(unique(cluster2), unique(cluster1))) + max(cluster1)
colors <- a[levels(factor(cluster2))]
coxFit <- coxph(
  Surv(Survival, Death) ~ as.factor(cluster2),
  data = survival,
)
mfit <- survfit(Surv(Survival, Death == 1) ~ as.factor(cluster2), data = survival)
#End: Code Integration
png(paste(resultPath, "PINSPlus_Survival_", dataset, ".png", sep=""),   
    width     = 3.25,
    height    = 3.25,
    units     = "in",
    res       = 1200,
    pointsize = 4)
plot(
  mfit, 
  col = colors,
  main = "Survival curves",
  xlab = "Days", ylab = "Survival",lwd = 2
)
legend(
  "bottomleft",
  fill = colors,
  legend = paste("Group ", levels(factor(cluster2)),": ", table(cluster2)[levels(factor(cluster2))], sep ="")
)
dev.off()
gc()


