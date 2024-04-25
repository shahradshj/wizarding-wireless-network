package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	_ "github.com/mattn/go-sqlite3"
)

const (
	dbPath     = "./../movie-database/database.db"
	serverPort = ":8080"
)

func main() {
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/movies", getMovies).Methods("GET")
	router.HandleFunc("/movies/{movie_id}", getMovie).Methods("GET")
	router.HandleFunc("/series", getSeries).Methods("GET")
	router.HandleFunc("/series/{series_id}", getSeriesEpisodes).Methods("GET")
	router.HandleFunc("/video/{id}", getVideoFile).Methods("GET")
	router.HandleFunc("/info/{id}", getVideoInfo).Methods("GET")
	router.HandleFunc("/poster/{id}", getPosterFile).Methods("GET")

	handler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET"},
	}).Handler(router)

	log.Println("Server is running on http://localhost" + serverPort)
	log.Fatal(http.ListenAndServe(serverPort, handler))
}

func getMovies(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting movies")
	movies, err := queryMovies()
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, movies)
}

func getMovie(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)
	movieID := params["movie_id"]

	log.Printf("Getting movie: %s\n", movieID)

	movie, err := queryMovie(movieID)
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, movie)
}

func getSeries(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting series")
	series, err := querySeries()
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, series)
}

func getSeriesEpisodes(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	seriesID := params["series_id"]

	log.Printf("Getting series episodes for: %s\n", seriesID)

	series, err := querySeriesByID(seriesID)
	if err != nil {
		handleError(w, err)
		return
	}

	episodes, err := queryEpisodesBySeriesID(seriesID)
	if err != nil {
		handleError(w, err)
		return
	}

	series.Episodes = episodes
	respondWithJSON(w, series)
}

func getVideoFile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]
	log.Printf("Getting video file for: %s\n", videoID)

	path, err := queryVideoFilePath(videoID)
	if err != nil {
		handleError(w, err)
		return
	}

	serveFile(w, r, path)
}

func getVideoInfo(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]
	log.Printf("Getting video info for: %s\n", videoID)

	path, err := queryVideoFilePath(videoID)
	if err != nil {
		handleError(w, err)
		return
	}
	var info map[string]interface{}
	if strings.Contains(path, "Movies & Series\\Movies") {
		var movie, err = queryMovie(videoID)
		if err != nil {
			handleError(w, err)
			return
		}
		info = map[string]interface{}{"type": "movie", "movie": movie}
	} else if strings.Contains(path, "Movies & Series\\Series") {
		file, err := os.Stat(path)
		if err != nil {
			handleError(w, err)
			return
		}

		if file.IsDir() {
			var series, err = querySeriesByID(videoID)
			if err != nil {
				handleError(w, err)
				return
			}
			info = map[string]interface{}{"type": "series", "series": series}
		} else {
			var episode, err = queryEpisodesById(videoID)
			if err != nil {
				handleError(w, err)
				return
			}
			info = map[string]interface{}{"type": "episode", "episode": episode}
		}
	} else {
		info = map[string]interface{}{"type": "unknown"}
	}
	respondWithJSON(w, info)
}

func getPosterFile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]

	path, err := queryVideoFilePath(videoID)
	if err != nil {
		handleError(w, err)
		return
	}

	var posterPath string
	if strings.Contains(path, "Movies & Series\\Movies") {
		posterPath = filepath.Join("./../movie-database/posters", "movies.jpg")
	} else if strings.Contains(path, "Movies & Series\\Series") {
		posterPath = filepath.Join("./../movie-database/posters", "series.jpg")
	} else {
		posterPath = filepath.Join("./../movie-database/posters", "default.jpg")
	}
	log.Printf("Serving poster file for: %s %s %s\n", videoID, path, posterPath)
	serveFile(w, r, posterPath)
}

func serveFile(w http.ResponseWriter, r *http.Request, path string) {
	info, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			http.Error(w, "The video file no longer exists", http.StatusInternalServerError)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	if info.IsDir() {
		http.Error(w, "Cannot download a series", http.StatusBadRequest)
		return
	}

	log.Printf("Serving video file at path: %s\n", path)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filepath.Base(path)))
	http.ServeFile(w, r, path)
}

func handleError(w http.ResponseWriter, err error) {
	log.Printf("Error: %v\n", err)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func respondWithJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		handleError(w, fmt.Errorf("error encoding JSON response: %v", err))
	}
}
