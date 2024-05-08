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
  const response = await fetch(`${BASE_URL}/user/${user}`);
  if (!response.ok) {
    alert("User not found!");
    return null;
  }
  return response.json();
}

export async function addUser(userName) {
  console.log("Adding user", userName);
  const response = await fetch(`${BASE_URL}/user/${userName}`, {
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
    const response = await fetch(`${BASE_URL}/user/${userId}/${videoId}`, { cache: "no-store" });
    return parseInt(await response.text());
  } catch (error) {
    console.error("Error fetching watch history: ", error);
    return 0;
  }
}

export async function setWatchHistory(userId, videoId, time) {
  try {
    console.debug("Setting watch history for", userId, videoId, time);
    const response = await fetch(`${BASE_URL}/user/${userId}/${videoId}/${time}`, {
      method: "put",
    });
    return response.ok;
  } catch (error) {
    console.error("Error setting watch history: ", error);
    return false;
  }
}

export async function getVideoInfo(videoId) {
  try {
    console.log("Fetching video info for", videoId);
    const response = await fetch(`${BASE_URL}/info/${videoId}`, { next: { revalidate: CACHE_EXPIRATION_IN_SECONDS } });
    return response.json();
  } catch (error) {
    console.error("Error fetching video info: ", error);
    return null;
  }
}
