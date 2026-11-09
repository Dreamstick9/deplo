import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { timeAgo, statusIcon } from "../lib/data";
import { getProjects } from "../lib/api";
import { useFetch } from "../lib/useFetch";

export default function Home() {
  const { data, error, loading, reload } = useFetch(getProjects);
  const projects = data || [];

  const downCount = projects.filter((p) => !p.up).length;

  return (
    <View style={{ flex: 1 }}>
      {error && <Text style={styles.error}>cant reach server: {error}</Text>}
      {data && (
        <View style={[styles.banner, { backgroundColor: downCount ? "#fde2e2" : "#dff5e3" }]}>
          <Text style={styles.bannerText}>
            {downCount ? downCount + " site down" : "all sites up"}
          </Text>
        </View>
      )}
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        renderItem={({ item }) => {
          const last = item.deploys[0];
          return (
            <Pressable style={styles.card} onPress={() => router.push("/project/" + item.id)}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={{ color: item.up ? "green" : "red", fontWeight: "600" }}>
                  {item.up ? "● up" : "● down"}
                </Text>
              </View>
              {last && (
                <Text style={styles.sub}>
                  {statusIcon(last.status)} {last.commit} · {timeAgo(last.createdAt)}
                </Text>
              )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 14, alignItems: "center" },
  bannerText: { fontSize: 16, fontWeight: "600" },
  error: { backgroundColor: "#fde2e2", color: "#b91c1c", padding: 12, textAlign: "center" },
  card: { backgroundColor: "#fff", marginHorizontal: 12, marginTop: 12, padding: 14, borderRadius: 10 },
  name: { fontSize: 17, fontWeight: "bold" },
  sub: { marginTop: 6, color: "#555" },
});
