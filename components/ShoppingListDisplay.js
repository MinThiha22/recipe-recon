import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ShoppingList } from './ShoppingList';
import { fontSizes, spacing } from './utils/sizes';

export const ShoppingListDisplay = () => {
  const [subject, setSubject] = useState('');
  const [list, setList] = useState([]);

  const addItemToList = () => {
    if (subject.trim()) {
      setList([...list, subject]);
      setSubject('');
      {
        console.log(list);
      }
    }

    const removeItem = (item) => {
      setList(list.filter((x) => x.id !== item.id));
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={setSubject}
          value={subject}
          label="add Item"
        />
        <View style={styles.button}>
          <Button title="Add" size={50} onPress={addItemToList} />
        </View>
      </View>
      <ShoppingList list={list} removeItem={removeItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  button: {
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  inputContainer: {
    padding: spacing.lg,
    justifyContent: 'top',
    flexDirection: 'row',
  },
});
