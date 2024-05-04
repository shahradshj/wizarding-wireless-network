

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserName(userId) {
  console.log("Fetching user name for", userId);
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) {
    alert("UserId not found!");
    return "";
  }

  return (await response.json()).username;
}

export async function getUserId(userName) {
  console.log("Fetching user id for", userName);
  const response = await fetch(`${BASE_URL}/user/${userName}`);
  if (!response.ok) {
    alert("User not found!");
    return "";
  }
  return (await response.json()).id;
}

export async function addUser(userName) {
  console.log("Adding user", userName);
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
    console.log("Fetching series");
    const response = await fetch(`${BASE_URL}/series`);
    return response.json();
  } catch (error) {
    console.error("Error fetching series: ", error);
  }
}
