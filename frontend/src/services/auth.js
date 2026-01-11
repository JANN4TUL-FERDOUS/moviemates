import { jwtDecode } from "jwt-decode";

export const handleLogin = (res) => {
  const d = jwtDecode(res.credential);
  return {
    id: d.sub,
    name: d.name,
    avatar: d.picture,
  };
};
