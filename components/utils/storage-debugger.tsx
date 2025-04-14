import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Debugger Component
 * 
 * How to use:
 * 1. Import this component where needed:
 *    import { StorageDebugger } from '@/components/utils/storage-debugger';
 * 
 * 2. Add it to your screen (it will be floating at the bottom right):
 *    <YourScreen>
 *      {__DEV__ && <StorageDebugger />}
 *    </YourScreen>
 * 
 * Note: Only visible in development mode
 */
export const StorageDebugger: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([]);
  
  const loadStorageItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      setStorageItems(
        items.map(([key, value]) => ({
          key,
          value: value || 'null',
        }))
      );
    } catch (error) {
      console.error('Error loading AsyncStorage items:', error);
    }
  };
  
  useEffect(() => {
    if (visible) {
      loadStorageItems();
    }
  }, [visible]);
  
  const clearAllStorage = async () => {
    Alert.alert(
      'Clear Storage',
      'Are you sure you want to clear all AsyncStorage items?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              loadStorageItems();
              Alert.alert('Success', 'All storage items cleared');
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear storage');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const removeItem = async (key: string) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${key}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(key);
              loadStorageItems();
            } catch (error) {
              console.error(`Error removing item "${key}":`, error);
              Alert.alert('Error', `Failed to remove "${key}"`);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  if (!visible) {
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.toggleButtonText}>🔍</Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AsyncStorage Debug</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {storageItems.length === 0 ? (
          <Text style={styles.emptyText}>No items in AsyncStorage</Text>
        ) : (
          storageItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Text style={styles.itemKey}>{item.key}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.key)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadStorageItems}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllStorage}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  toggleButtonText: {
    fontSize: 20,
    color: 'white',
  },
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  itemContent: {
    flex: 1,
  },
  itemKey: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  itemValue: {
    color: 'white',
    fontSize: 12,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  removeButtonText: {
    color: '#FF5252',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});