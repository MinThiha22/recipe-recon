import { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { db, auth } from "../lib/firebase.js";
import { doc, setDoc, getDoc } from "firebase/firestore";

const FavouriteButton = ({ selectedRecipe, onFavouriteToggle }) => {
  const [favouriteList, setFavouriteList] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      fetchFavourites(currentUser.uid);
    }
  }, []);

  //get favourites from firebase
  const fetchFavourites = async (userId) => {
    const docRef = doc(db, "favourites", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFavouriteList(docSnap.data().list);
    }
  };

  //save favourites to firebase
  const saveFavourites = async (updatedList) => {
    if (user) {
      const userFavouritesRef = doc(db, "favourites", user.uid);
      await setDoc(userFavouritesRef, { list: updatedList });
    }
  };

  //add favourite to item list and firebase
  const addFavourite = () => {
    const newItem = { id: selectedRecipe.id, name: selectedRecipe };
    const updatedList = [...favouriteList, newItem];
    setFavouriteList(updatedList);
    saveFavourites(updatedList);
  };

  //remove favourite from item list and firebase
  const removeFavourite = () => {
    const updatedList = favouriteList.filter((x) => x.id !== selectedRecipe.id);
    setFavouriteList(updatedList);
    saveFavourites(updatedList);
  };

  //check if item is favourited
  const isFavourite = (recipeId) => {
    return favouriteList.some((item) => item.id === recipeId);
  };

  //toggle favourite based on if it is favourited
  const toggleFavourite = () => {
    if (isFavourite(selectedRecipe.id)) {
      removeFavourite();
    } else {
      addFavourite();
    }
    onFavouriteToggle && onFavouriteToggle();
  };
  return (
    <TouchableOpacity
      className="bg-title p-3 rounded-full mt-4"
      onPress={toggleFavourite}
    >
      <Text className="text-white font-bold text-center">
        {isFavourite(selectedRecipe.id) ? "Unfavourite" : "Favourite!"}
      </Text>
    </TouchableOpacity>
  );
};

export default FavouriteButton;
