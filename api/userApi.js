const API = import.meta.env.VITE_API_URL || "http://134.122.71.254:4000";

export const signupUser = async (data: any) => {
  const res = await fetch(`${API}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const signinUser = async (data: any) => {
  const res = await fetch(`${API}/api/users/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
};
