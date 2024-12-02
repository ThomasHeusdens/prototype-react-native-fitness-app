import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../Firebase.config';
import { getLikedQuotes } from '../components/firestore';
import quotesData from '../assets/quotes.json';

const Liked = () => {
  const [likedQuotes, setLikedQuotes] = useState<{ id: number; quote: string; author: string }[]>([]);
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (user) {
      loadLikedQuotes();
    }
  }, []);

  const loadLikedQuotes = async () => {
    if (user) {
      const likedQuoteIds = await getLikedQuotes(user.uid);
      const quotes = likedQuoteIds.map((id: number) => quotesData[id]);
      setLikedQuotes(quotes);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Liked Quotes</Text>
      {likedQuotes.length === 0 ? (
        <Text style={styles.emptyText}>You haven't liked any quotes yet!</Text>
      ) : (
        <FlatList
          data={likedQuotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.quoteContainer}>
              <View style={styles.quoteContent}>
                <Text style={styles.quoteText}>"{item.quote}"</Text>
                <Text style={styles.authorText}>- {item.author}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007AFF',
  },
  emptyText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
  quoteContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quoteContent: {
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  authorText: {
    fontSize: 16,
    textAlign: 'right',
    color: '#555',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ff5252',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Liked;