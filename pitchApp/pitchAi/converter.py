from tensorflow import lite
import tensorflow as tf
import numpy as np
from tensorflow import keras


def my_loss_fn(y_true, y_pred):

    indArr = tf.cast((y_true != 0), dtype=tf.float32)
    y_true = y_true * indArr
    y_pred = y_pred * indArr

    error = y_true - y_pred

    sqr_error = K.square(error)
    #mean of the square of the error
    mean_sqr_error = K.mean(sqr_error)
    #square root of the mean of the square of the error
    sqrt_mean_sqr_error = K.sqrt(mean_sqr_error)
    #return the error
    return sqrt_mean_sqr_error

optimizer = tf.keras.optimizers.Adam(0.0001)
new_model = tf.keras.models.load_model('bidModel3.keras', compile=False)
new_model.compile(optimizer = optimizer, loss = my_loss_fn, metrics = ['accuracy'])
new_model.export("test", "tf_saved_model")  # replace tf.saved_model.save with this line
converter = tf.lite.TFLiteConverter.from_saved_model("test")
tflite_model = converter.convert()
with open("bidModel.tflite", "wb") as f:
    f.write(tflite_model)