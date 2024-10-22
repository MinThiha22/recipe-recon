import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";

const SavedIngredientsList = ({
  ingredients,
  isEditing,
  isLoading,
  tempDeleteItem,
  tempDeleteAll,
  setIngredients,
}) => {
  return (
    <View className="items-center">
      <Text className="text-lg font-poppinsBold text-secondary">
        Saved ingredients
      </Text>
      {isLoading ? (
        <Text className="text-secondary font-poppingsRegular">
          Loading...Please wait...
        </Text>
      ) : (
        <View className="pt-2">
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <View
                key={index}
                className={`flex-row justify-between items-center ${
                  isEditing ? "bg-slate-400" : ""
                } p-2 mb-1 rounded-md w-[70%] mx-auto`}
              >
                <Text
                  className={`${
                    isEditing
                      ? "font-poppinsBold"
                      : " font-poppinsRegular text-lg"
                  } text-secondary`}
                >
                  {item}
                </Text>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() =>
                      tempDeleteItem(item, ingredients, setIngredients)
                    }
                  >
                    <Image source={icons.close} className="w-4 h-4" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text className="font-poppingsRegular text-secondary">
              No saved ingredients
            </Text>
          )}
          {isEditing && ingredients && ingredients.length > 0 && (
            <View className="items-center">
              <TouchableOpacity
                onPress={tempDeleteAll}
                className="bg-red-400 h-[30px] rounded-xl justify-center items-center w-[40%]"
              >
                <Text className="text-black font-poppingsBold">Delete All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default SavedIngredientsList;
