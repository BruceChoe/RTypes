#dataPath <- "C:\\Users\\bruce\\Documents\\GitHub\\RTypes\\scripts\\"
#resultPath <- "C:\\Users\\bruce\\Documents\\GitHub\\RTypes\\scripts\\results\\"
dataset = "KIRC"
args = commandArgs(trailingOnly=FALSE)
dataPath = args[7]
resultPath = args[8]
load(paste(dataPath, dataset, ".RData" ,sep=""))
  
patients=rownames(survival)
patients=intersect(patients,rownames(mydatGE))
patients=intersect(patients,rownames(mydatME))
patients=intersect(patients,rownames(mydatMI))
mydatGE=mydatGE[patients,]
mydatME=mydatME[patients,]
mydatMI=mydatMI[patients,]
survival=survival[patients,]
  
write.csv(mydatGE, file = paste(resultPath,dataset,"_GE.csv", sep=""))
write.csv(mydatGE, file = paste(resultPath,dataset,"_GE.csv", sep=""))
write.csv(mydatME, file = paste(resultPath,dataset,"_ME.csv", sep=""))
write.csv(mydatMI, file = paste(resultPath,dataset,"_MI.csv", sep=""))
write.csv(survival, file = paste(resultPath,dataset,"_Survival.csv", sep=""))




