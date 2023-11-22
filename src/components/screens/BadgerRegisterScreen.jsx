import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            value={username}
        />
        <Text>Password</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
        />
        <Text>Confirm Password</Text>
        <TextInput
            style={styles.input}
            onChangeText={(text) => setRepeatPassword(text)}
            value={repeatPassword}
            secureTextEntry={true}
        />
        <Text style={{ color: 'red' }}>{props.errorMessage}</Text>
        <Button color="crimson" title="Signup" onPress={() => {
            props.handleSignup(username, password, repeatPassword)
        }} />
        <Button color="grey" title="Nevermind!" onPress={() => {
            props.setIsRegistering(false);
            props.setErrorMessage(" ");
        }} />
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
        borderColor: 'black',
    }
});

export default BadgerRegisterScreen;