import { useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { projects, timeAgo, statusIcon } from "../lib/data";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const downCount = projects.filter((p) => !p.up).length;

  function onRefresh() {
    setRefreshing(true);
    // TODO real fetch
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.banner, { backgroundColor: downCount ? "#fde2e2" : "#dff5e3" }]}>
        <Text style={styles.bannerText}>
          {downCount ? downCount + " site down" : "all sites up"}
        </Text>
      </View>
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
              <Text style={styles.sub}>
                {statusIcon(last.status)} {last.commit} · {timeAgo(last.createdAt)}
              </Text>
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
  card: { backgroundColor: "#fff", marginHorizontal: 12, marginTop: 12, padding: 14, borderRadius: 10 },
  name: { fontSize: 17, fontWeight: "bold" },
  sub: { marginTop: 6, color: "#555" },
});
