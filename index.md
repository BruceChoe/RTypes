# RTypes
CS 426 Senior Project in Computer Science, Spring 2022, at UNR, CSE Department

* TOC
{:toc}

## People

All of the following individuals are affiliated with the University of Nevada, Reno.

### Team 26:

* Cristian Ayala
* Elias Brezine
* Bruce Choe
* Erik Marsh

### Advisor

* Dr. Tin Nguyen

### Instructors

* Dr. Sergiu Dascalu
* Dr. David Feil-Seifer
* Vinh Le
* Devrin Lee

## Introduction

RTypes is a web application that interfaces with existing disease subtyping tools using an accessible web interface. RTypes allows users to perform disease subtyping analysis on a user-uploaded dataset without requiring extensive programming knowledge. RTypes allows users to save and share finished analysis using an account system. RTypes emphasizes accessibility — interfacing with subtyping analysis tools is done through a simple graphical user interface that requires no coding knowledge. At most, RTypes will require users to upload clean data and adjust data parameters as needed. RTypes is built with Meteor (a JavaScript web framework) with PostgreSQL database formats. RTypes is designed from a functional perspective rather than object oriented. The purpose of RTypes is to provide an easy pipeline for subtyping analysis by aggregating multiple existing subtyping tools into one simple website. 

## Current Features

There are four main views of the website:
the home page, the new visualization page, the visualization index page, and the saved visualization page.
Each page has a sidebar that shows the user a list of their saved visualizations as well as visualizations that have been shared with the user.

We have implemented a user account system so that each user can save visualizations to their account.
Unless the visualizations are shared with another user, the visualizations are private -
they can only be viewed by the owner.
To sign up, the user must enter their email and a password.
The functionality of RTypes is only available to those who have created an account.

The home page is a welcome page that directs the user toward the login box if they are not logged in,
or to the new visualization page if they are logged in.

The new visualization page has a straightforward workflow:
1. Upload a `.RData` dataset.
2. Select a subtyping tool to perform analysis with. Currently, RTypes supports two disease subtyping tools: SNFTool and NEMO.
3. Generate the visualizations of the subtyping analysis.
4. Enter a name and a description for the visualization.
5. Save the visualization to your user account.
6. Optionally, the user may download the visualization to their device.

The visualization index page is an enumeration of the user's saved visualizations.
The visualization name is listed alongside a preview of the visualization's first image.
There is a separate area for visualizations shared with the user, displayed in a similar manner to the user's saved visualziations.

The view visualization page shows the name of the visualization, its description, and the visualizations themselves.
The bottom of the page allows the user to download the visualizations to their device or share the visualization with another RTypes user.

## Future Work
Features to be implemented for RTypes include:
1. Account analysis sharing
2. Additional subtyping tools
3. Auto-generated explanations for visualizations
4. Support for additional file types (CSV, XLSX)
5. Improved website navigation and dashboard
6. Additional visualizations per subtyping tool 
7. Overhaul of user-interface aesthetics


## Project Media

### Project Poster

[Link to poster (PDF)](/poster.pdf)

![Team 26 project poster](/poster.png)

### Project Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/yjaACLx-D6M" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Project Lightning Talk

<iframe width="560" height="315" src="https://www.youtube.com/embed/lPmMif7g8Sk" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Project Resources

### Textbooks
* [A Little Book of R for Bioinformatics](https://a-little-book-of-r-for-bioinformatics.readthedocs.io/en/latest/#)
* [Applied Statistics for Bioninformatics Using R](https://cran.r-project.org/doc/contrib/Krijnen-IntroBioInfStatistics.pdf)

### Useful Websites
* [UNR SMRT Bioinformatics Tool](https://bioinformatics.cse.unr.edu/software/SMRT/)
* [The Cancer Genome Atlas Database](https://www.cancer.gov/about-nci/organization/ccg/research/structural-genomics/tcga)
* [National Center for Biotechnology Information](https://www.ncbi.nlm.nih.gov/)
* [Meteor API Reference](https://docs.meteor.com/)

### Journal Articles
* [Multi-omics Data Integration, Interpretation, and Its Application](https://journals.sagepub.com/doi/full/10.1177/1177932219899051)
* [Multi-Approach Bioinformatics Analysis of Curated Omics Data Provides a Gene Expression Panorama for Multiple Cancer Types](https://www.frontiersin.org/articles/10.3389/fgene.2020.586602/full)
* [A catalogue of 1,167 genomes from the human gut archaeome](https://www.nature.com/articles/s41564-021-01020-9)

### News
* [Gene expression research enhanced by new open-source application](https://factor.niehs.nih.gov/2022/1/science-highlights/gene-expression-research/index.htm)
* [New cloud-based platform opens genomics data to all](https://www.sciencedaily.com/releases/2022/01/220112145118.htm)

### Clustering Tools
* [SNFtool](https://cran.r-project.org/web/packages/SNFtool/index.html)
* [NEMO](https://github.com/Shamir-Lab/NEMO)
* [PINSplus](https://cran.r-project.org/web/packages/PINSPlus/index.html)
* [iCluster](https://cran.r-project.org/web/packages/iCluster/)
