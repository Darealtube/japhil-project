import { PostInterface } from "./PostInterface";

export interface UserInterface {
  image?: string;
  id: string;
  email: string;
  posts?: Posts;
  likedPosts?: Posts;
  likedArtists?: UserInterface[];
  balance?: string;
  notifications?: Notifications;
  name?: string; // Not required for now
  tutorial?: boolean;
  newUser?: boolean;
  country?: string;
  birthday?: string;
  artLevel?: string;
  artStyles?: string[];
  artKinds?: string[];
  userBio?: string;
  backdrop?: string;
  homeRecommended: Posts;
  phone: string;
  age: string;
  commissions: Commissions;
  yourCommissions: Commissions;
  pendingCommissions: Commissions;
  yourPendingCommissions: Commissions;
  yourFinishedCommissions: Commissions;
  // More to come
}

export interface UserData {
  user: UserInterface;
}

export interface NotifInterface {
  id: string;
  commissioner: UserInterface;
  date: string;
  description: string;
  commissionId: string;
  read: boolean;
}

export interface CommissionInterface {
  id: string;
  fromUser: UserInterface;
  toArtist: UserInterface;
  title: string;
  description: string;
  sampleArt: string;
  width: number;
  height: number;
  deadline: string;
  dateIssued: string;
  accepted: boolean;
  finished: boolean;
}

export interface commissionedges {
  node: CommissionInterface;
}

export interface Commissions {
  edges: commissionedges[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface notifedges {
  node: NotifInterface;
}

export interface Notifications {
  edges: notifedges[];
  pageInfo: PageInfo;
  totalCount: number;
  totalUnreadCount: number;
  idList: string[];
}

export interface edges {
  node: PostInterface;
}

export interface Posts {
  edges: edges[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}
