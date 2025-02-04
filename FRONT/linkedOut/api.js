const API_URL = "https://backend-supabase-peach.vercel.app/api";

// Inscription
export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

// Connexion
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    throw error;
  }
};

// Récupérer les posts
export const getPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    throw error;
  }
};

// Ajouter un post
export const addPost = async (post) => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout du post :", error);
    throw error;
  };
};

// Récupérer les commentaires
export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`);
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    throw error;
  }
};

// Ajouter un commentaire
export const addComment = async (comment) => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });
    return response.json();
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    throw error;
  };
};
