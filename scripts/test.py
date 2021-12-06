from os import getcwd, chdir
import subprocess

if __name__ == "__main__":
    print("Working directory: " + getcwd())
    chdir("../../../../../scripts/data")

    print("Working directory: " + getcwd())
    subprocess.run("Rscript.exe -e \"print(.libPaths())\"")
    subprocess.run("Rscript.exe --vanilla ..\SNFSingleSetNoParallel.R", shell=True)
