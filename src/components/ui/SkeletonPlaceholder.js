import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/**
 * مكون هيكل التحميل (Skeleton Loading)
 * يعرض هيكلاً رمادياً متحركاً أثناء تحميل البيانات لتحسين تجربة المستخدم
 */
const SkeletonPlaceholder = ({ width, height, borderRadius = 4 }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
});

export default SkeletonPlaceholder;
