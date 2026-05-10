import { getIdToken } from "../firebase";

const API_BASE_URL = import.meta.env.PROD 
  ? "https://portfolio-backend-565603794256.asia-southeast1.run.app" 
  : "";

const jsonHeaders = {
  "Content-Type": "application/json"
};

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  
  // Attach Firebase ID Token
  const token = await getIdToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      // Keep the generic message when the response is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function listConfigs() {
  return request("/api/configs");
}

export function createConfig(payload) {
  return request("/api/configs", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
}

export function getConfig(configId) {
  return request(`/api/configs/${configId}`);
}

export function updateConfig(configId, payload) {
  return request(`/api/configs/${configId}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
}

export function deleteConfig(configId) {
  return request(`/api/configs/${configId}`, {
    method: "DELETE"
  });
}

export function saveVersion(configId, payload) {
  return request(`/api/configs/${configId}/versions`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
}

export function listVersions(configId) {
  return request(`/api/configs/${configId}/versions`);
}

export function restoreVersion(configId, versionId) {
  return request(`/api/configs/${configId}/versions/${versionId}/restore`, {
    method: "POST"
  });
}

export function publishPortfolio(configId, payload) {
  return request(`/api/configs/${configId}/publish`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });
}
