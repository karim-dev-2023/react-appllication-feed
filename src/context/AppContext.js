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
    avatar: null, // Icône user par défaut
    bio: "🌸 Passionnée de voyages, d’art et de moments simples. Bienvenue sur mon univers pastel !",
    followers: 1200,
    following: 340,
    password: "123456",
  });

  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [saved, setSaved] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchMembersAndPosts = async () => {
      const res = await fetch("https://randomuser.me/api/?results=50");
      const data = await res.json();
      const randomMembers = data.results.map((u) => ({
        id: u.login.uuid,
        name: `${u.name.first} ${u.name.last}`,
        avatar: null, // Icône user pour tous les membres
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
        userAvatar: null, // Icône user pour tous les autres
        image: { uri: imageList[i % imageList.length].src.large },
        caption: getRandomCaption(),
        date: new Date().toLocaleDateString(),
        likes: Math.floor(Math.random() * 100),
        authorId: u.login.uuid,
      }));

      localImages.forEach((img) => {
        randomPosts.push({
          id: img.key,
          user: "Selsabil Amairi",
          userAvatar: user.avatar, // Ton avatar (null par défaut)
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
    // eslint-disable-next-line
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

  const toggleSaved = (postId) => {
    setSaved((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setFavorites((prev) => prev.filter((id) => id !== postId));
    setSaved((prev) => prev.filter((id) => id !== postId));
  };

  // --- Conversation, login, register, logout, updateProfile ---
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

  const updateProfile = (newUsername, newPassword, newAvatar) => {
    setUser((prev) => ({
      ...prev,
      username: newUsername || prev.username,
      handle: `@${newUsername || prev.username}`,
      password: newPassword || prev.password,
      avatar: typeof newAvatar !== "undefined" ? newAvatar : prev.avatar,
    }));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.authorId === user.id
          ? {
              ...post,
              user: newUsername || user.username,
              userAvatar: typeof newAvatar !== "undefined" ? newAvatar : user.avatar,
            }
          : post
      )
    );
  };

  const reorderMyPosts = (newOrder) => {
    const myIds = newOrder.map((p) => p.id);
    setPosts((prev) => {
      const myPosts = prev.filter((p) => p.authorId === user.id);
      const others = prev.filter((p) => p.authorId !== user.id);
      const sortedMyPosts = myIds.map((id) => myPosts.find((p) => p.id === id)).filter(Boolean);
      return [...sortedMyPosts, ...others];
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        members,
        posts,
        favorites,
        saved,
        conversations,
        publishPost,
        toggleFavorite,
        toggleSaved,
        deletePost,
        reorderMyPosts,
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
