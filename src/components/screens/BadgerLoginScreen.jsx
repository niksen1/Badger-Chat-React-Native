import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text style={{ fontSize: 20, margin: 5 }}>Username</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
        />
        <Text style={{ fontSize: 20, margin: 5 }}>Password</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
        />
        <Text style={{ color: 'red' }}>{props.errorMessage}</Text>
        <Button color="crimson" title="Login" onPress={() => {
          if (username.trim() === '' || password.trim() === '') {
            props.setErrorMessage("Username and password are required");
          } else {
            props.handleLogin(username, password);
          }
        }} />
        <Text>New Here?</Text>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue as Guest" onPress={() =>{ 
            props.setIsGuest(true);
            props.setIsLoggedIn(false);
            props.setErrorMessage("");
            } }/>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '75%',
        marginVertical: 10,
        padding:8,
        borderWidth: 1,
    }
});

export default BadgerLoginScreen;