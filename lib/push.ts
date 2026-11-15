import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { API_URL } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPush() {
  if (!Device.isDevice) {
    console.log("push only works on a real phone");
    return;
  }

  if (Platform.OS == "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  let { status } = await Notifications.getPermissionsAsync();
  if (status != "granted") {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status != "granted") return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await fetch(API_URL + "/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (e) {
    console.log("couldnt get push token", e);
  }
}
