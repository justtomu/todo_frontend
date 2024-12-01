import { adminLoginResponse } from '@typings/admin.ts';

export const getUserData = () => {
  if (!localStorage.getItem('user')) {
    return null;
  }
  const user: adminLoginResponse = JSON.parse(
    localStorage.getItem('user') as string
  );
  return user;
};

export const authHeader = () => {
  const user: adminLoginResponse = JSON.parse(
    localStorage.getItem('user') as string
  );
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
};

export const saveUser = (user: adminLoginResponse) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};
