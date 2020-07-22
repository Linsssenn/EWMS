export default function fetchApi({ endpoint, options }) {
  return new Promise((resolve, reject) =>
    fetch(`/api/v1${endpoint}`, options)
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "fail" || json.status === "error") {
          reject(json);
        } else {
          resolve(json);
        }
      })
      .catch((error) => {
        reject(error);
      })
  );
}
