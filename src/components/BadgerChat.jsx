import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [name, setName] = useState(" ");
  const [errorMessage, setErrorMessage] = useState(" ")
  const [guest, setGuest] = useState(false)

  useEffect(() => {
    fetch(`https://cs571.org/api/f23/hw9/chatrooms`, {
      method: "GET",
      headers: {
        'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367"
      },
    })
      .then(res => res.json())
      .then(data => {
        setChatrooms(data)
      })
  }, []);


  function handleLogin(username, password) {
    fetch(`https://cs571.org/api/f23/hw9/login`, {
      method: "POST",
      headers: {
        'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(res => {
        if (res.status === 401) {
          setErrorMessage("Incorrect login, please try again.");
          return; 
        }
        return res.json();
      })
      .then(data => {
        if (data && data.user && data.user.username) {
          setName(data.user.username);
          SecureStore.setItemAsync('token', data.token)
            .then(() => {
              setIsLoggedIn(true);
              setGuest(false);
            });
        }
      })
  }

  function handleSignup(username, password, repeatPassword) {
    if (password !== repeatPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
    else if (password === '') {
      setErrorMessage('Please enter a password!');
      return;
    }

    fetch('https://cs571.org/api/f23/hw9/register', {
      method: "POST",
      headers: {
        'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(res => {
      if (res.status === 409) { 
        setErrorMessage('Username taken!');
        return 
      }
      return res.json();
    })
      .then(data => {
        if (data && data.token) { 
          SecureStore.setItemAsync('token', JSON.stringify(data.token))
            .then(() => {
              setIsLoggedIn(true);
            })  
        } 
      })
  }

  function handleLogout() {
    SecureStore.deleteItemAsync('token')
      .then(() => {
        setErrorMessage(" ");
        setIsRegistering(false);
        setIsLoggedIn(false);
      })

  }

  if (isLoggedIn || guest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} username={name} guest={guest} />}
              </ChatDrawer.Screen>
            })
          }

          {isLoggedIn ? (
            <ChatDrawer.Screen name="Logout">
              {(props) => <BadgerLogoutScreen handleLogout={handleLogout} />}
            </ChatDrawer.Screen>
          ) : (
            <ChatDrawer.Screen name="Signup">
              {(props) => <BadgerConversionScreen setIsRegistering={setIsRegistering} setGuest={setGuest} />}
            </ChatDrawer.Screen>
          )}

        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} setErrorMessage={setErrorMessage} errorMessage={errorMessage} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setErrorMessage={setErrorMessage} errorMessage={errorMessage} setIsGuest={setGuest} setIsLoggedIn={setIsLoggedIn} />
  }
}