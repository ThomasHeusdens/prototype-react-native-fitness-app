import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FIREBASE_AUTH } from '../../Firebase.config';
import { getLikedQuotes } from '../components/firestore';
import quotesData from '../assets/quotes.json';

const Liked = () => {
  const [likedQuotes, setLikedQuotes] = useState<{ quote: string; author: string }[]>([]);
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
      <FlatList
        data={likedQuotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{item.quote}"</Text>
            <Text style={styles.authorText}>- {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  quoteContainer: {
    marginBottom: 20,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 16,
    textAlign: 'right',
  },
});

export default Liked;