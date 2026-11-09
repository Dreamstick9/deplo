import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { getDeploy, redeploy, retry, rollback } from "../../lib/api";
import { useFetch } from "../../lib/useFetch";
import { timeAgo, statusIcon } from "../../lib/data";

export default function DeployScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [busy, setBusy] = useState(false);
  const { data: deploy, error } = useFetch(() => getDeploy(id), [id]);

  if (error) return <Text style={{ padding: 20 }}>{error}</Text>;
  if (!deploy) return <Text style={{ padding: 20 }}>loading...</Text>;

  function confirm(title: string, fn: () => Promise<any>) {
    Alert.alert(title, deploy!.projectName + " · " + deploy!.commit, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          setBusy(true);
          try {
            await fn();
            router.back();
          } catch (e: any) {
            Alert.alert("Something went wrong", e.message);
          }
          setBusy(false);
        },
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: "Deploy" }} />
      <Text style={{ fontSize: 40 }}>{statusIcon(deploy.status)}</Text>
      <Text style={styles.commit}>{deploy.commit}</Text>
      <Text style={{ color: "#777", marginTop: 4 }}>
        {deploy.projectName} · {deploy.branch} · {timeAgo(deploy.createdAt)}
      </Text>

      <Pressable onPress={() => router.push("/logs/" + deploy.id)}>
        <Text style={{ color: "#2563eb", marginTop: 14, fontWeight: "600" }}>View logs →</Text>
      </Pressable>

      <View style={{ marginTop: 30 }}>
        {busy && <ActivityIndicator style={{ marginBottom: 12 }} />}
        {deploy.status == "failed" && (
          <Pressable style={[styles.btn, { backgroundColor: "#dc2626" }]} disabled={busy} onPress={() => confirm("Retry this build?", () => retry(deploy.id))}>
            <Text style={styles.btnText}>Retry</Text>
          </Pressable>
        )}
        <Pressable style={styles.btn} disabled={busy} onPress={() => confirm("Redeploy?", () => redeploy(deploy.id))}>
          <Text style={styles.btnText}>Redeploy</Text>
        </Pressable>
        {!deploy.isCurrent && deploy.status == "ready" && (
          <Pressable style={[styles.btn, { backgroundColor: "#555" }]} disabled={busy} onPress={() => confirm("Roll back to this deploy?", () => rollback(deploy.id))}>
            <Text style={styles.btnText}>Rollback to this</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commit: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
