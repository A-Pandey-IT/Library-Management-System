import { useState } from "react";
import api from "../services/api";

function AddAdminForm({

    onClose,

    onSuccess

}) {

    const [formData, setFormData] = useState({

        username: "",

        password: "",

        role: "ADMIN"

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(

                "/admin/register",

                formData

            );

            alert("Admin created.");

            onSuccess?.();

            onClose?.();

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed."

            );

        }

    };

    return (

        <form

            onSubmit={handleSubmit}

            className="flex flex-col gap-4"

        >

            <input

                name="username"

                placeholder="Username"

                onChange={handleChange}

                required

            />

            <input

                name="password"

                type="password"

                placeholder="Password"

                onChange={handleChange}

                required

            />

            <select

                name="role"

                onChange={handleChange}

            >

                <option value="ADMIN">

                    Admin

                </option>

                <option value="LIBRARIAN">

                    Librarian

                </option>

            </select>

            <button

                className="bg-green-600 text-white p-3 rounded"

            >

                Create

            </button>

        </form>

    );

}

export default AddAdminForm;