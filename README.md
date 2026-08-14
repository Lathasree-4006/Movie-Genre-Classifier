**Movie Genre Classifier**

A machine learning web application that predicts the genre of a movie based on its description.

**Machine Learning Model**

The project uses Natural Language Processing and Machine Learning to classify movie descriptions into 9 genres.

**Technologies Used**

- Python
- NLTK
- Scikit-learn
- CountVectorizer
- Multinomial Naive Bayes
- Flask
- React
- Vite

**ML Pipeline**

Movie Description
↓
Text Cleaning
↓
Stopword Removal using NLTK
↓
Porter Stemming
↓
Bag of Words using CountVectorizer
↓
Multinomial Naive Bayes
↓
Predicted Genre

**Genres**

- Thriller
- Comedy
- Drama
- Action
- Sci-Fi
- Other
- Romance
- Horror
- Adventure

**The source code for building the model :-**

import numpy as np
import pandas as pd
import re
import nltk
import pickle

from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import resample

dataset = pd.read_csv("kaggle_movie_train.csv")
print(dataset.head())
print(dataset.isna().sum())

encode_genre = {
    "thriller": 0,
    "comedy": 1,
    "drama": 2,
    "action": 3,
    "sci-fi": 4,
    "other": 5,
    "romance": 6,
    "horror": 7,
    "adventure": 8
}

dataset["genre"] = dataset["genre"].map(encode_genre)
print(dataset["genre"].value_counts())

nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
ps = PorterStemmer()
corpus = []
for text in dataset["text"]:
    text = re.sub(
        r"[^a-zA-Z]",
        " ",
        text
    )
    text = text.lower()
    words = text.split()
    words = [
        word
        for word in words
        if word not in stop_words
    ]
    words = [
        ps.stem(word)
        for word in words
    ]
    text = " ".join(words)
    corpus.append(text)
dataset["clean_text"] = corpus

train_data, test_data = train_test_split(
    dataset,
    test_size=0.2,
    random_state=0,
    stratify=dataset["genre"]
)
print("Training samples:", len(train_data))
print("Testing samples:", len(test_data))

max_samples = train_data["genre"].value_counts().max()

balanced_parts = []

for genre in train_data["genre"].unique():

    genre_data = train_data[
        train_data["genre"] == genre
    ]

    genre_upsampled = resample(
        genre_data,
        replace=True,
        n_samples=max_samples,
        random_state=0
    )

    balanced_parts.append(genre_upsampled)


balanced_train = pd.concat(
    balanced_parts
)

balanced_train = balanced_train.sample(
    frac=1,
    random_state=0
).reset_index(drop=True)

print(
    balanced_train["genre"].value_counts()
)

cv = CountVectorizer(
    max_features=10000,
    ngram_range=(1, 2)
)

x_train = cv.fit_transform(
    balanced_train["clean_text"]
)

x_test = cv.transform(
    test_data["clean_text"]
)

y_train = balanced_train["genre"].values
y_test = test_data["genre"].values

classifier = MultinomialNB(
    alpha=0.1
)

classifier.fit(
    x_train,
    y_train
)

y_pred = classifier.predict(x_test)

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("Accuracy:", accuracy)

print(
    "Accuracy Percentage:",
    accuracy * 100,
    "%"
)

genre_names = [
    "Thriller",
    "Comedy",
    "Drama",
    "Action",
    "Sci-Fi",
    "Other",
    "Romance",
    "Horror",
    "Adventure"
]

print(
    classification_report(
        y_test,
        y_pred,
        target_names=genre_names,
        zero_division=0
    )
)

pickle.dump(
    cv,
    open("cv.pkl", "wb")
)

pickle.dump(
    classifier,
    open("model.pkl", "wb")
)

print("cv.pkl saved successfully!")
print("model.pkl saved successfully!")
