import { createContext, useContext, useState } from "react";

const LikeContext = createContext();

const LikeProvider = ({children}) => {
    const [likesContainerContext, setLikesContainerContext] = useState([]);
      const [likesCountContext, setLikesCountContext] = useState([]);
    return (
        <LikeContext.Provider value={{likesContainerContext, setLikesContainerContext, likesCountContext, setLikesCountContext}}>
        {children}
        </LikeContext.Provider>
    );
}

const useLike = () => {
    const context = useContext(LikeContext);
    if (!context) {
        throw new Error("useLike must be used within a LikeProvider");
    }
    return context;
}

export { LikeProvider, useLike };