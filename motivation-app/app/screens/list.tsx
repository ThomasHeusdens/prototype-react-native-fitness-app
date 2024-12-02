import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../Firebase.config';
import quotesData from '../assets/quotes.json';
import { usePushNotifications } from '../components/usePushNotifications';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {expoPushToken, notification} = usePushNotifications()
  const data = JSON.stringify(notification, undefined, 2);

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const randomQuote = quotesData[randomIndex];
    setQuote(randomQuote.quote);
    setAuthor(randomQuote.author);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => generateRandomQuote(), 500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.quoteText}>"{quote}"</Text>
            <Text style={styles.authorText}>- {author}</Text>
            <Button title="Generate Another Quote" onPress={generateRandomQuote} />
            <Text> Token: {expoPushToken?.data}</Text>
            <Text>{data}</Text>
          </>
        )}
      </View>
      <View style={styles.navigationContainer}>
        <Button title="Details" onPress={() => navigation.navigate('details')} />
        <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
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
});

export default List;