import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ShoppingList } from './ShoppingList';
import { fontSizes, spacing } from './utils/sizes';

export const ShoppingListDisplay = () => {
  const [subject, setSubject] = useState('');
  const [list, setList] = useState([]);

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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Shopping List</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setSubject}
          value={subject}
          label="add Item"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} size={50} onPress={addItemToList}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listContainer}>
        <ShoppingList list={list} deleteItem={removeItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#405D72',
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    backgroundColor: '#F7E7DC',
  },
  textInput: {
    flex: 1,
    marginRight: spacing.sm,
    backgroundColor: '#F7E7DC',
    color: '#405D72',
  },
  inputContainer: {
    padding: spacing.lg,
    justifyContent: 'top',
    flexDirection: 'row',
  },
  listContainer: {
    flex: 1,
    padding: spacing.sm,
  },
  titleContainer: {
    paddingTop: spacing.md,
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.xxl,
    color: '#FFA726',
  },
    button: {
    justifyContent: 'space-between',
    backgroundColor: '#F7E7DC',
  },
  buttonText: {
    color: '#405D72',
    fontSize: fontSizes.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
});
