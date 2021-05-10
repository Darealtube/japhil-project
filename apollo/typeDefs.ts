import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    image: String
    createdAt: String
    updatedAt: String
    posts(after: ID, limit: Int): PostConnection
    likedPosts(after: ID, limit: Int): PostConnection
    likedArtists(after: ID, limit: Int): UserConnection
    notifications(after: ID, limit: Int): NotificationConnection
    username: String
    age: String
    country: String
    birthday: String
    phone: String
    newUser: Boolean
    tutorial: Boolean
    homeRecommended(after: ID, limit: Int): PostConnection
    artLevel: String
    artKinds: [String!]
    artStyles: [String!]
    userBio: String
    backdrop: String
    commissions(after: ID, limit: Int): CommissionConnection
    yourCommissions(after: ID, limit: Int): CommissionConnection
    pendingCommissions(after: ID, limit: Int): CommissionConnection
    finishedCommissions(after: ID, limit: Int): CommissionConnection
    yourFinishedCommissions(after: ID, limit: Int): CommissionConnection
    yourPendingCommissions(after: ID, limit: Int): CommissionConnection
    commissionCount: Int
  }

  type Post {
    id: ID!
    date: String!
    tags: [String]
    title: String!
    description: String!
    art: String!
    price: String!
    sale: String!
    author: User
    likes: Int
    comments(after: ID, limit: Int): CommentConnection
  }

  type Commission {
    id: ID!
    fromUser: User!
    toArtist: User!
    title: String!
    description: String!
    sampleArt: String!
    width: Int!
    height: Int!
    deadline: String!
    dateIssued: String!
    accepted: Boolean!
    finished: Boolean!
  }

  type Comment {
    id: ID!
    postID: ID!
    date: String!
    author: User!
    content: String!
  }

  type Query {
    users: [User]!
    posts(after: ID, limit: Int): PostConnection
    userId(id: ID!): User
    userName(name: String!): User
    postId(id: ID!): Post
    commissionId(id: ID!): Commission
    recommendedPosts(id: ID!, after: ID, limit: Int): PostConnection
    newPosts(after: ID, limit: Int): PostConnection
    featuredPosts(after: ID, limit: Int): PostConnection
    isLikedArtist(userID: ID!, artistName: String!): Boolean
    isLikedPost(postID: ID!, userID: ID!): Boolean
    userExists(userName: String, userId: ID!): Boolean
    isSameUser(userId: ID!, userName: String!): Boolean
  }

  type Notification {
    id: ID!
    commissionId: ID
    commissioner: User
    date: String
    description: String
    read: Boolean
  }

  type Mutation {
    likePost(postId: ID!, userID: ID!): Boolean!
    unlikePost(postId: ID!, userID: ID!): Boolean!
    editPost(
      postId: ID!
      title: String!
      description: String!
      tags: [String!]
    ): Boolean!
    createPost(
      date: String!
      tags: [String]
      title: String!
      description: String!
      art: String!
      price: String!
      sale: String!
      author: ID!
    ): Boolean!
    deletePost(postId: ID!): Boolean!
    configUser(
      userId: ID!
      name: String!
      age: String!
      country: String!
      language: String!
      birthday: String!
      phone: String!
      artLevel: String!
      artStyles: [String!]
      artKinds: [String!]
    ): Boolean!
    editUser(
      userId: ID!
      name: String!
      country: String!
      birthday: String!
      artLevel: String!
      artStyles: [String!]
      artKinds: [String!]
      userBio: String
      image: String
      backdrop: String
      phone: String
      age: String
    ): User!
    readNotif(notifArray: [ID!]): Boolean!
    createComment(postID: ID!, author: ID!, content: String!): Comment!
    deleteComment(commentID: ID!): Boolean!
    likeArtist(artistID: ID!, userID: ID!): Boolean!
    unlikeArtist(artistID: ID!, userID: ID!): Boolean!
    viewPost(viewed: ID!, userId: ID!): Boolean!
    commissionArtist(
      artistName: String!
      userId: ID!
      title: String!
      description: String!
      sampleArt: String!
      height: Int!
      width: Int!
      deadline: Int!
    ): Boolean!
    deleteNotification(notifId: ID!, userId: ID!): Boolean!
    deleteCommission(commissionId: ID!, reason: String): Boolean!
    acceptCommission(commissionId: ID!, message: String): Commission!
  }

  type PostConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [PostEdge]
  }

  type UserConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [UserEdge]
  }

  type CommentConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [CommentEdge]
  }

  type CommissionConnection {
    totalCount: Int
    pageInfo: PageInfo
    edges: [CommissionEdge]
  }

  type NotificationConnection {
    idList: [ID!]
    totalCount: Int
    totalUnreadCount: Int
    pageInfo: PageInfo
    edges: [NotificationEdge]
  }

  type NotificationEdge {
    node: Notification
  }

  type CommissionEdge {
    node: Commission
  }

  type CommentEdge {
    node: Comment
  }

  type PostEdge {
    node: Post
  }

  type UserEdge {
    node: User
  }

  type PageInfo {
    endCursor: ID
    hasNextPage: Boolean
  }
`;
