import os

from part3 import get_sentiment
from flask import Flask
from flask import request
#from flask_cors import CORS, cross_origin
import datetime

app = Flask(__name__)
#cors = CORS(app, resources={r"/*": {"origins": "*"}})

retval ='sentiment_demo_1'
retval = retval + '<br>' + datetime.datetime.now().replace(microsecond=0).isoformat(' ')
retval = retval + '<br>' + '<br>'

@app.route('/')
def hello_whale():
    return retval + 'Whale, Hello there!'

@app.route('/blah')
def blah_yadda():
    return retval + 'Blah blah yadda yadda'

@app.route('/predict', methods = ['GET', 'POST'])
def predict():
    if request.method == 'GET':
        input = request.args.get('input')
    else:
        input = request.get_json(force=True)['input']
    if not input:
        return 'No input value found'
    return retval + get_sentiment(input)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, use_reloader=False, host='0.0.0.0', port=port)
