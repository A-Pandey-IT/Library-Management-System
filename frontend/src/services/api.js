import axios from "axios";

const api = axios.create({
    baseURL:
        "https://library-management-backend-ozvk.onrender.com"
});

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem(
                "token"
            );

        console.log("Token: ", token);

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

export default api;
