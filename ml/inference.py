import cv2
import numpy as np
from tflite_runtime.interpreter import Interpreter

MODEL_PATH = "ml/model.tflite"
LABELS_PATH = "ml/labels.txt"

def load_labels():
    with open(LABELS_PATH, "r") as f:
        return [line.strip() for line in f.readlines()]

labels = load_labels()

interpreter = Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

input_height = input_details[0]['shape'][1]
input_width = input_details[0]['shape'][2]

def classify_frame(frame):
    img = cv2.resize(frame, (input_width, input_height))
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)

    interpreter.set_tensor(input_details[0]['index'], img)
    interpreter.invoke()

    output = interpreter.get_tensor(output_details[0]['index'])[0]
    idx = int(np.argmax(output))

    return labels[idx], float(output[idx])
