import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { registerForPush } from "../lib/push";

export default function Layout() {
  useEffect(() => {
    registerForPush();

    // tapping a notification opens the deploy or project it's about
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const url = res.notification.request.content.data?.url;
      if (typeof url == "string") router.push(url as any);
    });
    return () => sub.remove();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ title: "deplo" }} />
      </Stack>
    </>
  );
}
