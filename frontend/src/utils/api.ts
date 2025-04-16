export const api = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  const url = `https://postmatic.onrender.com/api${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
