from gpiozero import Servo
from time import sleep

SERVO_PIN = 18

SERVO_CENTER = 0.0
SERVO_PAPER = -0.7     # tilt left 
SERVO_PLASTIC = 0.7   # tilt right

servo = Servo(SERVO_PIN)

def move_to_center():
    servo.value = SERVO_CENTER
    sleep(0.5)

def dump_paper():
    servo.value = SERVO_PAPER
    sleep(1.0)
    move_to_center()

def dump_plastic():
    servo.value = SERVO_PLASTIC
    sleep(1.0)
    move_to_center()
