import type { Product } from "../pages/HomePage/HomePage";

export async function fetchServices(query: string = ""): Promise<Product[]> {
  const url = query
    ? `/api/servers/?query=${encodeURIComponent(query)}`
    : "/api/servers/";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export async function fetchServiceById(id: string) {
  const response = await fetch(`/api/servers/${id}/`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}
