import { View, Text, TouchableOpacity, Modal } from "react-native";

type CustomAlertProps = {
  visible: boolean;
  message: string;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  hide: () => void;
};

export default function CustomAlert({
  visible,
  message,
  title = "Alert",
  onConfirm,
  onCancel,
  hide,
}: CustomAlertProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hide}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <Text className="text-lg font-semibold mb-4 text-center">{title}</Text>
          <Text className="text-base text-center mb-6">{message}</Text>

          <View className="flex-row justify-between space-x-4">
            <TouchableOpacity
              onPress={() => {
                hide();
                onCancel?.();
              }}
              className="bg-gray-200 px-4 py-2 rounded flex-1"
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                hide();
                onConfirm?.();
              }}
              className="bg-blue-600 px-4 py-2 rounded flex-1"
            >
              <Text className="text-white text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
