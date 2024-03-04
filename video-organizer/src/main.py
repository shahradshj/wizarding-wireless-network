import sys
from video_files import VideoFiles

def get_directories():
    """Get the source and destination directories."""
    if len(sys.argv) > 1:
        # Directories are provided as command-line arguments
        source_dir = sys.argv[1]
    else:
        # Ask the user for the directories
        source_dir = input("Enter the source directory: ")
    return source_dir

def main():
    source_dir = get_directories()
    video_files = VideoFiles(source_dir)
    print(f'Parsed {sum(1 for x in video_files.parsed_video_files if x[1] != None)} out of {len(video_files.video_files)} video files.')

    confirmation = input("Do you want to organize these files? (yes/no): ")
    if confirmation.lower() == 'yes':
        # Call the function to organize the files here
        video_files.organize_files()
        revert_confirmation = input("Do you want to revert these changes? (yes/no): ")
        if revert_confirmation.lower() == 'yes':
            # Call the function to revert the changes here
            video_files.revert_changes()
    else:
        print("Operation cancelled.")

if __name__ == '__main__':
    main()