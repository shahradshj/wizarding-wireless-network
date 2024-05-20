# <p>Wizarding Wireless Network <img align="right" src="./readme-images/WWN.png" style="width:40px;" /> </p>

<!-- # Wizarding Wireless Network ![WWN Logo](WWN.png) -->

Welcome to the Wizarding Wireless Network project! This project aims to create a magical wireless network for wizards and witches to stream movies and series on your local network (similar to Plex for muggles).

### WWN has 4 main parts:
- [Streaming API](#1-streaming-api): A RESTfull API written in GoLang for serving movies and series.
- [Frontend](#2-frontend): A React Web App for browsing and streaming movies and series from Streaming API.
- [movie-databse](#3-movie-databse): A Python script for adding new movies and series and managing the databse.
- [video-organizer](#4-video-organizer): Organizing Video files into appropriate folders.

### 1. Streaming API

The Streaming API provides the following endpoints:

- `GET /movies`: Retrieves a list of all movies.
```json
[
    {
        "id": "2f7f23faebee4043a988cccdfca2b20d",
        "name": "A Beautiful Mind",
        "year": 2001,
        "size_in_bytes": 6976241981
    },
    // ...
    {
        "id": "93374fe6828941daa98f630a61db0e51",
        "name": "Dune",
        "year": 2021,
        "size_in_bytes": 24043351406
    },
    // ...
    {
        "id": "8df110a9e7a14f9c971fc064ae8d858d",
        "name": "Dunkirk",
        "year": 2017,
        "size_in_bytes": 4188651378
    },
    // ...
    {
        "id": "889c3ff7950e420ba36c93ec26c40c55",
        "name": "Harry Potter and the Prisoner of Azkaban",
        "year": 2004,
        "size_in_bytes": 12351526856
    },
    // ...
    {
        "id": "d3acbaa494a240b5a429c6c86ab22bae",
        "name": "Top Gun Maverick",
        "year": 2022,
        "size_in_bytes": 3836776566
    }
    // ...
]
```
- `GET /movies/{movie_id}`: Retrieves details of a specific movie.
```json
{
    "id": "59aa8284d61e46ea82f3f1dbb2109f24",
    "name": "Harry Potter and the Deathly Hallows Part 1",
    "year": 2010,
    "size_in_bytes": 55781837360
}
```
- `GET /series`: Retrieves a list of all series.
```json
[
    {
        "id": "e1f660e391154a78ac8585d5f7c5e9dd",
        "name": "Arcane",
        "start_year": 2021,
        "end_year": 0,
        "episodes": null,
        "size_in_bytes": 13206440240
    },
    // ...
    {
        "id": "ae9bcb488e6847f3be00f70f0b34056b",
        "name": "Chernobyl",
        "start_year": 2019,
        "end_year": 2019,
        "episodes": null,
        "size_in_bytes": 5250349231
    },
    {
        "id": "25e55b7b9e944882912fc6c27bf5056d",
        "name": "Clarkson's Farm",
        "start_year": 2021,
        "end_year": 0,
        "episodes": null,
        "size_in_bytes": 35566901447
    },
    // ...
    {
        "id": "00f61051e2134b1cbea03ef5cfae8bd4",
        "name": "House of the Dragon",
        "start_year": 2022,
        "end_year": 0,
        "episodes": null,
        "size_in_bytes": 14766565100
    },
    // ...
    {
        "id": "0c24d8ffc77c4ad5a9c65c22784b8681",
        "name": "Top Gear",
        "start_year": 2002,
        "end_year": 2022,
        "episodes": null,
        "size_in_bytes": 135497009367
    },
    // ...
]
```
- `GET /series/{series_id}`: Retrieves details of a specific series and its episodes.
```json
{
    "id": "b73ae3ca4f5543f689ef32a5442729da",
    "name": "The Grand Tour",
    "start_year": 2016,
    "end_year": 2025,
    "episodes": [
        {
            "id": "1d8f3e6686034408b968280e443661ce",
            "season": 1,
            "episode": 1,
            "size_in_bytes": 889915573
        },
        {
            "id": "93420c0bdd0f4569a8e777fd0b749248",
            "season": 1,
            "episode": 2,
            "size_in_bytes": 720701212
        },
        // ...
        {
            "id": "767d2cf907d04800bc240e774d31a200",
            "season": 1,
            "episode": 13,
            "size_in_bytes": 632477934
        },
        // ...
        {
            "id": "27428f01033244c0bc9752d73dd28f6f",
            "season": 5,
            "episode": 3,
            "size_in_bytes": 4308190527
        }
    ],
    "size_in_bytes": 65061479827
}
```
- `GET /videos/{id}`: Retrieves the video file for a specific video.
- `GET /type/{id}`: Retrieves the type (movies, series, or episode) for the given id along side the movies, series, or episode itself.
```json
// for a movie:
{
    "movie": {
        "id": "48cfcf86868b45ca8aff49c9fa380249",
        "name": "Harry Potter and the Prisoner of Azkaban",
        "year": 2004,
        "size_in_bytes": 68227950876
    },
    "type": "movie"
}
// for a series:
{
    "series": {
        "id": "b73ae3ca4f5543f689ef32a5442729da",
        "name": "The Grand Tour",
        "start_year": 2016,
        "end_year": 2025,
        "episodes": null,
        "size_in_bytes": 65061479827
    },
    "type": "series"
}
// for an episode
{
    "episode": {
        "id": "ce929aacb0f5463a9c2c242206bac135",
        "series_id": "e1f660e391154a78ac8585d5f7c5e9dd",
        "name": "Arcane",
        "start_year": 2021,
        "end_year": 0,
        "season": 1,
        "episode": 3,
        "size_in_bytes": 1699742229
    },
    "type": "episode"
}
```
- `GET /infos/{id}`: Retrieves the video information for a specific video obtained from OMDb.
- `GET /posters/{id}`: Retrieves the poster file for a specific video.
![poster for Harry Potter and the Deathly Hallows Part 1](./readme-images/HP-7-1.jpg)
- `GET /genres`: Retrieves a list of all genres.
- `GET /genres/{genre}`: Retrieves video IDs by genre.
- `GET /collections`: Retrieves a JSON of all collections, with list of video ids in each collection.
- `GET /users/{userName}`: Retrieves the user ID for given userName.
- `POST /users/{userName}`: Adds a new user.
- `GET /users/{userId}/{videoId}`: Retrieves the watch history of a user for a video.
- `PUT /users/{userId}/{videoId}/{timestamps}`: Adds a new entry to the watch history of a user for a video video.
- `GET /favorites/{userId}`: Retrieves the favorited video ids for a specific user.
- `POST /favorites/{userId}/{videoId}`: Adds a video id to the favorites for the user.
- `DELETE /favorites/{userId}/{videoId}`: Removes a video from the favorites for the user.
- `GET /suggestions/{userId}`: Retrieves video suggestions for a specific user.

### 2. Frontend


### 3. movie-databse
ahdjsdjk

### 4. video-organizer
ahdjsdjk
