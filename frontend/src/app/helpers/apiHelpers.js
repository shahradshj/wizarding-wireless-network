export async function getUserId(userName) {
  const response = await fetch(`/api/user/${userName}`);
  if (!response.ok) {
    alert("User not found!");
    return "";
  }
  return await response.text();
}

export async function addUser(userName) {
  const response = await fetch(`/api/user/${userName}`, {
    method: "POST",
  });
  if (!response.ok) {
    alert("User already exists!");
    return "";
  }
  return await response.text();
}

export async function getMovies() {
  try {
    console.log("Fetching movies");
    const response = await fetch(`/api/movies`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movies: ", error);
  }
}

export async function getSeries() {
  try {
    const response = await fetch(`/api/series`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching series: ", error);
  }
}
