import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ShoppingList } from '../../components/ShoppingList.jsx';

const ShoppingListDisplay = () => {
  const [subject, setSubject] = useState('');
  const [list, setList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const addItemToList = () => {
    if (subject.trim()) {
      const newItem = { id: Date.now(), name: subject };
      setList([...list, newItem]);
      setSubject('');
    }
  };

  const removeItem = (item) => {
    setList(list.filter((x) => x.id !== item.id));
  };

  return (
    <View className="bg-primary flex-1">
      <View className="pt-4">
        <Text className="text-4xl font-chewy text-center text-title_color">Your Shopping List</Text>
      </View>
      <View className="p-4 flex-row items-center">
        <Text
          className={`absolute left-2 top-2 text-primary text-md transition-all ${isFocused || subject ? 'text-sm top-3' : 'text-md top-8'} transition-all`}>
          Enter Item
        </Text>
        <TextInput
          className={`flex-1 mr-2 bg-secondary text-primary h-12 border rounded pl-2 pr-2 text-md ${isFocused ? 'border-title' : 'border-secondary'}`}
          onChangeText={setSubject}
          value={subject}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View className="bg-secondary justify-center">
          <TouchableOpacity
            className="bg-secondary p-2"
            onPress={addItemToList}>
            <Text className="text-primary text-md">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 p-2">
        <ShoppingList list={list} deleteItem={removeItem} />
      </View>
    </View>
  );
};  

export default ShoppingListDisplay;
