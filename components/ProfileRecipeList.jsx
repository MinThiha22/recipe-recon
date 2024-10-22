import { View, Text, TouchableOpacity, Image } from "react-native";

const ProfileRecipeList = ({
  title,
  items,
  isEditing,
  isLoading,
  onItemPress,
  onDeleteItem,
  setItems,
  showComments = false,
  onToggleComments = null,
}) => {
  const displayItems = items
    ? title === "Recent Recipes"
      ? [...items].reverse().slice(0, 5)
      : items
    : [];

  return (
    <View className="items-center">
      <Text className="text-lg font-poppinsBold text-secondary">{title}</Text>
      {isLoading ? (
        <Text className="text-secondary font-poppingsRegular">
          Loading...Please wait...
        </Text>
      ) : (
        <View className="pt-2">
          {items && items.length > 0 ? (
            displayItems.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between items-center bg-slate-400 p-2 mb-2 rounded-md w-[80%] mx-auto"
              >
                <View className="flex-col gap-1 items-center justify-center">
                  <Image
                    className="w-60 h-60"
                    source={{ uri: item.name.image || item.name.imageUrl }}
                  />
                  <Text className="font-poppinsRegular text-black text-lg">
                    {item.name.title}
                  </Text>
                  {item.name.body && (
                    <Text className="text-gray-600 mt-2">{item.name.body}</Text>
                  )}
                  {isEditing ? (
                    <TouchableOpacity
                      onPress={() => onDeleteItem(item)}
                      className="bg-red-400 h-[30px] rounded-xl justify-center items-center w-[30%]"
                    >
                      <Text className="text-black font-poppingsBold">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      {showComments ? (
                        <TouchableOpacity
                          className="bg-primary p-3 rounded-full mt-4"
                          onPress={() => onToggleComments(item.id)}
                        >
                          <Text className="text-white font-bold text-center">
                            View Comments
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => onItemPress(item.id)}
                          className="bg-title h-[30px] rounded-xl justify-center items-center w-[30%]"
                        >
                          <Text className="text-black font-poppingsBold">
                            Detail
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text className="font-poppingsRegular text-secondary">
              No {title.toLowerCase()}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ProfileRecipeList;
