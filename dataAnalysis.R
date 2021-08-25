# Analysis of bambu challenge data

require(dplyr)
require(tidyverse)

people <- read_csv("~/Desktop/personal_code/code_interviews/bambu/backend-challenge-v2/data/data.csv")

# Averages



sapply(people, mean, na.rm = T)  # Returns a vector

# Min and Max
