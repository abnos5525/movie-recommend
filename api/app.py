import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

def load_data():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    ratings_path = os.path.join(base_dir, 'data', 'movies_data.txt')
    movies_path = os.path.join(base_dir, 'data', 'movies_item.txt')
    
    # Check if files exist
    if not (os.path.exists(ratings_path) and os.path.exists(movies_path)):
        raise FileNotFoundError("Data files not found. Check paths: %s and %s" % (ratings_path, movies_path))
    
    ratings = pd.read_csv(ratings_path, sep='\t', names=['user_id', 'movie_id', 'rating'], usecols=[0, 1, 2])
    movies = pd.read_csv(movies_path, sep='|', names=['movie_id', 'title'], usecols=[0, 1])
    merged_data = pd.merge(movies, ratings)
    return merged_data

def get_movie_stats():
    data = load_data()
    return (
        data.groupby('title')
        .agg(rating_count=('rating', 'size'), rating_mean=('rating', 'mean'))
        .reset_index()
    )

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        movie_name = request.json.get('movie', '').strip()
        if not movie_name:
            return jsonify({"error": "Movie name is required"}), 400

        data = load_data()
        movie_stats = get_movie_stats()
        
        # Create user-movie matrix
        user_movie_matrix = data.pivot_table(index='user_id', columns='title', values='rating')
        
        # Find exact or partial match
        matching_movies = [col for col in user_movie_matrix.columns 
                         if movie_name.lower() in col.lower()]
        
        if not matching_movies:
            return jsonify({"error": "Movie not found"}), 404
            
        # Use the first matching movie for recommendations
        target_movie = matching_movies[0]
        movie_ratings = user_movie_matrix[target_movie]
        
        # Calculate correlations
        correlations = user_movie_matrix.corrwith(movie_ratings).dropna()
        correlation_df = pd.DataFrame({'correlation': correlations})
        
        # Filter popular movies
        popular_movies = movie_stats.query('rating_count >= 100')
        
        # Combine data and sort by correlation
        result = (
            pd.merge(popular_movies, correlation_df, on='title')
            .sort_values('correlation', ascending=False)
            .head(10)
        )
        
        return jsonify(result.to_dict(orient='records'))
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        print("Server failed to start:", str(e))