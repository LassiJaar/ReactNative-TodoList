import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete }: TodoItemProps) {
  return (
    <Pressable style={styles.row} onPress={() => onToggle(item.id)}>
      <Text
        key={item.done ? 'done' : 'undone'}
        style={[styles.text, item.done && styles.doneText]}
      >
        {item.text}
      </Text>

      {item.done && (
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
          hitSlop={8}
        >
          <Text style={styles.deleteText}>X</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  textContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '200',
    color: '#000',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '200',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#000',
  },
});