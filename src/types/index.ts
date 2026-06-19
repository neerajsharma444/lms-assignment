export interface User {
  id?: string | number;
  username?: string;
  email?: string;
  avatar?: string | { url: string };
  [key: string]: any;
}

export interface Course {
  id: string | number;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  instructorName?: string;
  [key: string]: any;
}

export interface Instructor {
  id?: string | number;
  name: {
    first: string;
    last: string;
  };
  email?: string;
  picture?: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  [key: string]: any;
}

export interface LoginPayload {
  username?: string;
  password?: string;
  [key: string]: any;
}

export interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: {
    data: T[];
    [key: string]: any;
  };
  [key: string]: any;
}
