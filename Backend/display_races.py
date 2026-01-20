import pandas as pd
import os

# Define the path to the data
data_path = "/Users/jassi/Documents/PodiumSense/data/raw"

# Years to process
years = range(2018, 2026)

def main():
    for year in years:
        file_path = os.path.join(data_path, f"results_{year}.csv")
        
        if not os.path.exists(file_path):
            print(f"Warning: File not found for year {year}: {file_path}")
            continue
            
        try:
            # Read the CSV file
            df = pd.read_csv(file_path)
            
            # Check if necessary columns exist
            required_columns = ['Season', 'Round', 'EventName']
            if not all(col in df.columns for col in required_columns):
                print(f"Warning: Missing columns in {file_path}")
                continue
                
            # Extract unique races, sorted by Round
            races = df[['Season', 'Round', 'EventName']].drop_duplicates().sort_values('Round')
            
            # Print races in the requested format
            for _, row in races.iterrows():
                print(f"{row['Season']} {row['EventName']}")
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    main()
