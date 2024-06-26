package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/google/uuid"
)

type Movie struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Year        int    `json:"year"`
	SizeInBytes int64  `json:"size_in_bytes"`
}

type Series struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	StartYear   int       `json:"start_year"`
	EndYear     int       `json:"end_year"`
	Episodes    []Episode `json:"episodes"`
	SizeInBytes int64     `json:"size_in_bytes"`
}

type Episode struct {
	ID          string `json:"id"`
	Season      int    `json:"season"`
	Episode     int    `json:"episode"`
	SizeInBytes int64  `json:"size_in_bytes"`
}

type EpisodeWithSeriesName struct {
	ID          string `json:"id"`
	SeriesID    string `json:"series_id"`
	Name        string `json:"name"`
	StartYear   int    `json:"start_year"`
	EndYear     int    `json:"end_year"`
	Season      int    `json:"season"`
	Episode     int    `json:"episode"`
	SizeInBytes int64  `json:"size_in_bytes"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

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

	dbConn, err := sql.Open("sqlite3", databasePath+"?_foreign_keys=on")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	db = dbConn
}

func queryMovies() ([]Movie, error) {
	rows, err := db.Query("SELECT id, title, year, sizeInBytes FROM movies ORDER BY title ASC")
	if err != nil {
		return nil, fmt.Errorf("error querying movies: %v", err)
	}
	defer rows.Close()

	var movies []Movie
	for rows.Next() {
		var m Movie
		if err := rows.Scan(&m.ID, &m.Name, &m.Year, &m.SizeInBytes); err != nil {
			return nil, fmt.Errorf("error scanning movie row: %v", err)
		}
		movies = append(movies, m)
	}
	return movies, nil
}

func queryMovie(movieId string) (Movie, error) {
	var movie Movie
	row := db.QueryRow("SELECT id, title, year, sizeInBytes FROM movies WHERE id = ?", movieId)

	if err := row.Scan(&movie.ID, &movie.Name, &movie.Year, &movie.SizeInBytes); err != nil {
		if err == sql.ErrNoRows {
			return Movie{}, fmt.Errorf("movie not found: %v", err)
		}
		return Movie{}, fmt.Errorf("error querying movie: %v", err)
	}
	return movie, nil
}

func querySeries() ([]Series, error) {
	rows, err := db.Query("SELECT id, title, start_year, end_year, sizeInBytes FROM series ORDER BY title ASC")
	if err != nil {
		return nil, fmt.Errorf("error querying series: %v", err)
	}
	defer rows.Close()

	var series []Series
	for rows.Next() {
		var s Series
		if err := rows.Scan(&s.ID, &s.Name, &s.StartYear, &s.EndYear, &s.SizeInBytes); err != nil {
			return nil, fmt.Errorf("error scanning series: %v", err)
		}
		series = append(series, s)
	}
	return series, nil
}

func querySeriesByID(seriesID string) (Series, error) {
	var s Series
	row := db.QueryRow("SELECT id, title, start_year, end_year, sizeInBytes FROM series WHERE id = ?", seriesID)
	if err := row.Scan(&s.ID, &s.Name, &s.StartYear, &s.EndYear, &s.SizeInBytes); err != nil {
		if err == sql.ErrNoRows {
			return Series{}, fmt.Errorf("series not found: %v", err)
		}
		return Series{}, fmt.Errorf("error querying series: %v", err)
	}
	return s, nil
}

func queryEpisodesBySeriesID(seriesID string) ([]Episode, error) {
	rows, err := db.Query("SELECT id, season, episode, sizeInBytes FROM episodes WHERE series_id = ? ORDER BY season, episode", seriesID)
	if err != nil {
		return nil, fmt.Errorf("error querying episodes: %v", err)
	}
	defer rows.Close()

	var episodes []Episode
	for rows.Next() {
		var e Episode
		if err := rows.Scan(&e.ID, &e.Season, &e.Episode, &e.SizeInBytes); err != nil {
			return nil, fmt.Errorf("error scanning episodes: %v", err)
		}
		episodes = append(episodes, e)
	}
	return episodes, nil
}

func queryEpisodesById(episodeID string) (EpisodeWithSeriesName, error) {
	var episode EpisodeWithSeriesName
	row := db.QueryRow("SELECT id, season, episode, series_id, sizeInBytes FROM episodes WHERE id = ?", episodeID)
	if err := row.Scan(&episode.ID, &episode.Season, &episode.Episode, &episode.SeriesID, &episode.SizeInBytes); err != nil {
		return EpisodeWithSeriesName{}, fmt.Errorf("error scanning episode: %v", err)
	}
	row = db.QueryRow("SELECT title, start_year, end_year FROM series WHERE id = ?", episode.SeriesID)
	if err := row.Scan(&episode.Name, &episode.StartYear, &episode.EndYear); err != nil {
		return EpisodeWithSeriesName{}, fmt.Errorf("error scanning series: %v", err)
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

func queryUser(userIdOrName string) (User, error) {
	var user User
	row := db.QueryRow("SELECT id, username FROM users WHERE username = ?", userIdOrName)
	if err := row.Scan(&user.ID, &user.Username); err != nil {
		if err = db.QueryRow("SELECT id, username FROM users WHERE id = ?", userIdOrName).Scan(&user.ID, &user.Username); err != nil {
			return user, fmt.Errorf("error scanning user: %v", err)
		}
	}
	return user, nil
}

func insertUser(username string) (string, error) {
	id := uuid.New().String()
	id = strings.Replace(id, "-", "", -1)
	_, err := db.Exec("INSERT INTO users (id, username) VALUES (?, ?);", id, username)
	if err != nil {
		return "", fmt.Errorf("error inserting user: %v", err)
	}
	return id, nil
}

func queryWatchHistory(userID, videoID string) (int, error) {
	var timestamp int
	row := db.QueryRow("SELECT timestamp FROM watch_history WHERE user_id = ? AND video_id = ?", userID, videoID)
	if err := row.Scan(&timestamp); err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, fmt.Errorf("error scanning watch history: %v", err)
	}
	return timestamp, nil
}

func insertWatchHistory(userID string, videoID string, timestamp int) error {
	_, err := db.Exec("INSERT or REPLACE INTO watch_history (user_id, video_id, timestamp) VALUES (?, ?, ?);", userID, videoID, timestamp)
	if err != nil {
		return fmt.Errorf("error inserting watch history: %v", err)
	}
	return nil
}

func insertFavorite(userID string, videoID string) error {
	_, err := db.Exec("INSERT INTO favorites (user_id, video_id) VALUES (?, ?);", userID, videoID)
	if err != nil {
		return fmt.Errorf("error adding favorite: %v", err)
	}
	return nil
}

func removeFavorite(userID string, videoID string) error {
	_, err := db.Exec("DELETE FROM favorites WHERE user_id = ? AND video_id = ?;", userID, videoID)
	if err != nil {
		return fmt.Errorf("error removing favorite: %v", err)
	}
	return nil
}

func queryFavorites(userID string) ([]string, error) {
	rows, err := db.Query("SELECT video_id FROM favorites WHERE user_id = ?", userID)
	if err != nil {
		return nil, fmt.Errorf("error getting favorites: %v", err)
	}
	defer rows.Close()

	favorites := []string{}
	for rows.Next() {
		var videoID string
		if err := rows.Scan(&videoID); err != nil {
			return nil, fmt.Errorf("error scanning favorites: %v", err)
		}
		favorites = append(favorites, videoID)
	}
	return favorites, nil
}

func queryInfos(videoId string) (string, error) {
	info := ""
	row := db.QueryRow("SELECT info FROM infos WHERE id = ?", videoId)
	if err := row.Scan(&info); err != nil {
		return "", fmt.Errorf("error scanning infos table: %v", err)
	}
	return info, nil
}

func queryGenres() ([]string, error) {
	rows, err := db.Query("SELECT DISTINCT genre FROM genres ORDER BY genre ASC")
	if err != nil {
		return nil, fmt.Errorf("error querying genres: %v", err)
	}
	defer rows.Close()

	genres := []string{}
	for rows.Next() {
		var genre string
		if err := rows.Scan(&genre); err != nil {
			return nil, fmt.Errorf("error scanning genre: %v", err)
		}
		genres = append(genres, genre)
	}
	return genres, nil
}

func queryIdsByGenre(genre string) ([]string, error) {
	rows, err := db.Query("SELECT id FROM genres WHERE genre = ?", genre)
	if err != nil {
		return nil, fmt.Errorf("error querying genre: %v", err)
	}
	defer rows.Close()

	ids := []string{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, fmt.Errorf("error scanning genre: %v", err)
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func queryCollections() (map[string][]string, error) {
	rows, err := db.Query("SELECT collection_title, id FROM collections ORDER BY collection_title ASC")
	if err != nil {
		return nil, fmt.Errorf("error querying collections: %v", err)
	}
	defer rows.Close()

	collections := make(map[string][]string)
	for rows.Next() {
		var title, id string
		if err := rows.Scan(&title, &id); err != nil {
			return nil, fmt.Errorf("error scanning collections: %v", err)
		}
		collections[title] = append(collections[title], id)
	}
	return collections, nil
}

func querySuggestionsForUser(userID string) ([]string, error) {
	rows, err := db.Query("SELECT video_id FROM suggestions WHERE user_id = ?", userID)
	if err != nil {
		return nil, fmt.Errorf("error querying suggestions: %v", err)
	}
	defer rows.Close()

	suggestions := []string{}
	for rows.Next() {
		var videoID string
		if err := rows.Scan(&videoID); err != nil {
			return nil, fmt.Errorf("error scanning suggestions: %v", err)
		}
		suggestions = append(suggestions, videoID)
	}
	return suggestions, nil
}
