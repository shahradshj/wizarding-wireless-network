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

const dbPath = "./../movie-database/database.db"

func main() {
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Fatalf("Database file does not exist: %v", err)
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Printf("Error opening database: %v", err)
		log.Fatal(err)
	}
	defer db.Close()

	router := mux.NewRouter()

	router.HandleFunc("/movies", getMovies(db)).Methods("GET")
	router.HandleFunc("/series", getSeries(db)).Methods("GET")
	router.HandleFunc("/series/{series_id}", getSeriesEpisodes(db)).Methods("GET")
	router.HandleFunc("/video/{id}", getVideoFile(db)).Methods("GET")

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

func getMovies(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, year FROM movies")
		if err != nil {
			log.Printf("Error querying movies: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var movies []Movie
		for rows.Next() {
			var m Movie
			if err := rows.Scan(&m.ID, &m.Name, &m.Year); err != nil {
				log.Printf("Error scanning movie row: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			movies = append(movies, m)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(movies)
	}
}

func getSeries(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, start_year, end_year FROM series")
		if err != nil {
			log.Printf("Error querying series: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var series []Series
		for rows.Next() {
			var s Series
			if err := rows.Scan(&s.ID, &s.Name, &s.StartYear, &s.EndYear); err != nil {
				log.Printf("Error scanning series: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			series = append(series, s)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(series)
	}
}

func getSeriesEpisodes(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		seriesID := params["series_id"]

		row := db.QueryRow("SELECT id FROM series WHERE id = ?", seriesID)
		var s Series
		if err := row.Scan(&s.ID); err != nil {
			if err == sql.ErrNoRows {
				log.Printf("Error: Series not found: %v", err)
				http.Error(w, "Series not found", http.StatusNotFound)
				return
			} else {
				log.Printf("Error querying series: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		rows, err := db.Query("SELECT id, season, episode FROM episodes WHERE series_id = ?", seriesID)
		if err != nil {
			log.Printf("Error querying episodes: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var episodes []Episode
		for rows.Next() {
			var e Episode
			if err := rows.Scan(&e.ID, &e.Season, &e.Episode); err != nil {
				log.Printf("Error scanning episodes: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			episodes = append(episodes, e)
		}

		s.Episodes = episodes

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(s)
	}
}

func getVideoFile(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		videoID := params["id"]

		row := db.QueryRow("SELECT path FROM video_files WHERE id = ?", videoID)

		var path string
		if err := row.Scan(&path); err != nil {
			log.Printf("Error scanning video file: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Get the file info
		info, err := os.Stat(path)
		if err != nil {
			if os.IsNotExist(err) {
				log.Printf("Video file with ID: %s no longer exists at path: %s\n", videoID, path)
				http.Error(w, "The video file no longer exists", http.StatusInternalServerError)
			} else {
				log.Printf("Error getting file info: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		// Check if the path is a directory for series
		if info.IsDir() {
			http.Error(w, "Cannot download a series", http.StatusBadRequest)
			return
		}

		log.Printf("Serving video file with ID: %s at path: %s\n", videoID, path)
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filepath.Base(path)))
		http.ServeFile(w, r, path)
	}
}
