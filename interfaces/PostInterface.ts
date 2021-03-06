import { CommentInterface } from "./CommentInterface";
import { UserInterface } from "./UserInterface";

export interface PostInterface {
  id: string;
  author?: UserInterface;
  date: string;
  art: string;
  tags: string[];
  title: string;
  description: string;
  sale?: string;
  price: string;
  likes?: number;
  comments?: PostComments;
  forSale?: boolean;
  forSalePrice?: string;
}

export interface edges {
  node: PostInterface;
}

export interface commentEdges {
  node: CommentInterface;
}

export interface PostComments {
  edges: commentEdges[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export interface RecommendedPosts {
  edges: edges[];
  pageInfo: PageInfo;
  totalCount: number;
}
