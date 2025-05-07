const useCarDocumentAPI = () => {
    
    const createCarDocument = async (data: any) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/car-docs/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to create car document");
        }
        return await response.json();
    };

    const getCarDocuments = async (userId: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/car-docs/get-user/${userId}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to fetch car documents");
        }
        return await response.json();
    };

    const updateCarDocument = async (userId: string, documents: any) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/car-docs/update/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(documents),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to update car document");
        }
        return await response.json();
    };

    const deleteCarDocument = async (id: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/car-docs/delete/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message || "Failed to delete car document");
        }
        return await response.json();
    };

    return {
        createCarDocument,
        getCarDocuments,
        updateCarDocument,
        deleteCarDocument,
    };
};

export default useCarDocumentAPI;
