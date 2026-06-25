function PurchaseDetails({
    purchase
}) {

    if (!purchase) {
        return (
            <p>
                No purchase selected
            </p>
        );
    }

    return (

        <div className="space-y-3">

            <p>
                <strong>ID:</strong>
                {" "}
                {purchase.id}
            </p>

            <p>
                <strong>Student:</strong>
                {" "}
                {purchase.student_name}
            </p>

            <p>
                <strong>Book:</strong>
                {" "}
                {purchase.book_title}
            </p>

            <p>
                <strong>Quantity:</strong>
                {" "}
                {purchase.quantity}
            </p>

            <p>
                <strong>Total Price:</strong>
                {" "}
                ₹{purchase.total_price}
            </p>

            <p>
                <strong>Date:</strong>
                {" "}
                {
                    new Date(
                        purchase.purchased_date
                    ).toLocaleString()
                }
            </p>

        </div>

    );
}

export default PurchaseDetails;