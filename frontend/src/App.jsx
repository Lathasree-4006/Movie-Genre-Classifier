import { useState } from "react";
import {
  Film,
  Sparkles,
  Brain,
  BarChart3,
  ArrowRight,
  Play,
  RotateCcw
} from "lucide-react";

import "./App.css";


function App() {

  const [movieText, setMovieText] = useState("");
  const [genre, setGenre] = useState("");
  const [confidence, setConfidence] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const predictGenre = async () => {

    if (!movieText.trim()) {

      setError("Please enter a movie description first.");

      return;
    }


    setLoading(true);
    setError("");
    setGenre("");
    setConfidence(null);


    try {

      const response = await fetch(
        "https://movie-genre-classifier-0e3r.onrender.com/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            text: movieText
          })
        }
      );
      
      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.error || "Prediction failed"
        );

      }


      setGenre(data.genre);
      setConfidence(data.confidence);

    }

    catch (error) {

      console.error(error);

      setError(
        "Unable to connect to the prediction server. Make sure Flask is running."
      );

    }

    finally {

      setLoading(false);

    }

  };


  const clearPrediction = () => {

    setMovieText("");
    setGenre("");
    setConfidence(null);
    setError("");

  };


  return (

    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">

          <img
            src="/GenreSense.png"
            alt="Genre Sense logo"
            className="brand-logo"
          />

          <span>Genre Sense</span>

        </div>


        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#predict">Predict</a>

          <a href="#how-it-works">How It Works</a>

          <a href="#about">About</a>

        </div>


        <a
          href="#predict"
          className="nav-button"
        >
          Try Now
          <ArrowRight size={16} />
        </a>

      </nav>


      {/* HERO */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-glow"></div>


        <div className="hero-content">

          <div className="badge">

            <Sparkles size={15} />

            AI-POWERED MOVIE CLASSIFICATION

          </div>


          <h1>

            Discover the genre

            <br />

            behind every

            <span> story.</span>

          </h1>


          <p>

            Let machine learning analyze your movie plot
            and instantly predict its most likely genre.

          </p>


          <div className="hero-buttons">

            <a
              href="#predict"
              className="primary-button"
            >

              Predict Movie Genre

              <ArrowRight size={18} />

            </a>


            <a
              href="#how-it-works"
              className="secondary-button"
            >

              <Play size={17} />

              How it works

            </a>

          </div>


          <div className="hero-stats">

            <div>

              <strong>9</strong>

              <span>Genres</span>

            </div>


            <div>

              <strong>10K+</strong>

              <span>Features</span>

            </div>


            <div>

              <strong>AI</strong>

              <span>Powered</span>

            </div>

          </div>

        </div>

        <div className="hero-visual" aria-label="Genre prediction preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
          </div>
        </div>



      </section>


      {/* PREDICTION */}

      <section
        className="predict-section"
        id="predict"
      >

        <div className="section-title">

          <span>AI PREDICTION</span>

          <h2>
            What genre is your movie?
          </h2>

          <p>
            Give us the story. We'll find the genre.
          </p>

        </div>


        <div className="prediction-container">


          <div className="input-card">

            <div className="card-header">

              <div>

                <h3>Movie Description</h3>

                <p>
                  Describe the plot of your movie
                </p>

              </div>

              <Film size={25} />

            </div>


            <textarea

              value={movieText}

              onChange={(e) =>
                setMovieText(e.target.value)
              }

              placeholder="Example: A detective investigates a mysterious murder that leads him into a dangerous criminal organization..."

            />


            <div className="character-count">

              {movieText.length} characters

            </div>


            {error && (

              <div className="error-message">

                {error}

              </div>

            )}


            <div className="action-buttons">

              <button

                className="predict-btn"

                onClick={predictGenre}

                disabled={loading}

              >

                {loading
                  ? "Analyzing..."
                  : "Predict Genre"
                }

                {!loading && (
                  <Sparkles size={18} />
                )}

              </button>


              <button

                className="clear-btn"

                onClick={clearPrediction}

              >

                <RotateCcw size={17} />

                Clear

              </button>

            </div>

          </div>


          {/* RESULT */}

          <div className="result-card">

            {!genre ? (

              <div className="empty-result">

                <div className="result-icon">

                  <Brain size={35} />

                </div>

                <h3>
                  Your prediction will appear here
                </h3>

                <p>
                  Enter a movie description and
                  let our AI classify its genre.
                </p>

              </div>

            ) : (

              <div className="prediction-result">

                <div className="result-icon success">

                  <Sparkles size={35} />

                </div>


                <span className="result-label">
                  PREDICTED GENRE
                </span>


                <h2>
                  {genre}
                </h2>


                {confidence !== null && (

                  <div className="confidence-box">

                    <div className="confidence-header">

                      <span>
                        Model Confidence
                      </span>

                      <strong>
                        {confidence}%
                      </strong>

                    </div>


                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${confidence}%`
                        }}
                      />

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-title">

          <span>HOW IT WORKS</span>

          <h2>
            From story to genre in seconds.
          </h2>

          <p>
            A simple machine learning pipeline powers
            every prediction.
          </p>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <Film />

            <h3>
              Enter your story
            </h3>

            <p>
              Describe the plot or storyline of your movie.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <Brain />

            <h3>
              AI analyzes it
            </h3>

            <p>
              Text is processed using NLP and
              Bag-of-Words features.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <BarChart3 />

            <h3>
              Genre predicted
            </h3>

            <p>
              Multinomial Naive Bayes predicts the
              most likely movie genre.
            </p>

          </div>

        </div>

      </section>


      {/* ABOUT */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <span>ABOUT THE PROJECT</span>

          <h2>
            Machine learning meets storytelling.
          </h2>

          <p>

            Genre Sense is a Natural Language Processing
            project that classifies movies based on
            their plot descriptions.

          </p>

          <p>

            The system uses text preprocessing,
            stemming, Bag-of-Words feature extraction,
            and a Multinomial Naive Bayes classifier.

          </p>

        </div>


        <div className="tech-grid">

          <div className="tech-card">

            <span>01</span>

            <h3>Python</h3>

            <p>
              Model development
            </p>

          </div>


          <div className="tech-card">

            <span>02</span>

            <h3>NLTK</h3>

            <p>
              Text preprocessing
            </p>

          </div>


          <div className="tech-card">

            <span>03</span>

            <h3>Naive Bayes</h3>

            <p>
              Classification model
            </p>

          </div>


          <div className="tech-card">

            <span>04</span>

            <h3>React</h3>

            <p>
              Interactive interface
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer>

        <div className="footer-logo">

          <Film size={20} />

          Genre<span>Sense</span>

        </div>


        <p>
          AI-powered movie genre classification
        </p>

      </footer>

    </div>

  );

}


export default App;
