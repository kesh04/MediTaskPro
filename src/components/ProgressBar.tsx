import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "../constants/theme";

interface Props {
  progress: number;
  completed: number;
  total: number;
}

const ProgressBar: React.FC<Props> = ({ progress, completed, total }) => {
  const { colors } = useTheme();
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, animWidth]);

  const widthInterpolated = animWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Daily Progress
        </Text>
        <Text style={[styles.count, { color: colors.text }]}>
          {completed}/{total} tasks
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: colors.progressFill, width: widthInterpolated },
          ]}
        />
      </View>
      <Text style={[styles.percent, { color: colors.primary }]}>
        {Math.round(progress * 100)}% complete
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.sm },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  label: { ...Typography.body2 },
  count: { ...Typography.body2, fontWeight: "600" },
  track: {
    height: 10,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  percent: {
    ...Typography.caption,
    marginTop: 4,
    fontWeight: "600",
  },
});

export default ProgressBar;
