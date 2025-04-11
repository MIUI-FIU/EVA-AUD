#!/usr/bin/env python3
import sys
import subprocess

# Check for exactly 2 arguments
if len(sys.argv) != 3:
    print(f"Usage: {sys.argv[0]} <output_archive.7z> <input_file_or_dir>")
    sys.exit(1)

# Get arguments
output_archive = sys.argv[1]
input_path = sys.argv[2]

print(f"First argument (archive name): {output_archive}")
print(f"Second argument (file/folder to compress): {input_path}")

# Build the 7z command
# -v50m splits the archive into 50MB volumes
command = ['7z', 'a', '-v50m', output_archive, input_path]

# Run the command
try:
    subprocess.run(command, check=True)
except subprocess.CalledProcessError as e:
    print("An error occurred while creating the archive.")
    sys.exit(e.returncode)

