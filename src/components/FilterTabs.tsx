import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { TaskStatus } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "../constants/theme";

type FilterValue = TaskStatus | "All";

interface Props {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
}

const TABS: FilterValue[] = ["All", TaskStatus.PENDING, TaskStatus.COMPLETED];

const FilterTabs: React.FC<Props> = ({ selected, onSelect }) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TABS.map((tab) => {
        const active = tab === selected;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                backgroundColor: active
                  ? colors.primary
                  : colors.surfaceVariant,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(tab)}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.white : colors.textSecondary },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
    flexDirection: "row",
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.xs,
  },
  label: {
    ...Typography.label,
    fontWeight: "600",
  },
});

export default FilterTabs;
