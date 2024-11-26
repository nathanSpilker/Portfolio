import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras import Input
from tensorflow.keras import ops
import tensorflow as tf
import sys
from tensorflow.keras import backend as K

inFile = open("inFile4Scaled.txt", "r")
outFile = open("outFile4Scaled.txt", "r")

inLine1 = inFile.readline()
outLine1 = outFile.readline()

inData = []
outData = []
ctr = 0
while inLine1 != "" and ctr < 5000000:
    inLine1.replace("\n", "")
    inLine1 = inLine1.split(", ")

    outLine1.replace("\n", "")
    outLine1 = outLine1.split(", ")
    for i in range(len(inLine1)):
        inLine1[i] = float(inLine1[i])
    for i in range(len(outLine1)):
        outLine1[i] = float(outLine1[i])
    inData.append(inLine1)
    outData.append(outLine1)

    inLine1 = inFile.readline()
    outLine1 = outFile.readline()
    ctr+=1

inDataArr = np.array(inData)
outDataArr = np.array(outData)


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


# # load the dataset
# dataset = loadtxt('pima-indians-diabetes.csv', delimiter=',')
# # split into input (X) and output (y) variables
# X = dataset[:,0:8]
# y = dataset[:,8]

# define the keras model
model = Sequential()
model.add(Input(shape=(57,)))
model.add(Dense(120, activation='elu'))
model.add(Dense(120, activation='elu'))
model.add(Dense(60, activation='elu'))
model.add(Dense(25, activation='elu'))
model.add(Dense(11, activation='tanh'))

# compile the keras model
optimizer = tf.keras.optimizers.Adam(0.0001)
model.compile(loss=my_loss_fn, optimizer=optimizer, metrics=['accuracy'])

# fit the keras model on the dataset
model.fit(inDataArr, outDataArr, epochs=25, batch_size=128)

model.save("bidModel4.keras")