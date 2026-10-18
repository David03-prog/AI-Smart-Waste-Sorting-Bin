import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Recycle, Lock, Mail, ArrowRight } from "lucide-react-native";
import { firebaseService } from "../services/firebaseService";
import { UserProfile } from "../types";
import { Button } from "./Button";

type Props = {
  onLogin: (user: UserProfile) => void;
};

export function AuthScreen({ onLogin }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const user = isLogin
        ? await firebaseService.login(cleanEmail, password)
        : await firebaseService.signup(cleanEmail, password);

      onLogin(user);
    } catch (e: any) {
      alert(e?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logo}>
          <Recycle color="#fff" size={38} />
        </View>

        <Text style={styles.h1}>{isLogin ? "Welcome Back" : "Create Account"}</Text>
        <Text style={styles.sub}>Smart Waste Monitoring System</Text>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputWrap}>
            <Mail color="#9ca3af" size={18} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>PASSWORD</Text>
          <View style={styles.inputWrap}>
            <Lock color="#9ca3af" size={18} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={{ marginTop: 18 }}>
            <Button fullWidth disabled={loading} onPress={handleSubmit}>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}{" "}
              {!loading ? <ArrowRight color="#fff" size={16} /> : null}
            </Button>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.bottomText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <Pressable onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.bottomLink}>{isLogin ? "Sign Up Here" : "Login Here"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 72, paddingBottom: 24 },
  top: { flex: 1, alignItems: "center" },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  h1: { fontSize: 30, fontWeight: "800", color: "#111827", textAlign: "center" },
  sub: { marginTop: 8, fontSize: 13, color: "#6b7280", textAlign: "center" },
  form: { alignSelf: "stretch", marginTop: 28 },
  label: { fontSize: 11, fontWeight: "800", color: "#4b5563", marginLeft: 6, letterSpacing: 1 },
  inputWrap: {
    marginTop: 6,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111827" },
  bottom: { alignItems: "center", marginTop: 12 },
  bottomText: { fontSize: 13, color: "#6b7280" },
  bottomLink: { fontSize: 13, fontWeight: "800", color: "#000", marginTop: 6 },
});
