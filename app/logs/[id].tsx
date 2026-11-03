import { useRef } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from "react-native";
import type { ScrollViewInstance } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { getLogs } from "../../lib/data";

function isError(line: string) {
  const l = line.toLowerCase();
  return l.includes("error") || l.includes("err!") || l.includes("failed");
}

export default function LogsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lines = getLogs(id).slice(-200);
  const scroll = useRef<ScrollViewInstance>(null);
  const positions = useRef<number[]>([]);

  const firstError = lines.findIndex(isError);

  function jumpToError() {
    const y = positions.current[firstError];
    if (y != undefined) scroll.current?.scrollTo({ y: y - 20, animated: true });
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen options={{ title: "Logs" }} />
      <View style={styles.bar}>
        {firstError >= 0 && (
          <Pressable onPress={jumpToError}>
            <Text style={styles.barBtn}>Jump to error</Text>
          </Pressable>
        )}
        <Pressable onPress={() => Share.share({ message: lines.join("\n") })}>
          <Text style={styles.barBtn}>Share</Text>
        </Pressable>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 10 }}>
        {lines.map((line, i) => (
          <Text
            key={i}
            onLayout={(e) => (positions.current[i] = e.nativeEvent.layout.y)}
            style={[styles.line, isError(line) && styles.err]}
          >
            {line}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", justifyContent: "flex-end", padding: 10, gap: 18, backgroundColor: "#1c1c1c" },
  barBtn: { color: "#60a5fa", fontWeight: "600" },
  line: { color: "#ddd", fontFamily: "Courier", fontSize: 12, lineHeight: 18 },
  err: { color: "#f87171", backgroundColor: "#3b1111" },
});
