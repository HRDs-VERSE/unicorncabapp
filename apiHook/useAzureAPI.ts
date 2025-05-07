const useAzureAPI = () => {
  const uploadToAzure = async (base64Image: string, containerName: string): Promise<any | null> => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/azure/blob/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({base64Image, containerName}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message)
      }

      const data =  await response.json();
      return data;

    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const deleteFromAzure = async (blobUrl: string): Promise<any | null> => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URI}/api/azure/blob/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blobUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message || "Deletion failed");
      }

      const data =  await response.json();
      return data;
    } catch (err) {
      console.error("Deletion error:", err);
      return null;
    }
  };

  return {
    uploadToAzure,
    deleteFromAzure,
  };
};

export default useAzureAPI;
