import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "../constants/theme";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = "Search tasks...",
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
      ]}
    >
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    height: 46,
  },
  icon: { fontSize: 16, marginRight: Spacing.sm },
  input: {
    flex: 1,
    ...Typography.body1,
    paddingVertical: 0,
  },
  clearBtn: { padding: 4 },
  clearText: { fontSize: 14 },
});

export default SearchBar;
