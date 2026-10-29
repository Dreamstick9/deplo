import { View, Text, StyleSheet, FlatList, Pressable, Linking } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { projects, timeAgo, statusIcon } from "../../lib/data";

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = projects.find((p) => p.id == id);

  if (!project) return <Text style={{ padding: 20 }}>project not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: project.name }} />
      <View style={styles.top}>
        <Text style={{ fontSize: 22, color: project.up ? "green" : "red", fontWeight: "bold" }}>
          {project.up ? "Up" : "Down"}
        </Text>
        <Pressable onPress={() => Linking.openURL(project.url)}>
          <Text style={styles.link}>{project.url}</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>Deploys</Text>
      <FlatList
        data={project.deploys}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => router.push("/deploy/" + item.id)}>
            <Text style={{ fontSize: 18 }}>{statusIcon(item.status)}</Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: "600" }}>{item.commit}</Text>
              <Text style={{ color: "#777", marginTop: 2 }}>
                {item.branch} · {timeAgo(item.createdAt)}
                {item.duration ? " · " + item.duration + "s" : ""}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { padding: 16, backgroundColor: "#fff" },
  link: { color: "#2563eb", marginTop: 4 },
  heading: { fontSize: 15, fontWeight: "bold", marginLeft: 14, marginTop: 16, marginBottom: 4, color: "#444" },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, marginHorizontal: 12, marginTop: 8, borderRadius: 8 },
});
