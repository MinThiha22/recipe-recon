import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { fontSizes, spacing } from './utils/sizes';

export const ShoppingList = ({ list, deleteItem }) => {
  if (!list || !list.length)
    return (
      <Text style={styles.empty}>There are no items in your Shopping List</Text>
    );

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.item}>- {item.name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => deleteItem(item)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
  },
  empty: {
    textAlign: 'center',
    fontSize: fontSizes.md,
    paddingTop: spacing.sm,
    flex: 1,
    color: '#F7E7DC',
  },
  item: {
    fontSize: fontSizes.md,
    paddingTop: spacing.sm,
    flex: 1,
    color: '#F7E7DC',
  },
  button: {
    justifyContent: 'space-between',
    backgroundColor: '#F7E7DC',
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: '#405D72',
    fontSize: fontSizes.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
});
