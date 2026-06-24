export interface Comment {
  id?: string;
  appId: string;
  itemId: string;
  author: string;
  text: string;
  rating: number;
  createdAt?: string;
}
