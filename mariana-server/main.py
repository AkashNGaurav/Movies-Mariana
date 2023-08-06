from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

MOVIE_DETAILS = []


def GetMovieDetails():

    if len(MOVIE_DETAILS) <= 0:

        with open("./static/index.json") as f:
            movie_data = json.load(f)
            print(movie_data)
            for i in movie_data:
                temp_movie = {}
                for movie in i["movies"]:
                    temp_movie["date"] = i["date"]
                    temp_movie["title"] = movie["title"]
                    temp_movie["poster"] = movie["poster"]
                    temp_movie["genre"] = movie["genre"]
                    temp_movie["rating"] = movie["imdb_rating"]
                    temp_movie["released_year"] = movie["year"]
                    temp_movie["runtime"] = movie["runtime"]

                    for m in movie["Ratings"]:
                        if m["source"] == "Metacritic":
                            temp_movie["metacritic"] = m["value"].split("/")[0]
                            break
                        else:
                            temp_movie["metacritic"] = ""

                MOVIE_DETAILS.append(temp_movie)
    return MOVIE_DETAILS


def GetGenreList(movie_list):
    genre_list = []
    for i in movie_list:
        for j in i["genre"]:
            if j not in genre_list:
                genre_list.append(j)
    
    return genre_list

@app.route("/", methods=["GET"])
def Homepage():
    return "hello world"


@app.route("/get-genre-list", methods=["GET"])
def GetGenres():
    movie_list = GetMovieDetails()
    genre_list = GetGenreList(movie_list)
    
    return genre_list

@app.route("/get-movie-details", methods=["GET"])
def GetMovies():

    return GetMovieDetails()


@app.route("/get-filter-genre", methods=["POST"])
def GetFilterGenres():
    movie_list = GetMovieDetails()
    print("request", dir(request))
    print("request2 ", request.args)
    print("request4 ", request.json)
    searchkeyword = request.json.get('genreName', '')
    # searchkeyword = searchkeyword.split(",")
    print("searchkeyword ", searchkeyword)

    search_resule = []
    if (searchkeyword) and (len(searchkeyword) > 0):
        
        for i in movie_list:
            for j in searchkeyword:
                if (j in i["genre"]) and (i not in search_resule):
                    search_resule.append(i)
                    continue
        
        return search_resule
    else:
        return movie_list
    

@app.route("/get-search_result", methods=["POST"])
def GetSearchResult():
    movie_list = GetMovieDetails()
    print("request", dir(request))
    print("request2 ", request.args)
    print("request4 ", request.json)
    searchkeyword = request.json.get('searchkeyword', '')
    # searchkeyword = searchkeyword.split(",")
    print("searchkeyword ", searchkeyword)

    search_resule = []
    if (searchkeyword) and (len(searchkeyword) > 0):
        
        for i in movie_list:
            if (searchkeyword.lower() in i["title"].lower()) and (i not in search_resule):
                search_resule.append(i)
                continue
        
        return search_resule
    else:
        return movie_list


if __name__ == "__main__":
    app.run()