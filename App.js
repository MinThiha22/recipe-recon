import React, { useState } from 'react';
import { StyleSheet, Platform, SafeAreaView } from 'react-native';
import { ShoppingListDisplay } from './ShoppingListDisplay';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <ShoppingListDisplay/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
