# Load libraries
library(httr)
library(jsonlite)

# Function to fetch contact information for a member
fetch_contact_info <- function(member_id) {
  url <- paste0("https://members-api.parliament.uk/api/Members/", member_id, "/Contact")
  response <- GET(url)
  
  if (status_code(response) == 200) {
    content <- content(response, "text")
    json_data <- fromJSON(content, flatten = TRUE)
    
    contact_info <- list(email = NA, phone = NA, postcode = NA, twitter = NA, website = NA)
    
    if (!is.null(json_data$value) && length(json_data$value) > 0) {
      if (is.data.frame(json_data$value)) {
        for (i in 1:nrow(json_data$value)) {
          item <- json_data$value[i,]
          
          if (!is.null(item$type) && item$type == "Parliamentary office") {
            if (!is.null(item$email)) {
              contact_info$email <- item$email
            }
            if (!is.null(item$phone)) {
              contact_info$phone <- item$phone
            }
            if (!is.null(item$postcode)) {
              contact_info$postcode <- item$postcode
            }
          }
          if (!is.null(item$type) && item$type == "Website" && !is.null(item$line1)) {
            contact_info$website <- item$line1
          }
          if (!is.null(item$type) && item$type == "Twitter" && !is.null(item$line1)) {
            contact_info$twitter <- item$line1
          }
        }
      }
    }
    
    return(contact_info)
  } else {
    return(list(email = NA, phone = NA, postcode = NA, twitter = NA, website = NA))
  }
}

# Empty list to store data frames
all_data <- list()

# Define API URL
base_url <- "https://members-api.parliament.uk/api/Members/Search?IsCurrentMember=true&House=1&skip="

# Variables for pagination
skip <- 0
take <- 20
has_more_data <- TRUE

while (has_more_data) {
  # Full URL with current skip and take parameters
  url <- paste0(base_url, skip, "&take=", take)
  
  # Fetch data from the API
  response <- GET(url)
  
  # Check if the request was successful
  if (status_code(response) == 200) {
    # Parse the JSON
    content <- content(response, "text")
    json_data <- fromJSON(content, flatten = TRUE)
    
    # Check if there are items in the response
    if (length(json_data$items) > 0) {
      # Convert to a data frame and store in the list
      df <- as.data.frame(json_data$items)
      
      # Fetch contact information for each member and add to the data frame
      contact_infos <- lapply(df$value.id, fetch_contact_info)
      contact_df <- do.call(rbind, lapply(contact_infos, as.data.frame))
      
      # Merge contact information with the main data frame
      df <- cbind(df, contact_df)
      
      # Append the data frame to the list
      all_data <- append(all_data, list(df))
      
      # Increment the skip value for the next iteration
      skip <- skip + take
    } else {
      # No more data to fetch
      has_more_data <- FALSE
    }
  } else {
    break
  }
}

# Combine all data frames into one
combined_df <- do.call(rbind, all_data)

# Cleaning
cleaned_names <- sub("value\\.", "", colnames(combined_df))

# Update column names
colnames(combined_df) <- cleaned_names

# Export as JSON
write_json(combined_df, "members.json")

cat("Data has been successfully fetched and saved")
