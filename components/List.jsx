import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export const List = ({ list, deleteItem }) => {
  if (!list || !list.length)
    return (
      <Text className="text-center text-xl pt-md flex-1 text-secondary">
        There are no items in your Shopping List
      </Text>
    );

  const renderItem = ({ item }) => (
    <View className="flex-row">
      <Text className="text-xl pt-md flex-1 text-secondary">- {item.name}</Text>
      <TouchableOpacity
        className="bg-secondary mb-3xl justify-between"
        onPress={() => deleteItem(item)}
      >
        <Text className="text-primary text-xl py-xl px-md rounded-full">Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="px-md flex-1">
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
};
