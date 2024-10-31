export const createUserRules = {
    firstName: { required: true, type: 'string' },
    lastName: { required: true, type: 'string' },
    age: { required: true, type: 'number' },
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' },
    role: { required: false, type: 'string' },
  };
  