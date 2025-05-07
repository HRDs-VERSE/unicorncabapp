const useReviewAPI = () => {
    const createReview = async (id: string, data: { user: string; rating: number; comment: string }) => {
        const response = await fetch(`/api/reviews/create?id=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create review");
        }
        return await response.json();
    };

    const getUserReviews = async (userId: string) => {
        const response = await fetch(`/api/reviews/user/${userId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user reviews");
        }
        return await response.json();
    };

    const updateReview = async (reviewId: string, id: string, data: { rating: number; comment: string }) => {
        const response = await fetch(`/api/reviews/update/${reviewId}?id=${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update review");
        }
        return await response.json();
    };

    const deleteReview = async (reviewId: string, id: string) => {
        const response = await fetch(`/api/reviews/delete/${reviewId}?id=${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete review");
        }
        return await response.json();
    };

    return {
        createReview,
        getUserReviews,
        updateReview,
        deleteReview,
    };
};

export default useReviewAPI;
