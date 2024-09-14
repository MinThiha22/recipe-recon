import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export const ShoppingList = ({ list, deleteItem }) => {
  if (!list || !list.length)
    return (
      <Text className="text-center text-md pt-sm flex-1 text-secondary">
        There are no items in your Shopping List
      </Text>
    );

  const renderItem = ({ item }) => (
    <View className="flex-row items-center mb-sm">
      <Text className="text-md pt-sm flex-1 text-secondary">- {item.name}</Text>
      <TouchableOpacity
        className="bg-primary justify-between mb-sm"
        onPress={() => deleteItem(item)}
      >
        <Text className="text-white text-md py-sm px-md rounded-full">
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="px-md flex-1">
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
};
