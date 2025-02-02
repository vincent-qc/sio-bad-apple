#!/usr/bin/env python3
import argparse
import sys

import cv2
import numpy as np


def process_video(video_path, output_path, frames_per_line=4, grid_rows=20, grid_cols=20):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Cannot open video file {video_path}")
        sys.exit(1)

    # Read one frame to determine the dimensions.
    ret, frame = cap.read()
    if not ret:
        print("Error: Video has no frames.")
        sys.exit(1)

    # Convert the first frame to grayscale and determine block sizes.
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    height, width = gray.shape
    block_height = height // grid_rows
    block_width = width // grid_cols

    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    group_frames = []
    output_lines = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        group_frames.append(gray)

        if len(group_frames) == frames_per_line:
            avg_frame = np.mean(group_frames, axis=0)
            line_str = ""

            for r in range(grid_rows):
                for c in range(grid_cols):
                    y1 = r * block_height
                    y2 = (r + 1) * block_height
                    x1 = c * block_width
                    x2 = (c + 1) * block_width
                    block = avg_frame[y1:y2, x1:x2]
                    avg_val = np.mean(block)

                    if avg_val >= 127:
                        line_str += "w"
                    else:
                        line_str += "b"
            output_lines.append(line_str)
            group_frames = []  # clear the group

    if group_frames:
        avg_frame = np.mean(group_frames, axis=0)
        line_str = ""
        for r in range(grid_rows):
            for c in range(grid_cols):
                y1 = r * block_height
                y2 = (r + 1) * block_height
                x1 = c * block_width
                x2 = (c + 1) * block_width
                block = avg_frame[y1:y2, x1:x2]
                avg_val = np.mean(block)
                if avg_val >= 127:
                    line_str += "w"
                else:
                    line_str += "b"
        output_lines.append(line_str)

    cap.release()

    with open(output_path, 'w') as f:
        for line in output_lines:
            f.write(line + "\n")
    print(f"Output written to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Converts a video into a b/w text representation. "
    )
    parser.add_argument("video_path", help="path to input video")
    parser.add_argument("output_path", help="path to output txt file")
    parser.add_argument("--frames_per_line", type=int, default=4,
                        help="number of frames averaged per output line (default: 4)")

    args = parser.parse_args()
    process_video(args.video_path, args.output_path,
                  frames_per_line=args.frames_per_line)
