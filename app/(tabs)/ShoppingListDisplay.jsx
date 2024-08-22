import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ShoppingList } from '../../components/ShoppingList.jsx';
import { fontSizes, spacing } from '../../utils/sizes.js';

export const ShoppingListDisplay = () => {
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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Shopping List</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text
          style={[
            styles.label,
            isFocused || subject ? styles.labelFocused : null,
          ]}>
          Enter Item
        </Text>
        <TextInput
          style={[styles.textInput, isFocused ? styles.textInputFocused : null]}
          onChangeText={setSubject}
          value={subject}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            size={50}
            onPress={addItemToList}>
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
    height: spacing.xxl,
    borderColor: '#F7E7DC',
    borderRadius: 4,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    fontSize: fontSizes.md,
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonText: {
    color: '#405D72',
    fontSize: fontSizes.md,
  },
  label: {
    position: 'absolute',
    color: '#405D72',
    fontSize: fontSizes.md,
    left: 25,
    top: 32,
    zIndex: 1,
  },
  labelFocused: {
    fontSize: fontSizes.sm,
    color: '#FFA726',
    top: 12
  },
});
