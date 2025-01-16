import { createContext, useContext, useState } from "react";

const TweetContext = createContext();

export const TweetProvider = ({ children }) => {
  const [sendTweet, setSendTweet] = useState(false);

  return (
    <TweetContext.Provider value={{ sendTweet, setSendTweet }}>
      {children}
    </TweetContext.Provider>
  );
};

export const useNewTweet = () => {
  const context = useContext(TweetContext);
  if (!context) {
    throw new Error("useNewTweet debe usarse dentro de un TweetProvider");
  }
  return context;
};
