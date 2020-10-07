from flask import Flask, render_template, url_for, request, jsonify
import json
import urllib.request
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
# from time import time


app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/static')
def home_page_on_static():
    return render_template('index.html')


@app.route('/static/')
def home_page_on_static_slash():
    return render_template('index.html')


@app.route('/static/runRegression', methods=['POST'])
def printMyStuff():
    rf = request.data
    trainingSet = rf.decode()
    JSONData = json.loads(trainingSet)
    trainingX = np.array(JSONData['trainingX'])                            
    trainingY = np.array(JSONData['trainingY'])
    trainingX = trainingX.reshape(-1, 1)
    trainingY = trainingY.reshape(-1, 1)           # Y true
    model = LinearRegression()
    # t0 = time()
    model.fit(trainingX, trainingY)
    # t1 = time()
    # timetaken = t1-t0
    # print("Time taken = ", timetaken)
    y_pred = model.predict(trainingX)
    variance = mean_squared_error(trainingY, y_pred)
    print("Varience ", variance, "std ", variance**(1/2))
    fakereturnjson = {'coef':model.coef_[0][0], 'intercept':model.intercept_[0], 'variance': variance, 'standardDeviation': variance**(1/2)}
    resp = jsonify(fakereturnjson)
    resp.headers['Access-Control-Allow-Origin']='*'
    return resp
    

if __name__ == "__main__":
    app.run(debug=True)
