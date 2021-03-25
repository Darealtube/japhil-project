import { gql } from "@apollo/client";

export const PostInfo = gql`
  fragment PostInfo on Post {
    id
    author {
      id
      name
    }
    picture
    date
    art
    tags
  }
`;

//Fetch all Users
export const USER_QUERY = gql`
  query Users {
    users {
      id
      name
    }
  }
`;

//Fetch all Posts
export const POST_QUERY = gql`
  query Posts($after: ID) {
    posts(limit: 4, after: $after) {
      totalCount
      edges {
        node {
          ...PostInfo
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PostInfo}
`;

//Fetch User by ID
export const USER_ID_QUERY = gql`
  query UserID($id: ID!, $after: ID) {
    userId(id: $id) {
      id
      name
      image
      likedPosts(limit: 4, after: $after) {
        totalCount
        edges {
          node {
            id
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

//Fetch Post By ID
export const POST_ID_QUERY = gql`
  query PostID($id: ID!, $after: ID) {
    postId(id: $id) {
      id
      title
      art
      author {
        id
        name
      }
      sale
      price
      tags
      description
      comments(after: $after, limit: 4) {
        totalCount
        edges {
          node {
            id
            author {
              id
              image
              name
            }
            date
            content
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

//Fetch Appbar Info
export const APPBAR_USER_QUERY = gql`
  query UserAppbarID($id: ID!) {
    userId(id: $id) {
      id
      name
      image
      email
      newUser
      tutorial
      notifRead
      notifications {
        postId
        user {
          image
        }
        date
        description
      }
    }
  }
`;

//Fetch User and Posts
export const USER_POST_QUERY = gql`
  query UserPosts($name: String!, $after: ID) {
    userName(name: $name) {
      id
      name
      image
      posts(limit: 4, after: $after) {
        totalCount
        edges {
          node {
            ...PostInfo
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      username
      birthday
      country
      phone
    }
  }
  ${PostInfo}
`;

export const USER_LIKED_POST_QUERY = gql`
  query UserPosts($name: String!, $after: ID) {
    userName(name: $name) {
      id
      name
      image
      likedPosts(limit: 4, after: $after) {
        totalCount
        edges {
          node {
            ...PostInfo
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      username
      birthday
      country
      phone
    }
  }
  ${PostInfo}
`;

export const USER_HISTORY_QUERY = gql`
  query UserHistory($name: String!, $after: ID) {
    userName(name: $name) {
      id
      name
      image
      history(after: $after, limit: 4) {
        totalCount
        edges {
          node {
            id
            viewed {
              id
              title
              art
            }
            lastDateViewed
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      username
      birthday
      country
      phone
    }
  }
`;

export const POST_RECOMMENDED_QUERY = gql`
  query RecommendedPosts($id: ID!, $after: ID) {
    recommendedPosts(id: $id, limit: 4, after: $after) {
      totalCount
      edges {
        node {
          ...PostInfo
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PostInfo}
`;

export const HOME_RECOMMENDED_QUERY = gql`
  query HomeRecommended($id: ID!, $after: ID) {
    userId(id: $id) {
      id
      homeRecommended(after: $after, limit: 4) {
        totalCount
        edges {
          node {
            ...PostInfo
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${PostInfo}
`;

export const NEW_POSTS_QUERY = gql`
  query NewPosts($after: ID) {
    newPosts(after: $after, limit: 4) {
      totalCount
      edges {
        node {
          ...PostInfo
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PostInfo}
`;

export const LIKE_MUTATION = gql`
  mutation Like($postId: ID!, $userName: String!) {
    likePost(postId: $postId, userName: $userName)
  }
`;

export const UNLIKE_MUTATION = gql`
  mutation unLike($postId: ID!, $userName: String!) {
    unlikePost(postId: $postId, userName: $userName)
  }
`;

export const EDIT_POST_MUTATION = gql`
  mutation EditPost(
    $postId: ID!
    $title: String!
    $description: String!
    $tags: [String!]
  ) {
    editPost(
      postId: $postId
      title: $title
      description: $description
      tags: $tags
    )
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $date: String!
    $tags: [String]
    $title: String!
    $description: String!
    $art: String!
    $price: String!
    $sale: String!
    $author: ID!
    $picture: String!
  ) {
    createPost(
      date: $date
      tags: $tags
      title: $title
      description: $description
      art: $art
      price: $price
      sale: $sale
      author: $author
      picture: $picture
    )
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postID: ID!, $author: ID!, $content: String!) {
    createComment(postID: $postID, author: $author, content: $content) {
      id
      date
      content
      author {
        id
        name
        image
      }
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($commentID: ID!) {
    deleteComment(commentID: $commentID)
  }
`;

export const DELETE_HISTORY_MUTATION = gql`
  mutation DeleteHistory($historyID: ID!) {
    deleteHistory(historyID: $historyID)
  }
`;

export const CONFIG_MUTATION = gql`
  mutation ConfigUser(
    $userId: ID!
    $username: String!
    $age: String!
    $country: String!
    $language: String!
    $birthday: String!
    $phone: String!
  ) {
    editUser(
      userId: $userId
      username: $username
      age: $age
      country: $country
      language: $language
      birthday: $birthday
      phone: $phone
    )
  }
`;

export const READ_NOTIF = gql`
  mutation ReadNotif($userId: ID!) {
    readNotif(userId: $userId)
  }
`;

export const VIEW_POST = gql`
  mutation ViewPost($viewed: ID!, $userId: ID!) {
    viewPost(viewed: $viewed, userId: $userId)
  }
`;
