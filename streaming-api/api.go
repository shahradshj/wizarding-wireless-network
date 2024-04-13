package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"

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

const (
	dbPath     = "./movie-database/database.db"
	serverPort = ":8080"
)

var db *sql.DB

func init() {
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Fatalf("Database file does not exist: %v", err)
	}

	dbConn, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	db = dbConn
}

func main() {
	defer db.Close()

	router := mux.NewRouter()
	router.HandleFunc("/movies", getMovies).Methods("GET")
	router.HandleFunc("/series", getSeries).Methods("GET")
	router.HandleFunc("/series/{series_id}", getSeriesEpisodes).Methods("GET")
	router.HandleFunc("/video/{id}", getVideoFile).Methods("GET")

	log.Println("Server is running on http://localhost" + serverPort)
	log.Fatal(http.ListenAndServe(serverPort, router))
}

func getMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := queryMovies()
	if err != nil {
		handleError(w, err)
		return
	}
	respondWithJSON(w, movies)
}

func getSeries(w http.ResponseWriter, r *http.Request) {
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

	path, err := queryVideoFilePath(videoID)
	if err != nil {
		handleError(w, err)
		return
	}

	serveVideo(w, r, path)
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
	row := db.QueryRow("SELECT id FROM series WHERE id = ?", seriesID)
	if err := row.Scan(&s.ID); err != nil {
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

func queryVideoFilePath(videoID string) (string, error) {
	var path string
	row := db.QueryRow("SELECT path FROM video_files WHERE id = ?", videoID)
	if err := row.Scan(&path); err != nil {
		return "", fmt.Errorf("error scanning video file: %v", err)
	}
	return path, nil
}

func serveVideo(w http.ResponseWriter, r *http.Request, path string) {
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
