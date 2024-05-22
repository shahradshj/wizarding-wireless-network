# <p>Wizarding Wireless Network <img align="right" src="./readme-images/WWN.png" style="width:40px;" /> </p>

<!-- # Wizarding Wireless Network ![WWN Logo](WWN.png) -->

Welcome to the Wizarding Wireless Network project! This project aims to create a magical wireless network for wizards and witches to stream movies and series on your local network (similar to Plex for muggles). 

## Wizarding Wireless Network has 4 main parts:
- [Streaming API](#1-streaming-api): A RESTfull API written in GoLang for serving movies and series.
- [Frontend](#2-frontend): A React Web App for browsing and streaming movies and series from Streaming API.
- [movie-database](#3-movie-database): A Python script for adding new movies and series and managing the databse.
- [video-organizer](#4-video-organizer): Organizing Video files into appropriate folders.

To get started, organize your movies using video-organizer. Then create and populate the database using movie-database. Finally, start streaming-api and frontend react web app.

## 1. Streaming API

The Streaming API provides the following endpoints:

- `GET /movies`: Retrieves a list of all movies.
```jsonc
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

- `GET /movies/{movie_id}`: Retrieves details of the given movie.
```jsonc
{
    "id": "59aa8284d61e46ea82f3f1dbb2109f24",
    "name": "Harry Potter and the Deathly Hallows Part 1",
    "year": 2010,
    "size_in_bytes": 55781837360
}
```

- `GET /series`: Retrieves a list of all series.
```jsonc
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

- `GET /series/{series_id}`: Retrieves details of the given series and its episodes.
```jsonc
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

- `GET /videos/{id}`: Serves the video file for the given video.

- `GET /type/{id}`: Retrieves the type (movies, series, or episode) for the given id along side the movies, series, or episode itself.
```jsonc
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

- `GET /infos/{id}`: Retrieves the video information for the given id obtained and cached from OMDb.

- `GET /posters/{id}`: Retrieves the poster file for the given id. \
![poster for Harry Potter and the Deathly Hallows Part 1](./readme-images/HP-7-1.jpg)

- `GET /genres`: Retrieves a list of all genres.
```jsonc
[
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Documentary",
    "Sci-Fi",
    "Western"
]
```

- `GET /genres/{genre}`: Retrieves video IDs in the given genre. \
&nbsp;&nbsp;&nbsp;`GET /genres/History:`
```jsonc
[
    "0117ee3cb6e5474cb5082259a297087c",
    "0826d19548794e6eb90b1ae3b8e11dea",
    "11845d5a6a514e79ac121eadd2b2c4a0",
    "3ad54dd92bd343b889571399694c3352",
    "55d4686a42c8427c9b9fd6e9bc6b0ba0",
    "64f8c54c454844a9b902c7e8230da9e8",
    "7b1c0062d16442d99f0202a645a994fe",
    "7dcb79b0116a45659e6812ec7f5ba7d5",
    "8df110a9e7a14f9c971fc064ae8d858d",
    "ae939948e777442599d935bd215d5f51",
    "ae9bcb488e6847f3be00f70f0b34056b",
    "cd009e54593c40078db7bf38e75be79d",
    "cd0f47d7dbac4ac38bb74c16e074a67a",
    "d9db9679289d436e94f714a6df54ad6e"
]
```

- `GET /collections`: Retrieves a JSON of all collections, with list of video ids in each collection.
```jsonc
{
    // ...
    "Fantastic Beasts (2016 - 2021)": [
        "02b423ff22a647399e951cdf92476bc9",
        "11445ac35e5f41aeac7de3cf8f653d29",
        "2ec829e038354323935d98e55f4235a2"
    ],
    // ...
    "Harry Potter (2001 - 2011)": [
        "0a1ded975cd54ea690687287cd383e5d",
        "0ddf031d91844849bf318ea7c7250269",
        "2e23c3cb3745415cba3d49536cbe8e97",
        "330f128e02704e3489295909b9363d5f",
        "397cd904891242738b42bb98f9b9df93",
        "40b410c59bcd4e729ea5935bf22b1b92",
        "4112f9c11a2c4eefa23304d6b8b337ef",
        "48cfcf86868b45ca8aff49c9fa380249"
    ],
    // ...
    "The Lord of the Rings (2001 - 2003)": [
        "106e0c078dea4f0bac12ca0b88f9ec4d",
        "20cc5879a2f844d48ce831f933fb98f7",
        "2576a6dad7d44b55b52f9c4a759fdf03"
    ]
    // ...
}
```

- `GET /users/{userName}`: Retrieves the user ID for given userName.
```jsonc
{
    "id": "8ea57dc5a02e4b7f9b72fefff40e49f1",
    "username": "hermione"
}
```

- `POST /users/{userName}`: Adds a new user and returns user Id.

- `GET /users/{userId}/{videoId}`: Retrieves the watch history of a user for a video.

- `PUT /users/{userId}/{videoId}/{timestamps}`: Adds a new entry to the watch history of a user for a video.

- `GET /favorites/{userId}`: Retrieves favorite video ids for the given user.
```jsonc
[
    "48cfcf86868b45ca8aff49c9fa380249",
    "59aa8284d61e46ea82f3f1dbb2109f24",
    "ced70e42c0164c58b9ed755ade7a34df",
    "e1f660e391154a78ac8585d5f7c5e9dd",
    "f02a9103c80947e2ae09cb300759ef3e"
]
```

- `POST /favorites/{userId}/{videoId}`: Adds the video id to the user's favorites.

- `DELETE /favorites/{userId}/{videoId}`: Removes a video from the favorites for the user.

- `GET /suggestions/{userId}`: Retrieves video suggestions for a specific user.
```jsonc
[
    "00592122f7744ea6a9494952f9b9b332",
    "04fdeb6116d64f5894c5a9b65b871069",
    "12a0bf9156f042f78f4c719b37b1c20d",
    "2bbf403f74f349acbf9c48b1bbcc4b7e",
    "40f213c93e8d4e9da1ed0a2754cf099b"
]
```


### 2. Frontend
The frontend is a React web app that allows users to borwser movies and series from the backend (Streaming API): \
![Browsing before sing in](./readme-images/Browsing%20before%20sing%20in.gif)

By singing in, users can mark movies and series as favorites, and get suggestions. \
![User favorites](./readme-images/User%20favorites.gif)

It will also keep track of the last episode of each series that each user have watched, and the last timestamp of each video that they have watched. \
![Watch history](./readme-images/Watch%20history.gif)

## 3. movie-database
Movie database containes the scripts for creating the SQLite database for storing movies and series data, and populating its tables.
It also has an API for easier interation, but it is only ment to be used for when new movies or series are added:

- `GET /scan/{lookup?}`: It Scans the directory for movies and series for new entries and add them to the database. If the option lookup parameter is True, it will also get movies information via OMDb, and updates genres table accordingly. It will response with a JSON contaning counts of added entries.

- `GET /prune`: It Scans the directory for movies and series for missing entries and remove them from the database. It will response with a JSON of removed entries.

- `GET /scanForSuggestions`: For each user, it will get movies and series suggestions, based on the user favorites, from Open AI's GPT 3.5 model.


## 4. video-organizer
Video Organizer will organize movies and series in the given directory into appropiate directory structure by parsing video file's names.
