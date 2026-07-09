function LoadingSpinner({

    text = "Loading..."

}) {

    return (

        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                py-12
            "
        >

            <div
                className="
                    w-12
                    h-12
                    border-4
                    border-gray-300
                    border-t-blue-600
                    rounded-full
                    animate-spin
                "
            />

            <p
                className="
                    mt-4
                    text-gray-600
                    dark:text-gray-300
                    text-lg
                "
            >

                {text}

            </p>

        </div>

    );

}

export default LoadingSpinner;