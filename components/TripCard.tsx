import { StarRating } from "@/app/(tabs)/profile"
import { BlurView } from "expo-blur"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface RideDetailsProps {
  pickupLocation: string
  dropoffLocation: string
  pickupDate?: Date
  pickupTime?: Date
  duration: string
  fare: number
  commission: number
  carType: "sedan" | "suv" | "mpv" | "luxury" | "luxury suv" | "traveller"
  carName: string
  additional?: string
}

export default function TripCard({
  pickupLocation,
  dropoffLocation,
  pickupDate,
  pickupTime,
  duration,
  fare,
  commission,
  carType,
  carName,
  additional,
}: RideDetailsProps) {
  // Format date if provided
  const formattedDate = pickupDate
    ? pickupDate.toLocaleDateString("en-US", {
      // weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Not specified"

  // Format time if provided
  const formattedTime = pickupTime
    ? pickupTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    : "Not specified"

  // Get appropriate car icon based on car type
  const getCarTypeIcon = () => {
    switch (carType) {
      case "sedan":
        return "🚗"
      case "suv":
        return "🚙"
      case "mpv":
        return "🚐"
      case "luxury":
        return "🏎️"
      case "luxury suv":
        return "🏎️"
      case "traveller":
        return "🚐"
      default:
        return "🚗"
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)}`
  }

  return (
    <>
     <View className="mx-4 my-3 shadow-md rounded-[8px] p-3 bg-white">
  <View className="gap-3">

    {/* Header Section */}
    <View className="flex flex-row justify-between items-center px-1">
      <View className="flex-row gap-2 items-center">
        <Text className="text-[14px] text-black font-medium">{formattedDate}</Text>
        <Text className="text-[14px] text-black">-</Text>
        <Text className="text-[14px] text-black font-medium">{formattedTime}</Text>
      </View>
      <View className="border border-gray-300 rounded-lg px-3 py-1 bg-gray-100">
        <Text className="text-[13px] font-medium text-gray-700">{carName}</Text>
      </View>
    </View>
    <View className="h-[2rem] w-full bg-black"></View>

    {/* Location Info */}
    <View className="px-1 flex-row justify-between items-center">
      <Text className="text-[16px] font-semibold text-black">{pickupLocation}</Text>
      <View className="border border-gray-300 rounded-full px-3 py-1 bg-gray-100">
        <Text className="text-[12px] text-gray-700">Round</Text>
      </View>
      <Text className="text-[16px] font-semibold text-black">{dropoffLocation}</Text>
    </View>

    {/* Fare & Commission */}
    <View className="gap-2 px-1">
      <View className="flex flex-row justify-between items-center bg-gray-100 rounded-md px-3 py-2">
        <Text className="text-[14px] font-bold text-black">Fare</Text>
        <Text className="text-[14px] text-black">{formatCurrency(fare)}</Text>
      </View>

      <View className="flex flex-row justify-between items-center bg-gray-100 rounded-md px-3 py-2">
        <Text className="text-[14px] font-bold text-black">Commission</Text>
        <Text className="text-[14px] text-black">{formatCurrency(commission)}</Text>
      </View>
    </View>

    {/* Additional Info */}
    {additional && (
      <View className="mt-2 px-1">
        {/* <View className="border-t border-gray-300 my-2" /> */}
        <Text className="text-[14px] font-semibold text-black mb-1">Additional</Text>
        <Text className="text-[13px] text-gray-700">{additional}</Text>
      </View>
    )}
  </View>

  {/* Bottom Section: Profile + Actions */}
  <View className="flex flex-row items-center justify-between mt-4 px-1">
    {/* Profile Circle */}
     <View className="flex-row items-center gap-4">
          <View className="bg-black rounded-full w-[3rem] h-[3rem]" />
          <View className="flex gap-1">
            <Text className="font-medium">Hardik</Text>
            <StarRating rating={5} />
          </View>
        </View>

    {/* Action Buttons */}
    <View className="flex flex-row gap-3">
      <TouchableOpacity className="bg-white px-4 py-2 border border-black rounded-full">
        <Text className="text-black font-semibold text-[14px]">Call</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-black px-4 py-2 rounded-full">
        <Text className="text-white font-semibold text-[14px]">Chat</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>


    </>
  )
}


const style = StyleSheet.create({
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: "white",
  },
  profileContainer: {
    borderRadius: 50 / 2,
    backgroundColor: "#e8e6e6",
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    width: 80,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  // Glass Effect Views
  glassBlue: {
    backgroundColor: "rgba(0, 128, 255, 0.3)", // Transparent Blue
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "blue", // Subtle border
  },
  glassGray: {
    backgroundColor: "rgba(200, 200, 200, 0.3)", // Transparent Gray
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(200, 200, 200, 0.2)", // Subtle border
  },
  // Text Colors
  textBlue: {
    color: "blue", // Text color for blue glass
    fontSize: 16,
    fontWeight: "bold",
  },
  textGray: {
    color: "gray", // Text color for gray glass
    fontSize: 16,
    fontWeight: "bold",
  },
  bgstyle: {
    backgroundColor: "yellow", // Light gray background
  }
});





