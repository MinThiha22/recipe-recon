import { View, Text, Image, TouchableOpacity } from "react-native";
import { images, icons } from "../constants";
import FormField from "./FormField";

const ProfileHeader = ({
  username,
  isEditing,
  profilePicture,
  newUsername,
  setNewUsername,
  pickImage,
  isLoadingInfo,
}) => {
  return (
    <View className="w-full items-center">
      <Text className="text-3xl mt-5 text-title font-chewy">Your Profile</Text>
      {isLoadingInfo && (
        <Text className="text-lg mt-3 text-secondary font-poppinsBold">
          Loading...Please wait...
        </Text>
      )}
      {!isLoadingInfo && !isEditing && (
        <Text className="text-lg mt-3 text-secondary font-poppinsBold">
          Hello {username}
        </Text>
      )}
      {isEditing && (
        <FormField
          title=""
          value={newUsername}
          placeholder={username}
          handleChangeText={setNewUsername}
          otherStyles="w-[30%]"
        />
      )}

      <View className="relative mt-3">
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            resizeMode="contain"
            className="bg-secondary w-[120px] h-[120px] rounded-full border-black border-2"
          />
        ) : (
          <Image
            source={images.profilePlaceHolder}
            resizeMode="contain"
            className="w-[120px] h-[120px] rounded-full"
          />
        )}
        <TouchableOpacity
          onPress={pickImage}
          className="absolute right-0 bottom-0 p-2 bg-secondary rounded-full"
        >
          <Image source={icons.addIcon} className="w-[15px] h-[15px]" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;
