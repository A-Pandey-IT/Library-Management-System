import { FaTimes } from "react-icons/fa";

function Modal({
    isOpen,
    title,
    onClose,
    children
}) {

    if (!isOpen) {
        return null;
    }

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50
                flex
                items-center
                justify-center
                z-50
            "
            onClick={onClose}
        >

            <div
                className="
                    w-full
                    max-w-lg
                    bg-white
                    dark:bg-gray-800
                    dark:text-white
                    rounded-xl
                    shadow-lg
                    mt-15
                    p-6
                    relative
                "
                onClick={(e) => e.stopPropagation()}
            >

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-5
                    "
                >

                    <h2
                        className="
                            text-xl
                            font-bold
                        "
                    >
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FaTimes 
                            className="
                                text-xl
                                p-1
                                rounded-full
                                cursor-pointer
                                hover:border
                            "
                        />
                    </button>

                </div>

                {children}

            </div>

        </div>
    );
}

export default Modal;