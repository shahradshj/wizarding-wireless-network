package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	_ "github.com/mattn/go-sqlite3"
)

const (
	dbPath     = "./../movie-database/database.db"
	postersDir = "./../movie-database/posters"
	serverPort = ":8080"
)

var postersMap = make(map[string]string)

func main() {
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/movies", getMovies).Methods("GET")
	router.HandleFunc("/movies/{movie_id}", getMovie).Methods("GET")
	router.HandleFunc("/series", getSeries).Methods("GET")
	router.HandleFunc("/series/{series_id}", getSeriesEpisodes).Methods("GET")
	router.HandleFunc("/videos/{id}", getVideoFile).Methods("GET")
	router.HandleFunc("/type/{id}", getVideoType).Methods("GET")
	router.HandleFunc("/infos/{id}", getVideoInfo).Methods("GET")
	router.HandleFunc("/posters/{id}", getPosterFile).Methods("GET")
	router.HandleFunc("/genres", getGenres).Methods("GET")
	router.HandleFunc("/genres/{genre}", getIdsByGenre).Methods("GET")
	router.HandleFunc("/users/{userName}", getUserId).Methods("GET")
	router.HandleFunc("/users/{userName}", addUser).Methods("POST")
	router.HandleFunc("/users/{userId}/{videoId}", getWatchHistory).Methods("GET")
	router.HandleFunc("/users/{userId}/{videoId}/{timestamps}", addWatchHistory).Methods("PUT")
	router.HandleFunc("/favorites/{userId}", getFavorites).Methods("GET")
	router.HandleFunc("/favorites/{userId}/{videoId}", addFavorite).Methods("POST")
	router.HandleFunc("/favorites/{userId}/{videoId}", deleteFavorite).Methods("DELETE")

	handler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "PUT", "POST", "DELETE"},
	}).Handler(router)

	log.Println("Reading posters directory")
	files, err := os.ReadDir(postersDir)
	if err != nil {
		log.Fatalf("Error reading posters directory: %v\n", err)
	}
	for _, file := range files {
		filenameWithExt := file.Name()
		extension := filepath.Ext(filenameWithExt)
		filename := filenameWithExt[0 : len(filenameWithExt)-len(extension)]
		postersMap[filename] = postersDir + "/" + file.Name()
	}

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

func getVideoType(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]
	log.Printf("Getting video type for: %s\n", videoID)

	var movie Movie
	var series Series
	var episode EpisodeWithSeriesName
	var videoType map[string]interface{}

	var err error

	movie, err = queryMovie(videoID)
	if err == nil {
		videoType = map[string]interface{}{
			"type":  "movie",
			"movie": movie,
		}
		respondWithJSON(w, videoType)
		return
	}

	series, err = querySeriesByID(videoID)
	if err == nil {
		videoType = map[string]interface{}{
			"type":   "series",
			"series": series,
		}
		respondWithJSON(w, videoType)
		return
	}

	episode, err = queryEpisodesById(videoID)
	if err == nil {
		videoType = map[string]interface{}{
			"type":    "episode",
			"episode": episode,
		}
		respondWithJSON(w, videoType)
		return
	}

	handleError(w, fmt.Errorf("video not found: %v", err))
}

func getPosterFile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]

	log.Printf("Getting poster file for: %s\n", videoID)
	if path, ok := postersMap[videoID]; ok {
		serveFile(w, r, path)
		return
	}

	serveFile(w, r, filepath.Join(postersDir, "default.jpg"))
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
	if strings.Contains(err.Error(), sql.ErrNoRows.Error()) {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func respondWithJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(data); err != nil {
		handleError(w, fmt.Errorf("error encoding JSON response: %v", err))
	}
}

func getUserId(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userName := params["userName"]
	log.Printf("Getting user id for: %s\n", userName)

	user, err := queryUser(userName)
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, user)
}

func addUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userName := params["userName"]
	log.Printf("Adding user: %s\n", userName)

	userID, err := insertUser(userName)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Write([]byte(userID))
}

func getWatchHistory(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userId"]
	videoID := params["videoId"]
	log.Printf("Getting watch history for: %s %s\n", userID, videoID)

	watchHistory, err := queryWatchHistory(userID, videoID)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Write([]byte(fmt.Sprintf("%d", watchHistory)))
}

func addWatchHistory(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userId"]
	videoID := params["videoId"]
	timestamp := params["timestamps"]
	log.Printf("Adding watch history for: %s %s %s\n", userID, videoID, timestamp)
	timestampInt, err := strconv.Atoi(timestamp)
	if err != nil {
		handleError(w, err)
		return
	}
	err = insertWatchHistory(userID, videoID, timestampInt)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Write([]byte("OK"))
}

func getFavorites(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userId"]
	log.Printf("Getting favorites for: %s\n", userID)

	favorites, err := queryFavorites(userID)
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, favorites)
}

func addFavorite(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userId"]
	videoID := params["videoId"]
	log.Printf("Adding favorite for: %s %s\n", userID, videoID)

	err := insertFavorite(userID, videoID)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Write([]byte("OK"))
}

func deleteFavorite(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["userId"]
	videoID := params["videoId"]
	log.Printf("Deleting favorite for: %s %s\n", userID, videoID)

	err := removeFavorite(userID, videoID)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Write([]byte("OK"))
}

func getVideoInfo(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	videoID := params["id"]
	log.Printf("Getting video info for: %s\n", videoID)

	info, err := queryInfos(videoID)
	if err != nil {
		handleError(w, err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(info))
}

func getGenres(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting genres")
	genres, err := queryGenres()
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, genres)
}

func getIdsByGenre(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	genre := params["genre"]
	log.Printf("Getting movies by genre: %s\n", genre)

	movies, err := queryIdsByGenre(genre)
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, movies)
}
