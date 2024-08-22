import React from 'react';
import { View, StyleSheet, Text, FlatList, Button } from 'react-native';
import { fontSizes, spacing } from './utils/sizes';

export const ShoppingList = ({ list, deleteItem }) => {
  if (!list || !list.length)
    return <Text style={styles.item}>No Items in ShoppingList</Text>;

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.item}>- {item.name}</Text>
      <Button style={styles.button} title="Delete" onPress={() => deleteItem(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List:</Text>
      <FlatList data={list} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
    padding: spacing.md,
    flex: 1,
  },
  listItem: 
  {
        flexDirection: 'row',
  },
  item: {
    fontSize: fontSizes.md,
    paddingTop: spacing.sm,
    flex: 1
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  button: {
    justifyContent: 'space-between'
  }
});
