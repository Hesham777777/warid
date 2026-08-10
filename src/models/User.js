// نموذج المستخدم
export class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
    };
  }
}

// دالة مساعدة لإنشاء مستخدم جديد
export const createUser = (id, name, email) => {
  return new User(id, name, email);
};
