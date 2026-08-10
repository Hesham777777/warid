import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ملفات الترجمة
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to My Expo App",
      "goToDetails": "Go to Details",
      "detailsTitle": "Details Screen",
      "detailsDescription": "This is the details page. You can navigate back to the home screen.",
      "goBack": "Go Back"
    }
  },
  ar: {
    translation: {
      "welcome": "مرحبًا بك في تطبيقي",
      "goToDetails": "الانتقال إلى التفاصيل",
      "detailsTitle": "شاشة التفاصيل",
      "detailsDescription": "هذه صفحة التفاصيل. يمكنك العودة إلى الشاشة الرئيسية.",
      "goBack": "عودة"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
