

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function getUserId(userName) {
  console.log("Fetching user id", userName, BASE_URL);
  const response = await fetch(`${BASE_URL}/user/${userName}`);
  if (!response.ok) {
    alert("User not found!");
    return "";
  }
  return response.text();
}

export async function addUser(userName) {
  const response = await fetch(`${BASE_URL}/user/${userName}`, {
    method: "POST",
  });
  if (!response.ok) {
    alert("User already exists!");
    return "";
  }
  return response.text();
}

export async function getMovies() {
  try {
    console.log("Fetching movies");
    const response = await fetch(`${BASE_URL}/movies`);
    return response.json();
  } catch (error) {
    console.error("Error fetching movies: ", error);
  }
}

export async function getSeries() {
  try {
    const response = await fetch(`${BASE_URL}/series`);
    return response.json();
  } catch (error) {
    console.error("Error fetching series: ", error);
  }
}
