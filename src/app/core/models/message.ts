import { User } from '@user/models';

export interface Message {
  id: string;
  sender: Partial<User>;
  text: string;
  photo: boolean;
  imgUrl?: string;
  thumbnailUrl?: string;
  reply: boolean;
  replyTo?: string;
  originalMessage?: string;
  createdAt: number;
}
