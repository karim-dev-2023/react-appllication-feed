import React, { createContext, useContext, useState, useEffect } from "react";
import { images as localImages } from "../../assets/images";


const AppContext = createContext();

const randomCaptions = [
  "Un moment inoubliable !",
  "Vibes du jour 🌸",
  "La vie est belle !",
  "Juste wow.",
  "Inspiration du matin.",
  "Soleil et sourire !",
  "On profite à fond.",
  "✨ #goodvibes ✨",
  "Mood du jour.",
];

function getRandomCaption() {
  return randomCaptions[Math.floor(Math.random() * randomCaptions.length)];
}

export const AppProvider = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User state
  const [user, setUser] = useState({
    id: "local-selsabil",
    username: "Selsabil",
    handle: "@selsabil",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "🌸 Passionnée de voyages, d’art et de moments simples. Bienvenue sur mon univers pastel !",
    followers: 1200,
    following: 340,
    password: "123456", // Ajout pour démo
  });

  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [conversations, setConversations] = useState([]);

  // Génère 50 membres random et des posts random
useEffect(() => {
  const fetchMembersAndPosts = async () => {
    try {
      // 1. Récupérer 50 utilisateurs aléatoires
      const res = await fetch("https://randomuser.me/api/?results=50");
      const data = await res.json();

      const randomMembers = data.results.map((u) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        avatar: u.picture.medium,
        lastMessage: "Démarre une conversation !",
      }));
      setMembers(randomMembers);

      // 2. Récupérer des images depuis l’API Pexels
      const imgRes = await fetch("https://api.pexels.com/v1/curated?per_page=50", {
        headers: {
          Authorization: "NV9YLpw3o3zCQqsMQ56lE2K6c6yRXA5OHeUs6a0IsKivcR11xLGlR0aq"
        }
      });
      const imgData = await imgRes.json();
      const imageList = imgData.photos;

      // 3. Générer les posts avec les images Pexels
      const randomPosts = data.results.map((u, i) => ({
        id: u.login.uuid,
        user: `${u.name.first} ${u.name.last}`,
        userAvatar: u.picture.medium,
        image: { uri: imageList[i % imageList.length].src.large }, // ou .medium
        caption: getRandomCaption(),
        date: new Date().toLocaleDateString(),
        likes: Math.floor(Math.random() * 100),
        authorId: u.login.uuid,
      }));

      // 4. Ajouter les images locales
      localImages.forEach((img) => {
        randomPosts.push({
          id: img.key,
          user: "Selsabil",
          userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          image: img.source,
          caption: img.caption,
          date: new Date().toLocaleDateString(),
          likes: Math.floor(Math.random() * 100),
          authorId: "local-selsabil",
        });
      });

      // 5. Mise à jour du state
      setPosts(randomPosts.reverse());
    } catch (error) {
      console.error("Erreur de chargement des membres ou des images :", error);
    }
  };

  fetchMembersAndPosts();
}, []);


  // Ajout d'un post
  const publishPost = (caption, imageUri) => {
    if (!caption || !imageUri) return false;
    const newPost = {
      id: Date.now().toString(),
      user: user.username,
      userAvatar: user.avatar,
      image: { uri: imageUri },
      caption,
      date: new Date().toLocaleDateString(),
      likes: 0,
      authorId: user.id,
    };
    setPosts([newPost, ...posts]);
    return true;
  };

  // Like/unlike
  const toggleFavorite = (postId) => {
    setFavorites((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: favorites.includes(postId) ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  // Messagerie (ultra simple)
  const sendMessage = (toUserId, text) => {
    setConversations((prev) => {
      const conv = prev.find(
        (c) =>
          (c.user1 === user.id && c.user2 === toUserId) ||
          (c.user2 === user.id && c.user1 === toUserId)
      );
      if (conv) {
        conv.messages.push({ from: user.id, text, date: new Date() });
        return [...prev];
      } else {
        return [
          ...prev,
          {
            user1: user.id,
            user2: toUserId,
            messages: [{ from: user.id, text, date: new Date() }],
          },
        ];
      }
    });
  };

  // Authentification
  const login = (username, password) => {
    // Ici, tu pourrais vérifier dans une base ou API
    if (username === user.username && password === user.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (username, password) => {
    setUser({
      ...user,
      username,
      handle: `@${username}`,
      password,
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (newUsername, newPassword) => {
    setUser((prev) => ({
      ...prev,
      username: newUsername || prev.username,
      handle: `@${newUsername || prev.username}`,
      password: newPassword || prev.password,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        members,
        posts,
        favorites,
        conversations,
        publishPost,
        toggleFavorite,
        sendMessage,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
