export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }
  return null;
};
