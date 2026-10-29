import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { findDeploy, redeploy, retry, rollback } from "../../lib/api";
import { timeAgo, statusIcon } from "../../lib/data";

export default function DeployScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [busy, setBusy] = useState(false);
  const found = findDeploy(id);

  if (!found) return <Text style={{ padding: 20 }}>deploy not found</Text>;
  const { project, deploy } = found;
  const isCurrent = project.deploys[0].id == deploy.id;

  function confirm(title: string, fn: () => Promise<any>) {
    Alert.alert(title, project.name + " · " + deploy.commit, [
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
        {project.name} · {deploy.branch} · {timeAgo(deploy.createdAt)}
      </Text>

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
        {!isCurrent && deploy.status == "ready" && (
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
