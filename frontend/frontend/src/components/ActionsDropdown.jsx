import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

function ActionsDropdown({
    actions = []
}) {

    const [open, setOpen] =
        useState(false);

    const dropdownRef =
        useRef(null);

    useEffect(() => {

        const handleClickOutside =
            (event) => {

                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(
                        event.target
                    )
                ) {
                    setOpen(false);
                }
            };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    return (

        <div
            ref={dropdownRef}
            className="
                relative
                inline-block
            "
        >

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="
                    bg-gradient-to-r
                    from-blue-400
                    to-cyan-500
                    dark:from-cyan-700
                     dark:to-cyan-900
                    text-white
                    px-3
                    py-1
                    rounded
                    cursor-pointer
                "
            >
                Actions ▼
            </button>

            {
                open && (

                    <div
                        className="
                            absolute
                            right-0
                            mt-2
                            w-48
                            bg-white
                            dark:bg-gray-800
                            border
                            dark:border-gray-700
                            dark:border-b
                            rounded-lg
                            shadow-lg
                            z-50
                        "
                    >

                        <div
                            className="
                                flex
                                justify-end
                                p-2
                                border-b
                                dark:border-gray-700
                            "
                        >

                            <button
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {
                            actions.map(
                                (
                                    action,
                                    index
                                ) => (

                                    <button
                                        key={index}
                                        onClick={() => {

                                            action.onClick();

                                            setOpen(false);
                                        }}
                                        className="
                                            block
                                            w-full
                                            text-left
                                            px-4
                                            py-2
                                            hover:bg-gray-100
                                            dark:hover:bg-gray-700
                                        "
                                    >
                                        {
                                            action.label
                                        }
                                    </button>
                                )
                            )
                        }

                    </div>
                )
            }

        </div>
    );
}

export default ActionsDropdown;