import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
        setLikedQuotes(likedQuotes.filter((id) => id !== quoteId));
      } else {
        await addLikedQuote(user.uid, quoteId);
        setLikedQuotes([...likedQuotes, quoteId]);
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
      </View>
      <View style={styles.buttonContainer}>
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
    justifyContent: 'space-between',
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
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
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
    width: 24,
    height: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default List;