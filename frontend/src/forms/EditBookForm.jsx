import {
    useState,
    useEffect
} from "react";

import api from "../services/api";

import toast from "react-hot-toast";

function EditBookForm({
    book,
    onSuccess,
    onClose
}) {

    const [formData,
    setFormData] =
    useState({
        title: "",
        author: "",
        category: "",
        price: "",
        quantity: ""
    });

    useEffect(() => {

        if(book){

            setFormData({
                title:
                    book.title || "",
                author:
                    book.author || "",
                category:
                    book.category || "",
                price:
                    book.price || "",
                quantity:
                    book.quantity || ""
            });
        }

    }, [book]);

    const [loading,
    setLoading] =
    useState(false);

    const handleChange =
    (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response =
            await api.put(
                `/books/${book.id}`,
                formData
            );

            toast.success(
                response.data.message
            );

            onSuccess?.();
            onClose?.();

        } catch(error){

            toast.error(
                error.response?.data?.message
            );

        } finally{

            setLoading(false);
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="
                flex
                flex-col
                gap-4
            "
        >

            <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border p-3 rounded"
            />

            <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="border p-3 rounded"
            />

            <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border p-3 rounded"
            />

            <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="border p-3 rounded"
            />

            <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border p-3 rounded"
            />

            <button
                type="submit"
                disabled={loading}
                className="
                    bg-blue-600
                    text-white
                    py-3
                    rounded
                "
            >
                {
                    loading
                    ? "Saving..."
                    : "Update Book"
                }
            </button>

        </form>
    );
}

export default EditBookForm;