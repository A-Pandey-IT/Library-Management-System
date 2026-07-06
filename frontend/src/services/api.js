import axios from "axios";

const api = axios.create({

    baseURL:
        "https://library-management-system-backend-0o4u.onrender.com"

});

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);

export default api;