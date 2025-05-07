const useTripAPI = () => {
    const createTrip = async (userId: string, data: any) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/create/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to create trip");
        }
        return await response.json();
    };

    const getVendorTrips = async (userId: string, tripState?: string, page = 1, limit = 10) => {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (tripState) params.append("tripState", tripState);

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/vendor/${userId}?${params.toString()}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to fetch vendor trips");
        }
        return await response.json();
    };

    const getDriverTrips = async (driverId: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/driver?id=${driverId}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to fetch driver trips");
        }
        return await response.json();
    };

    const getAllTripsWithFilters = async ({
    vendorId, driverId, tripType, carType, page = 1, limit = 10,
tripStatus}: {
    vendorId?: string;
    driverId?: string;
    tripType?: string;
    carType?: string;
    tripStatus?: string;
    page?: number;
    limit?: number;
}) => {
        const url = new URL(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/get-all`);
    
        if (vendorId) url.searchParams.append("vendorId", vendorId);
        if (driverId) url.searchParams.append("driverId", driverId);
        if (tripType) url.searchParams.append("tripType", tripType);
        if (carType) url.searchParams.append("carType", carType);
        if (tripStatus) url.searchParams.append("tripStatus", tripStatus);
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString());
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to fetch trips with filters");
        }
        return await response.json();
    };
    

    const acceptTrip = async (tripId: string, driverId: string, commissionState: string, paymentId: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/accept/${tripId}/${driverId}/${commissionState}/${paymentId}`, {
            method: "PATCH",
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to accept trip");
        }
        return await response.json();
    };

    const completeTrip = async (tripId: string, driverId: string, verifyCode: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/${tripId}/complete?id=${driverId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verifyCode }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to complete trip");
        }
        return await response.json();
    };

    const cancelTrip = async (tripId: string, userId: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/trips/${tripId}/cancel?id=${userId}`, {
            method: "POST",
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to cancel trip");
        }
        return await response.json();
    };

    return {
        createTrip,
        getVendorTrips,
        getDriverTrips,
        getAllTripsWithFilters,
        acceptTrip,
        completeTrip,
        cancelTrip,
    };
};

export default useTripAPI;
