package main

import (
	"database/sql"
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

type Movie struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Year int    `json:"year"`
}

type Series struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	StartYear int       `json:"start_year"`
	EndYear   int       `json:"end_year"`
	Episodes  []Episode `json:"episodes"`
}

type Episode struct {
	ID      string `json:"id"`
	Season  int    `json:"season"`
	Episode int    `json:"episode"`
}

type SeriesEpisode struct {
	ID        string `json:"id"`
	SeriesID  string `json:"series_id"`
	Name      string `json:"name"`
	StartYear int    `json:"start_year"`
	EndYear   int    `json:"end_year"`
	Season    int    `json:"season"`
	Episode   int    `json:"episode"`
}

const (
	dbPath     = "./../movie-database/database.db"
	serverPort = ":8080"
)

var db *sql.DB

func init() {
	var databasePath string
	if len(os.Args) > 1 {
		databasePath = os.Args[1]
	} else {
		databasePath = dbPath
	}

	if _, err := os.Stat(databasePath); os.IsNotExist(err) {
		log.Fatalf("Database file does not exist: %v", err)
	}

	dbConn, err := sql.Open("sqlite3", databasePath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	db = dbConn
}

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

func queryMovies() ([]Movie, error) {
	rows, err := db.Query("SELECT id, title, year FROM movies")
	if err != nil {
		return nil, fmt.Errorf("error querying movies: %v", err)
	}
	defer rows.Close()

	var movies []Movie
	for rows.Next() {
		var m Movie
		if err := rows.Scan(&m.ID, &m.Name, &m.Year); err != nil {
			return nil, fmt.Errorf("error scanning movie row: %v", err)
		}
		movies = append(movies, m)
	}
	return movies, nil
}

func queryMovie(movieId string) (Movie, error) {
	var movie Movie
	row := db.QueryRow("SELECT id, title, year FROM movies WHERE id = ?", movieId)

	if err := row.Scan(&movie.ID, &movie.Name, &movie.Year); err != nil {
		if err == sql.ErrNoRows {
			return Movie{}, fmt.Errorf("movie not found: %v", err)
		}
		return Movie{}, fmt.Errorf("error querying movie: %v", err)
	}
	return movie, nil
}

func querySeries() ([]Series, error) {
	rows, err := db.Query("SELECT id, title, start_year, end_year FROM series")
	if err != nil {
		return nil, fmt.Errorf("error querying series: %v", err)
	}
	defer rows.Close()

	var series []Series
	for rows.Next() {
		var s Series
		if err := rows.Scan(&s.ID, &s.Name, &s.StartYear, &s.EndYear); err != nil {
			return nil, fmt.Errorf("error scanning series: %v", err)
		}
		series = append(series, s)
	}
	return series, nil
}

func querySeriesByID(seriesID string) (Series, error) {
	var s Series
	row := db.QueryRow("SELECT id, title, start_year, end_year FROM series WHERE id = ?", seriesID)
	if err := row.Scan(&s.ID, &s.Name, &s.StartYear, &s.EndYear); err != nil {
		if err == sql.ErrNoRows {
			return Series{}, fmt.Errorf("series not found: %v", err)
		}
		return Series{}, fmt.Errorf("error querying series: %v", err)
	}
	return s, nil
}

func queryEpisodesBySeriesID(seriesID string) ([]Episode, error) {
	rows, err := db.Query("SELECT id, season, episode FROM episodes WHERE series_id = ?", seriesID)
	if err != nil {
		return nil, fmt.Errorf("error querying episodes: %v", err)
	}
	defer rows.Close()

	var episodes []Episode
	for rows.Next() {
		var e Episode
		if err := rows.Scan(&e.ID, &e.Season, &e.Episode); err != nil {
			return nil, fmt.Errorf("error scanning episodes: %v", err)
		}
		episodes = append(episodes, e)
	}
	return episodes, nil
}

func queryEpisodesById(episodeID string) (SeriesEpisode, error) {
	var episode SeriesEpisode
	row := db.QueryRow("SELECT id, season, episode, series_id FROM episodes WHERE id = ?", episodeID)
	if err := row.Scan(&episode.ID, &episode.Season, &episode.Episode, &episode.SeriesID); err != nil {
		return SeriesEpisode{}, fmt.Errorf("error scanning episode: %v", err)
	}
	row = db.QueryRow("SELECT title, start_year, end_year FROM series WHERE id = ?", episode.SeriesID)
	if err := row.Scan(&episode.Name, &episode.StartYear, &episode.EndYear); err != nil {
		return SeriesEpisode{}, fmt.Errorf("error scanning series: %v", err)
	}
	return episode, nil
}

func queryVideoFilePath(videoID string) (string, error) {
	var path string
	row := db.QueryRow("SELECT path FROM video_files WHERE id = ?", videoID)
	if err := row.Scan(&path); err != nil {
		return "", fmt.Errorf("error scanning video file: %v", err)
	}
	return path, nil
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
