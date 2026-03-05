import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTheme } from "../hooks/useTheme";
import { BorderRadius, Spacing, Typography } from "../constants/theme";

interface Props<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
}

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  error,
  ...rest
}: Props<T>) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: error ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor={colors.textMuted}
            {...rest}
          />
        )}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    ...Typography.label,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    ...Typography.body1,
    minHeight: 48,
  },
  error: {
    ...Typography.caption,
    marginTop: 4,
  },
});

export default FormInput;
