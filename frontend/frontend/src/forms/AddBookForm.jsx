import { useState } from "react";
import api from "../services/api";

function AddBookForm({
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

            if (!formData.title.trim()) {
                alert("Title is required");
                return;
            }

            if (!formData.author.trim()) {
                alert("Author is required");
                return;
            }

            if (!formData.category.trim()) {
                alert("Category is required");
                return;
            }

            try {

                setLoading(true);

                const response =
                    await api.post(
                        "/books",
                        {
                            ...formData,
                            price:
                                Number(
                                    formData.price
                                ),
                            quantity:
                                Number(
                                    formData.quantity
                                )
                        }
                    );

                alert(
                    response.data.message ||
                    "Book added successfully"
                );

                onSuccess?.();

                onClose?.();

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to add book"
                );

            } finally {

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
                type="text"
                name="title"
                placeholder="Book Title"
                value={formData.title}
                onChange={handleChange}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="
                    border
                    p-3
                    rounded

                    dark:bg-gray-700
                    dark:border-gray-600
                "
            />

            <button
                type="submit"
                disabled={loading}
                className="
                    bg-green-600
                    text-white
                    py-3
                    rounded

                    hover:bg-green-700
                    disabled:bg-gray-400
                "
            >
                {
                    loading
                        ? "Saving..."
                        : "Add Book"
                }
            </button>

        </form>
    );
}

export default AddBookForm;