from nltk import download

download('punkt')
download('stopwords')

from nltk.corpus import stopwords
from string import punctuation

stopwords_eng = stopwords.words('english')

def extract_features(words):
    return [w.lower() for w in words if w not in stopwords_eng and w not in punctuation]

def bag_of_words(words):
    bag = {}
    for w in words:
        bag[w] = bag.get(w,0)+1
    return bag

import pickle
import sys

if not 'google.colab' in sys.modules:
    model_file = open('resources/sa_classifier.pickle', 'rb')
    model = pickle.load(model_file)
    model_file.close()

from nltk.tokenize import word_tokenize

def get_sentiment(review):
    #words = word_tokenize(review)
    words = extract_features(review)
    words = bag_of_words(words)
    return model.classify(words)
