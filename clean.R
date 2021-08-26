# Analysis of bambu challenge data

require(dplyr)
require(tidyverse)

people <- read_csv("~/Desktop/personal_code/code_interviews/bambu/backend-challenge-v2/data/data.csv")

# Fix stranges names
names(people)<-make.names(names(people),unique = TRUE) 


# Averages

sapply(people[,-1], mean, na.rm = T)  

# Min and Max

sapply(people[,-1], min, na.rm = T)
sapply(people[,-1], max, na.rm = T)


# Convert experienced to digits (1, 0)
people %>%
  rename(
    monthlyIncome = monthly.income
  ) %>%
  mutate(
    experienced = ifelse(experienced == TRUE, 1, 0)
  ) -> people_1


# Write to csv
write.csv(people_1,
          '~/Desktop/personal_code/code_interviews/bambu/people-api/database/people.csv',
          quote=T,
          row.names = F,
          na = ""
)