/**
 * مكونات مشتركة قابلة لإعادة الاستخدام - وارد 3.0
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../utils/constants';

/**
 * مكون البطاقة
 */
export const Card = ({ children, style, onPress, elevated = true }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.card,
        elevated && styles.cardElevated,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * مكون الزر المخصص
 */
export const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`],
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}`],
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.textLight} />
      ) : (
        <>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

/**
 * مكون حقل الإدخال
 */
export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  multiline = false,
  keyboardType = 'default',
  editable = true,
  style,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          keyboardType={keyboardType}
          editable={editable}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
          ]}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
      {error && <Text style={styles.inputErrorText}>{error}</Text>}
    </View>
  );
};

/**
 * مكون شارة الحالة
 */
export const StatusBadge = ({ status, size = 'small' }) => {
  const statusConfig = {
    arrived: { label: 'وصلت', color: COLORS.statusArrived },
    registering: { label: 'قيد التسجيل', color: COLORS.statusRegistering },
    active: { label: 'نشطة', color: COLORS.statusActive },
    directed: { label: 'موجّهة', color: COLORS.statusDirected },
    pending: { label: 'منتظرة رد', color: COLORS.statusPending },
    suspended: { label: 'معلّقة', color: COLORS.statusSuspended },
    late: { label: 'متأخرة', color: COLORS.statusLate },
    completed: { label: 'مكتملة', color: COLORS.statusCompleted },
    archived: { label: 'مؤرشفة', color: COLORS.statusArchived },
  };

  const config = statusConfig[status] || { label: status, color: COLORS.textSecondary };

  return (
    <View
      style={[
        styles.badge,
        styles[`badge${size.charAt(0).toUpperCase() + size.slice(1)}`],
        { backgroundColor: `${config.color}20` },
      ]}
    >
      <View
        style={[
          styles.badgeDot,
          { backgroundColor: config.color },
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          styles[`badgeText${size.charAt(0).toUpperCase() + size.slice(1)}`],
          { color: config.color },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

/**
 * مكون شارة الأولوية
 */
export const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    low: { label: 'عادي', color: COLORS.textSecondary },
    medium: { label: 'متوسط', color: COLORS.info },
    high: { label: 'عاجل', color: COLORS.warning },
    urgent: { label: 'مهم جداً', color: COLORS.error },
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <View style={[styles.priorityBadge, { borderColor: config.color }]}>
      <Text style={[styles.priorityText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

/**
 * مكون عنصر القائمة
 */
export const ListItem = ({
  title,
  subtitle,
  onPress,
  rightElement,
  leftElement,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.listItem, style]}
    >
      {leftElement && <View style={styles.listItemLeft}>{leftElement}</View>}
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.listItemSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.listItemRight}>{rightElement}</View>}
    </TouchableOpacity>
  );
};

/**
 * مكون شاشة التحميل
 */
export const LoadingScreen = ({ message = 'جاري التحميل...' }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

/**
 * مكون الرسالة الفارغة
 */
export const EmptyState = ({ title, subtitle, icon, action }) => {
  return (
    <View style={styles.emptyContainer}>
      {icon && <View style={styles.emptyIcon}>{icon}</View>}
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {action && <View style={styles.emptyAction}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  cardElevated: {
    elevation: 2,
    shadowColor: COLORS.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Button
  button: {
    borderRadius: SIZES.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonSmall: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  buttonMedium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  buttonLarge: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonDisabled: {
    backgroundColor: COLORS.borderDark,
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: COLORS.textLight,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
  },
  buttonTextDanger: {
    color: COLORS.textLight,
  },
  buttonTextSuccess: {
    color: COLORS.textLight,
  },
  buttonTextSmall: {
    fontSize: SIZES.fontSizeSM,
  },
  buttonTextMedium: {
    fontSize: SIZES.fontSizeMD,
  },
  buttonTextLarge: {
    fontSize: SIZES.fontSizeLG,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },

  // Input
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMD,
    backgroundColor: COLORS.surface,
  },
  input: {
    padding: SPACING.md,
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  inputErrorText: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusRound,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  badgeMedium: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  badgeText: {
    fontWeight: '500',
  },
  badgeTextSmall: {
    fontSize: SIZES.fontSizeXS,
  },
  badgeTextMedium: {
    fontSize: SIZES.fontSizeSM,
  },

  // Priority Badge
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusMD,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: SIZES.fontSizeSM,
    fontWeight: '600',
  },

  // List Item
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemLeft: {
    marginRight: SPACING.md,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  listItemSubtitle: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  listItemRight: {
    marginLeft: SPACING.md,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textSecondary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: SIZES.fontSizeXL,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyAction: {
    marginTop: SPACING.md,
  },
});

// استيراد TextInput بعد تعريفه
import { TextInput } from 'react-native';
