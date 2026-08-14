import pickle
import re
import nltk

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

# Download stopwords
nltk.download("stopwords")

# Load the trained files
cv = pickle.load(open("cv.pkl", "rb"))
model = pickle.load(open("model.pkl", "rb"))

# Same preprocessing used during training
stop_words = set(stopwords.words("english"))
ps = PorterStemmer()

# Genre mapping
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


def preprocess_text(text):

    # Remove non-alphabetic characters
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
    return " ".join(words)


# Get movie description from user
movie = input("\nEnter movie description: ")

# Preprocess
processed_text = preprocess_text(movie)

# Convert text into Bag-of-Words features
features = cv.transform([processed_text])

# Predict
prediction = model.predict(features)[0]

# Display result
print("\nPredicted Genre:", genre_mapping[int(prediction)])