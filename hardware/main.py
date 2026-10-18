import cv2
import time
from gpiozero import DistanceSensor

from ml.inference import classify_frame
from hardware.servo_control import dump_paper, dump_plastic
from backend.firebase_handler import update_bin_count

ultrasonic = DistanceSensor(echo=15, trigger=14, max_distance=0.5)

paper_count = 0
plastic_count = 0

print("SMART BIN SYSTEM STARTED")

cap = cv2.VideoCapture(0)

try:
    while True:
        distance = ultrasonic.distance * 100  # cm

        if distance < 12: 
            print("Object detected")

            ret, frame = cap.read()
            if not ret:
                continue

            label, confidence = classify_frame(frame)
            print(f"Detected: {label} ({confidence:.2f})")

            if confidence < 0.6:
                print("Low confidence – ignoring")
                time.sleep(2)
                continue

            if label.lower() == "paper":
                paper_count += 1
                dump_paper()
                update_bin_count("paper", paper_count)

            elif label.lower() == "plastic":
                plastic_count += 1
                dump_plastic()
                update_bin_count("plastic", plastic_count)

            time.sleep(2)

        time.sleep(0.1)

except KeyboardInterrupt:
    print("Stopping system")

finally:
    cap.release()
