const useUserAPI = () => {

    const initiateRegistration = async (mobileNumber: string, pass?: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/users/auth-boarding`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobileNumber, pass }),
            });

            const result = await response.json();
            return { message: result.message, success: result.success, token: result.token, user: result.user };
        } catch (error) {
            return { message: "An error occurred during registration. Please try again." };
        }
    };

    const auth = async (formData: any, documents: any, userId: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/users/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({formData, documents, userId}),
            });

            const result = await response.json();
            console.log(result)
            return { message: result.message, success: result.success, token: result.token, user: result.user };
        } catch (error) {
            return { message: "Authentication failed. Please try again." };
        }
    };

    const getUserProfile = async (userId: string) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/users/profile/${userId}`, {
                method: "GET",
            });

            const result = await response.json();
            return { message: result.message, success: result.success, profile: result.profile };
        } catch (error) {
            return { message: "Failed to fetch user profile. Please try again." };
        }
    };

    const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/users/profile/update/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            const result = await response.json();
            return { message: result.message, success: result.success, updatedProfile: result.updatedProfile };
        } catch (error) {
            return { message: "Failed to update user profile. Please try again." };
        }
    };

    const verifyUser = async (data: { number: string, verifyCode: string }) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/users/verify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result)
            return { message: result.message, success: result.success, user: result.user };
        } catch (error) {
            return { message: "Verification failed. Please try again." };
        }
    };

    return {
        initiateRegistration,
        auth,
        getUserProfile,
        updateUserProfile,
        verifyUser,
    };
};

export default useUserAPI;
