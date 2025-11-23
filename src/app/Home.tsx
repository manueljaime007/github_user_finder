import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useState } from "react";
import { IGithubUser } from "@/interfaces/user";

export default function Home() {
  const [user, setUser] = useState<IGithubUser | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUserData = async (username: string) => {
    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (!response.ok) {
        setError("Usuário não encontrado 😢");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch {
      setError("Erro ao buscar usuário");
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text
            style={{
              color: "white",
              fontSize: 30,
              marginBottom: 15,
            }}
          >
            GITHUB PROFILE FINDER
          </Text>
          {/* 🔍 INPUT DE PESQUISA */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar usuário do GitHub..."
              placeholderTextColor="#aaa"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => loadUserData(search)}
            >
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
          </View>

          {/* LOADING */}
          {loading && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 20 }}
            />
          )}

          {/* ERRO */}
          {error !== "" && <Text style={styles.error}>{error}</Text>}

          {/* CARD DO USUÁRIO */}
          {user && (
            <View style={styles.card}>
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />

              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.title}>@{user.login}</Text>

              {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

              <View style={styles.row}>
                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{user.followers}</Text>
                  <Text style={styles.badgeLabel}>Seguidores</Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeNumber}>{user.following}</Text>
                  <Text style={styles.badgeLabel}>Seguindo</Text>
                </View>
              </View>

              <View>
                <Pressable
                  style={[styles.button, {
                    marginTop: 20,
                    width: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }]}
                >
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    Ver mais
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0d0d",
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
  },

  searchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },

  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  error: {
    color: "#ff6b6b",
    marginTop: 15,
    fontSize: 16,
  },

  card: {
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#ffffff22",
  },

  title: {
    fontSize: 18,
    color: "#aaa",
    marginBottom: 10,
  },

  name: {
    fontSize: 26,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
  },

  bio: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 20,
  },

  badge: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    minWidth: 110,
  },

  badgeNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  badgeLabel: {
    fontSize: 14,
    color: "#ccc",
  },
});
