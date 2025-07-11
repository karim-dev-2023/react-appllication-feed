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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState({
    id: "local-selsabil",
    username: "Selsabil",
    handle: "@selsabil",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "🌸 Passionnée de voyages, d’art et de moments simples. Bienvenue sur mon univers pastel !",
    followers: 1200,
    following: 340,
    password: "123456",
  });

  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchMembersAndPosts = async () => {
      const res = await fetch("https://randomuser.me/api/?results=50");
      const data = await res.json();
      const randomMembers = data.results.map((u) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        avatar: u.picture.medium,
        lastMessage: "Démarre une conversation !",
      }));
      setMembers(randomMembers);

      const randomPosts = data.results.map((u, i) => ({
        id: u.login.uuid,
        user: `${u.name.first} ${u.name.last}`,
        userAvatar: u.picture.medium,
        image: { uri: `https://source.unsplash.com/random/400x400?sig=${i}` },
        caption: getRandomCaption(),
        date: new Date().toLocaleDateString(),
        likes: Math.floor(Math.random() * 100),
        authorId: u.login.uuid,
      }));

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

      setPosts(randomPosts.reverse());
    };

    fetchMembersAndPosts();
  }, []);

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

  // ✅ Corrigé ici
  const sendMessage = (toUserId, text, memberId = null, fromBot = false) => {
    setConversations((prev) => {
      const userId = fromBot ? toUserId : user.id;
      const recipientId = fromBot ? user.id : toUserId;

      const convIndex = prev.findIndex(
        (c) =>
          (c.user1 === userId && c.user2 === recipientId) ||
          (c.user2 === userId && c.user1 === recipientId)
      );

      if (convIndex !== -1) {
        const conv = prev[convIndex];
        if (conv.messages.length >= 5) {
          return prev;
        }
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, { from: userId, text, date: new Date() }],
        };
        const newConvs = [...prev];
        newConvs[convIndex] = updatedConv;
        return newConvs;
      } else {
        return [
          ...prev,
          {
            user1: userId,
            user2: recipientId,
            messages: [{ from: userId, text, date: new Date() }],
          },
        ];
      }
    });
  };

  const login = (username, password) => {
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
