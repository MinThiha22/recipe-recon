import { View } from "react-native";
import CustomButton from "./CustomButton";

const ProfileActionButtons = ({
  isEditing,
  editProfile,
  logOut,
  saveChanges,
  cancelChanges,
  isSumbitting,
}) => {
  return (
    <View className="justify-center flex-row mt-4">
      {!isEditing ? (
        <>
          <CustomButton
            title="Edit Profile"
            handlePress={editProfile}
            containerStyles={"w-[30%]"}
            isLoading={isSumbitting}
          />
          <CustomButton
            title="Log Out"
            handlePress={logOut}
            containerStyles={"w-[30%] ml-2"}
            isLoading={isSumbitting}
          />
        </>
      ) : (
        <>
          <CustomButton
            title="Save"
            handlePress={saveChanges}
            containerStyles={"bg-red-400 w-[30%]"}
            isLoading={isSumbitting}
          />
          <CustomButton
            title="Cancel"
            handlePress={cancelChanges}
            containerStyles={"bg-red-400 w-[30%] ml-2"}
            isLoading={isSumbitting}
          />
        </>
      )}
    </View>
  );
};

export default ProfileActionButtons;
