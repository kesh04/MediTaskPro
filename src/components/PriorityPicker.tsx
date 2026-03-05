import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Priority } from "../constants";
import { PRIORITY_OPTIONS } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Shadows, Spacing, Typography } from "../constants/theme";
import PriorityBadge from "./PriorityBadge";

interface Props {
  value: Priority;
  onChange: (priority: Priority) => void;
  error?: string;
}

const PriorityPicker: React.FC<Props> = ({ value, onChange, error }) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
        onPress={() => setOpen(true)}
      >
        <PriorityBadge priority={value} />
        <Text style={[styles.arrow, { color: colors.textSecondary }]}>▾</Text>
      </TouchableOpacity>
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        >
          <View
            style={[
              styles.dropdown,
              { backgroundColor: colors.surface },
              Shadows.lg,
            ]}
          >
            <Text style={[styles.dropdownTitle, { color: colors.text }]}>
              Select Priority
            </Text>
            <FlatList
              data={PRIORITY_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item === value && {
                      backgroundColor: `${colors.primary}15`,
                    },
                  ]}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <PriorityBadge priority={item} />
                  {item === value && (
                    <Text style={[styles.check, { color: colors.primary }]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { ...Typography.label, fontWeight: "600", marginBottom: 6 },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    minHeight: 48,
  },
  arrow: { fontSize: 18 },
  error: { ...Typography.caption, marginTop: 4 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  dropdown: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  dropdownTitle: { ...Typography.h4, marginBottom: Spacing.sm },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: 4,
  },
  check: { fontSize: 18, fontWeight: "800" },
});

export default PriorityPicker;
