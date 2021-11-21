from os import getcwd, chdir

if __name__ == "__main__":
    chdir("../../../../../scripts/data")

    with open("test.txt", "w") as f:
        f.write("Hello, world!\n")

    print("Working directory: " + getcwd())