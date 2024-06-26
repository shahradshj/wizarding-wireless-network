const CACHE_EXPIRATION_IN_SECONDS = 60 * 10; // 10 minutes

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserName(userId) {
  console.log("Fetching user name for", userId);
  return (await getUser(userId))?.username;
}

export async function getUserId(userName) {
  console.log("Fetching user id for", userName);
  return (await getUser(userName))?.id;
}

export async function getUser(user) {
  console.log("Fetching user for", user);
  const response = await fetch(`${BASE_URL}/users/${user}`);
  if (!response.ok) {
    alert("User not found!");
    return null;
  }
  return response.json();
}

export async function addUser(userName) {
  console.log("Adding user", userName);
  const response = await fetch(`${BASE_URL}/users/${userName}`, {
    method: "POST",
  });
  if (!response.ok) {
    alert("User already exists!");
    return null;
  }
  return response.text();
}

export async function getMovies() {
  try {
    console.log("Fetching movies");
    const response = await fetch(`${BASE_URL}/movies`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching movies: ", error);
    return null;
  }
}

export async function getSeries() {
  try {
    console.log("Fetching series");
    const response = await fetch(`${BASE_URL}/series`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching series: ", error);
    return null;
  }
}

export async function getSeriesById(id) {
  try {
    console.log("Fetching series by id", id);
    const response = await fetch(`${BASE_URL}/series/${id}`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching series by id: ", error);
    return null;
  }
}

export async function getWatchHistory(userId, videoId) {
  try {
    console.log("Fetching watch history for", userId, videoId);
    const response = await fetch(`${BASE_URL}/users/${userId}/${videoId}`, { cache: "no-store" });
    return parseInt(await response.text());
  } catch (error) {
    console.error("Error fetching watch history: ", error);
    return 0;
  }
}

export async function setWatchHistory(userId, videoId, time) {
  try {
    console.debug("Setting watch history for", userId, videoId, time);
    const response = await fetch(`${BASE_URL}/users/${userId}/${videoId}/${time}`, {
      method: "put",
    });
    return response.ok;
  } catch (error) {
    console.error("Error setting watch history: ", error);
    return false;
  }
}

export async function getVideoType(videoId) {
  try {
    console.log("Fetching video type for", videoId);
    const response = await fetch(`${BASE_URL}/type/${videoId}`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching video type: ", error);
    return null;
  }
}

export async function getFavorites(userId) {
  try {
    console.log("Fetching favorites for", userId);
    const response = await fetch(`${BASE_URL}/favorites/${userId}`, { cache: "no-store" });
    return response.json();
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    return null;
  }
}

export async function addFavorite(userId, videoId) {
  try {
    console.log("Adding favorite for", userId, videoId);
    const response = await fetch(`${BASE_URL}/favorites/${userId}/${videoId}`, {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    console.error("Error adding favorite: ", error);
    return false;
  }
}

export async function removeFavorite(userId, videoId) {
  try {
    console.log("Removing favorite for", userId, videoId);
    const response = await fetch(`${BASE_URL}/favorites/${userId}/${videoId}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error removing favorite: ", error);
    return false;
  }
}

export async function getGenres() {
  try {
    console.log("Fetching genres");
    const response = await fetch(`${BASE_URL}/genres`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching genres: ", error);
    return null;
  }
}

export async function getIdsByGenre(genre) {
  try {
    console.log("Fetching ids by genre", genre);
    const response = await fetch(`${BASE_URL}/genres/${genre}`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching ids by genre: ", error);
    return null;
  }
}

export async function getCollections() {
  try {
    console.log("Fetching collections");
    const response = await fetch(`${BASE_URL}/collections`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching collections: ", error);
    return null;
  }
}

export async function getSuggestions(userId) {
  try {
    console.log("Fetching suggestions for", userId);
    const response = await fetch(`${BASE_URL}/suggestions/${userId}`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching favorites: ", error);
    return null;
  }
}
