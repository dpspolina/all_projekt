import easyocr
 
reader=easyocr.Reader(['ru'],gpu=False)   # Устанавливаем язык механизма OCR

import cv2
import os

for image_name in os.listdir("images"):
    # read image
    image = cv2.imread(f'images/{image_name}')
    results = reader.readtext(image)

    # draw rectangle on easyocr results
    for res in results:
        top_left = (int(res[0][0][0]), int(res[0][0][1])) # convert float to int
        bottom_right = (int(res[0][2][0]), int(res[0][2][1])) # convert float to int
        cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 3)
        print(res[1])
        # cv2.putText(image, res[1], (top_left[0], top_left[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 2)
    print('\n')
    # write image
    cv2.imwrite(f'output/{image_name}', image)