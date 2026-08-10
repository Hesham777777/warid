import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

/**
 * اختبار بسيط للتأكد من أن التطبيق يعمل دون أخطاء
 */
describe('App Component', () => {
  it('renders correctly without crashing', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays the main container', () => {
    const { getByTestId } = render(<App />);
    // تأكد من وجود العنصر الرئيسي (يجب إضافة testID في App.js)
    expect(getByTestId('app-container')).toBeTruthy();
  });
});
