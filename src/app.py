# coding=utf-8
import os

from part3 import get_sentiment
from flask import Flask, render_template
from flask import request

app = Flask(__name__)


@app.route('/')
def hello_whale():
    #return "Whale, Hello there!"
    return render_template("blah-1.html")

@app.route('/blah')
def blah_yadda():
    return "Blah blah yadda yadda"


@app.route('/predict', methods=['GET', 'POST'])
def predict():

    if request.method == 'GET':
        theinput = request.args.get('input')
    else:
        #theinput = request.get_json(force=True)['input']
        #theinput = request.args.get('input')
       # theinput = request.form['input']
        return render_template('blah-1.html', result=get_sentiment(request.form['input']))

    if not theinput:
        return "No input value found"
    return get_sentiment(theinput)

@app.route('/sentiment-back', methods=['GET', 'POST'])
def sentiment_back():

    if request.method == 'GET':
        theinput = request.args.get('input')
    else:
        theinput = request.get_json(force=True)['input']

    if not theinput:
        return "No input value found"
    return get_sentiment(theinput)





if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, use_reloader=False, host='0.0.0.0', port=port)
