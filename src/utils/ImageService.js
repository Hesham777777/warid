import * as ImageManipulator from 'expo-image-manipulator';

/**
 * خدمة ضغط ومعالجة الصور
 * لتقليل حجم الصور وتحسين أداء التطبيق
 */
export const ImageService = {
  /**
   * ضغط صورة وتغيير أبعادها
   * @param {string} uri - مسار الصورة الأصلي
   * @param {number} maxWidth - العرض الأقصى
   * @param {number} maxHeight - الارتفاع الأقصى
   * @param {number} quality - جودة الصورة (0.0 إلى 1.0)
   */
  compressImage: async (uri, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth, height: maxHeight } },
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('فشل ضغط الصورة:', error);
      return uri; // إرجاع الصورة الأصلية في حال الفشل
    }
  },

  /**
   * تغيير أبعاد الصورة فقط
   */
  resizeImage: async (uri, width, height) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width, height } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('فشل تغيير أبعاد الصورة:', error);
      return uri;
    }
  },
};

export default ImageService;
