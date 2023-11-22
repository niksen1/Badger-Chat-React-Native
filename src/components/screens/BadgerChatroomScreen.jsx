import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [page]);

    const fetchMessages = () => {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${page}`, {
            method: "GET",
            headers: {
                'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367"
            },
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages)
            })
    };

    const createPost = async () => {
        const token = await SecureStore.getItemAsync('token');
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: title,
                content: body,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                Alert.alert('Successfully posted!', 'Successfully posted!');
                setModalVisible(false);
                setTitle('');
                setBody('');
                setPage(1);
                fetchMessages();
            })
    }

    const deletePost = async (postId) => {
        const token = await SecureStore.getItemAsync('token');
        fetch(`https://cs571.org/api/f23/hw9/messages?id=${postId}`, {
            method: 'DELETE',
            headers: {
                'X-CS571-ID': "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                if (res.ok) {
                    Alert.alert('Alert', 'Post successfully deleted!');
                    setPage(1);
                    fetchMessages();
                } else {
                    throw new Error('Failed to delete post');
                }
            })
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };
    const handleNextPage = () => {
        if (page < 4) {
            setPage(page + 1);
        }
    };

    return <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
            {messages.length > 0 ? (
                <View>
                    {messages.map((message, index) => (
                        <BadgerChatMessage
                            key={index}
                            id={message.id}
                            title={message.title}
                            poster={message.poster}
                            content={message.content}
                            created={message.created}
                            deletePost={deletePost}
                            isOwner={props.username === message.poster}
                        />
                    ))}
                </View>
            ) : (
                <Text style={styles.nothingHere}>There's nothing here!</Text>
            )}
        </ScrollView>
        <View style={styles.pagination}>
            <Button
                title="Previous"
                disabled={page === 1}
                onPress={handlePreviousPage}
            />
            <Text style={styles.pageIndicator}>You are on page {page} of 4.</Text>
            <Button
                title="Next"
                disabled={page === 4}
                onPress={handleNextPage}
            />
        </View>
        <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <Text>Body</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        multiline={true}
                        value={body}
                        onChangeText={(text) => setBody(text)}
                    />
                    <Button
                        title="Create Post"
                        disabled={!title.trim() || !body.trim()}
                        onPress={createPost}
                    />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
        {props.guest ? (
            <></>
        ) : (
            <Button title="Create Post" onPress={() => setModalVisible(true)} />
        )}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 20,
    },
    pageIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    nothingHere: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        fontWeight: 'bold',
    }, modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
    },
});

export default BadgerChatroomScreen;