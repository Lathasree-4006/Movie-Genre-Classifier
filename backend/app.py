from flask import Flask, request, jsonify
from flask_cors import CORS

import pickle
import re
import nltk

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


# ==========================================
# CREATE FLASK APPLICATION
# ==========================================

app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


# ==========================================
# LOAD YOUR TRAINED MODEL
# ==========================================

cv = pickle.load(open("cv.pkl", "rb"))
model = pickle.load(open("model.pkl", "rb"))


# ==========================================
# NLTK SETUP
# ==========================================

nltk.download("stopwords")

stop_words = set(stopwords.words("english"))

ps = PorterStemmer()


# ==========================================
# GENRE MAPPING
# ==========================================

genre_mapping = {
    0: "Thriller",
    1: "Comedy",
    2: "Drama",
    3: "Action",
    4: "Sci-Fi",
    5: "Other",
    6: "Romance",
    7: "Horror",
    8: "Adventure"
}


# ==========================================
# TEXT PREPROCESSING
# ==========================================

def preprocess_text(text):

    # Remove numbers and special characters
    text = re.sub(
        r"[^a-zA-Z]",
        " ",
        text
    )

    # Convert to lowercase
    text = text.lower()

    # Split into words
    words = text.split()

    # Remove stopwords
    words = [
        word
        for word in words
        if word not in stop_words
    ]

    # Apply stemming
    words = [
        ps.stem(word)
        for word in words
    ]

    # Join words
    text = " ".join(words)

    return text


# ==========================================
# HOME API
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "message": "Movie Genre Prediction API is running!"
    })


# ==========================================
# PREDICTION API
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON data sent from React
        data = request.get_json()

        # Get movie description
        movie_text = data.get("text", "")


        # Check if user entered anything
        if not movie_text.strip():

            return jsonify({
                "error": "Please enter a movie description."
            }), 400


        # ----------------------------------
        # STEP 1: PREPROCESS TEXT
        # ----------------------------------

        processed_text = preprocess_text(movie_text)


        # ----------------------------------
        # STEP 2: BAG OF WORDS
        # ----------------------------------

        features = cv.transform([
            processed_text
        ])


        # ----------------------------------
        # STEP 3: PREDICT GENRE
        # ----------------------------------

        prediction = model.predict(features)[0]


        # Convert number to genre name
        genre = genre_mapping[int(prediction)]


        # ----------------------------------
        # STEP 4: GET CONFIDENCE
        # ----------------------------------

        probabilities = model.predict_proba(features)[0]

        confidence = max(probabilities) * 100


        # ----------------------------------
        # SEND RESULT TO REACT
        # ----------------------------------

        return jsonify({

            "genre": genre,

            "confidence": round(
                float(confidence),
                2
            )

        })


    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ==========================================
# START FLASK SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )