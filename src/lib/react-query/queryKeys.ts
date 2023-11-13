export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",
    GET_USER_BY_SEARCH = "getUserBySearch",
    GET_RELATIONS = "getRelations",
    GET_NEW_RELATIONS="getNewRelations",
    GET_RIGHT_USERS="getRightUsers",
    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",
    GET_SAVED_POSTS = "getSavedPosts",
    GET_INFINITE_SAVED_POSTS = "getInfiniteSavedPosts",
    GET_INFINITE_USER_POSTS = "getInfinitUsersPosts",
    GET_USERS_SAVED_POSTS="getUsersSavedPosts",
GET_USERS_CHATS="getUsersChats",
    GET_CHATS = "getChats",
    GET_POST_COMMENTS="getPostComments",
    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
  }