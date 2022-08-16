#!/usr/bin/env bash

set -x;

input_file=$1
output=$2
variant_type=$3  ##{known, unkown} known:scoreDIVAN.cmd.R; unkown:scoreDIVAN.cmd.genome.R 
disease=$4  ##{disease, all}  all:batchscript



db="/db"  ### Mount Docker volume

if [ ${variant_type} = 'known' ]; then
     variant_db=$5 ##{1KG, cosmic, Ensembl}
     #input_format=$6  ##{variants_list, genomic_regions}
     
     cd ${db}/db_known_variants
     
     R --slave --args --no-save ${input_file} \
     ${disease} \
     ${variant_db} \
     scoredistTSS \
     ${output}/score.txt  < scoreDIVAN.cmd.R    
fi  

if [ ${variant_type} = 'unknown' ]; then
     cd ${db}/db_unknown_variants
     
     R --slave --args --no-save ${input_file} \
     ${disease} \
     scoredistTSS \
     ${output}/score.txt  < scoreDIVAN.cmd.genome.R     
fi  

## 
#./main_script.sh {fullPath}variant.txt /media/yagoubali/bioinfo2/DIVAN/scripts/output1 known BehcetSyndrome Ensembl 
#./main_script.sh {fullPath}region.txt  /media/yagoubali/bioinfo2/DIVAN/scripts/output2 known BehcetSyndrome 1KG
#./main_script.sh {fullPath}region.txt  /media/yagoubali/bioinfo2/DIVAN/scripts/output3 unknown BehcetSyndrome


## Data:
### A. For known varaints
      #1 variant database: variant_db containing three subfolders, which are: 1KG, cosmic, Ensembl
      #2 pre-computed scores for disease of interest: allTSSscore containing 45 subfolders
      #3 scoredistTSS: scoredistTSS containing D-score distribution for the whole genome for all 45 diseases.
### A. For known varaints
    #1 variant database: variant_db containing three subfolders, which are: 1KG, cosmic, Ensembl
    #2 pre-computed scores for disease of interest: allTSSscore containing 45 subfolders
    #3 Allregionscore: Allregionscore containing Distribution of base-level whole genome DIVAN scores 45 diseases for both region-matched and TSS-matched region.

### Run the tool
# 1. Known variants: (5 parameters)
    #arg1:  A input file contains either variant identifiers (e.g. rs149201999) or genomic regions (e.g. chr19  35660450 35660500 )
    #arg2:  A folder named by disease contains pre-computed datasets separated by chromosome
    #arg3:  A folder (e.g.Ensembl) contains the variant database
    #arg4:  A  folder (e.g. scoredistTSS) contains the genome-wide base-level score distribution for all diseases
    #arg5:  A output file contains scores for hit variants or all hit variants within each genomic region
  ## Usage:   R --slave --args --no-save arg1 arg2 arg3 arg4 arg5 < scoreDIVAN.cmd.R 
  ## --> R --slave --args --no-save variant.txt BehcetSyndrome Ensembl scoredistTSS score.variant.txt  < scoreDIVAN.cmd.R 
  ## --> R --slave --args --no-save region.txt BehcetSyndrome Ensembl scoreTSSdist score.region.txt  < scoreDIVAN.cmd.R 

# 2. unKnown variants: (4 parameters)
  ## Usage: R --slave --args --no-save arg1 arg2 arg3  arg4 < scoreDIVAN.cmd.genome.R 
  ## --> R --slave --args --no-save region.txt BehcetSyndrome scoredistTSS score.genome.txt  < scoreDIVAN.cmd.genome.R 

## unzip ---> tar -xvf 

# diseases list
# Albuminuria
# Alcoholism
# AlzheimerDisease
# AmyotrophicLateralSclerosis
# Arthritis,Rheumatoid
# Asthma
# AttentionDeficitDisorderwithHyperactivity
# BehcetSyndrome
# BipolarDisorder
# BodyWeightChanges
# BodyWeight
# BreastNeoplasms
# CardiovascularDiseases
# CarotidArteryDiseases
# Colitis,Ulcerative
# CoronaryArteryDisease
# CoronaryDisease
# CrohnDisease
# Death,Sudden,Cardiac
# DepressiveDisorder,Major
# DiabetesMellitus,Type1
# DiabetesMellitus,Type2
# DiabeticNephropathies
# HeartFailure
# Hypertension
# Hypertrophy,LeftVentricular
# Inflammation
# InflammatoryBowelDiseases
# InsulinResistance
# LupusErythematosus,Systemic
# MacularDegeneration
# MentalCompetency
# MetabolicSyndromeX
# MultipleSclerosis
# MyocardialInfarction
# Neuroblastoma
# Obesity
# Osteoporosis
# PancreaticNeoplasms
# ParkinsonDisease
# ProstaticNeoplasms
# Psoriasis
# Schizophrenia
# Sleep
# Stroke
