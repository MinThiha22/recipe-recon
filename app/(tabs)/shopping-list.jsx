  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, TouchableOpacity } from 'react-native';
  import { ShoppingList } from '../../components/ShoppingList.jsx';
  import { db, auth } from '../../lib/firebase.js';
  import { doc, setDoc, getDoc } from 'firebase/firestore';

  const ShoppingListDisplay = () => {
    const [subject, setSubject] = useState('');
    const [list, setList] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      
      if (currentUser) {
        fetchShoppingList(currentUser.uid);
      }
    }, []);

    const fetchShoppingList = async (userId) => {
      const docRef = doc(db, 'shopping-list', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setList(docSnap.data().list);
      }
    };

    const saveShoppingList = async (updatedList) => {
      if (user) {
        const userShoppingListRef = doc(db, 'shopping-list', user.uid);
        await setDoc(userShoppingListRef, { list: updatedList });
      }
    };

    const addItemToList = () => {
      if (subject.trim()) {
        const newItem = { id: Date.now(), name: subject };
          const updatedList = [...list, newItem];
        setList(updatedList);
        setSubject('');
        saveShoppingList(updatedList);
      }
    };

    const removeItem = (item) => {
      const updatedList = list.filter((x) => x.id !== item.id);
      setList(updatedList);
      saveShoppingList(updatedList);
    };

    return (
      <View className="bg-primary flex-1">
        <View className="pt-4">
          <Text className="text-4xl font-chewy text-center text-title">Your Shopping List</Text>
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
      </View >
    );
  };

  export default ShoppingListDisplay;