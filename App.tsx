import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from './types/Todo';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';

const STORAGE_KEY = '@todo_items';

export default function App() {
  const [items, setItems] = useState<Todo[]>([]);

  useEffect((): void => {
    const loadItems = async (): Promise<void> => {
      try {
        const saved: string | null = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const parsed: Todo[] = JSON.parse(saved) as Todo[];
          setItems(parsed);
        }
      } catch (e: unknown) {
        console.error(e);
      }
    };
    loadItems();
  }, []);

  const saveItems = async (updatedItems: Todo[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const addItem = (text: string): void => {
    const newItem: Todo = {
      id: Date.now().toString(),
      text,
      done: false,
    };
    const updated: Todo[] = [...items, newItem];
    setItems(updated);
    saveItems(updated);
  };

  const toggleItem = (id: string): void => {
    const updated: Todo[] = items.map(
      (item: Todo): Todo =>
        item.id === id ? { ...item, done: !item.done } : item
    );
    setItems(updated);
    saveItems(updated);
  };

  const deleteItem = (id: string): void => {
    const updated: Todo[] = items.filter(
      (item: Todo): boolean => item.id !== id
    );
    setItems(updated);
    saveItems(updated);
  };

  const renderTodoItem = ({ item }: ListRenderItemInfo<Todo>): JSX.Element => (
    <TodoItem item={item} onToggle={toggleItem} onDelete={deleteItem} />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        <TodoInput onAddTodo={addItem} />
        <Text style={styles.info}>Press an item to cross it off.</Text>
        <Text style={styles.info}>Press the X to delete a crossed-off item.</Text>
        <SwipeListView<Todo>
          data={items}
          keyExtractor={(item: Todo): string => item.id}
          renderItem={renderTodoItem}
          renderHiddenItem={(): JSX.Element => <View style={styles.rowBack} />}
          rightOpenValue={-75}
          disableRightSwipe
          disableLeftSwipe
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rowBack: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginBottom: 4,
  },
});