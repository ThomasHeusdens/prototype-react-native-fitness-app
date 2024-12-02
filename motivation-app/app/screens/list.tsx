import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../Firebase.config';
import quotesData from '../assets/quotes.json';
import { usePushNotifications } from '../components/usePushNotifications';
import LikeIcon from '../assets/like.png';
import LikedIcon from '../assets/liked.png';
import {
  getLikedQuotes,
  addLikedQuote,
  removeLikedQuote,
  initializeUser,
} from '../components/firestore';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<number | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<number[]>([]);
  const { expoPushToken, notification } = usePushNotifications();
  const user = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (user) {
      initializeUser(user.uid);
      loadLikedQuotes();
    }
    generateRandomQuote();
  }, []);

  const loadLikedQuotes = async () => {
    if (user) {
      const quotes = await getLikedQuotes(user.uid);
      setLikedQuotes(quotes);
    }
  };

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const randomQuote = quotesData[randomIndex];
    setQuote(randomQuote.quote);
    setAuthor(randomQuote.author);
    setQuoteId(randomIndex);
  };

  const toggleLike = async () => {
    if (user && quoteId !== null) {
      if (likedQuotes.includes(quoteId)) {
        await removeLikedQuote(user.uid, quoteId);
        await loadLikedQuotes();
      } else {
        await addLikedQuote(user.uid, quoteId);
        await loadLikedQuotes(); 
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>{quote}</Text>
        <Text style={styles.authorText}>- {author}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={toggleLike}>
          <Image
            source={likedQuotes.includes(quoteId!) ? LikedIcon : LikeIcon}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={generateRandomQuote}>
          <Text style={styles.buttonText}>Randomize Quote</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('details')}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Liked')}>
          <Text style={styles.buttonText}>Liked</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', 
    padding: 15,
    borderRadius: 10,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  authorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default List;
