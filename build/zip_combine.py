#!/usr/bin/env python3
import sys
import subprocess
import os

# Check for exactly 1 argument
if len(sys.argv) != 2:
    print(f"Usage: {sys.argv[0]} <first_part_of_split_archive.7z.001>")
    sys.exit(1)

# Get the first split archive part
split_archive_part = sys.argv[1]

# Check if the provided file exists
if not os.path.exists(split_archive_part):
    print(f"Error: The file {split_archive_part} does not exist.")
    sys.exit(1)

# Build the 7z command for extraction
command = ['7z', 'x', split_archive_part]

# Run the command
try:
    subprocess.run(command, check=True)
    print(f"Archive {split_archive_part} has been successfully extracted.")
except subprocess.CalledProcessError as e:
    print("An error occurred while extracting the archive.")
    sys.exit(e.returncode)

