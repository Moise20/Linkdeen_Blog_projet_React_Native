// // Chat.tsx
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, TextInput, Button, FlatList } from "react-native";
// //import { getMessages, sendMessage } from "./api"; // Ces fonctions sont responsables de l'interaction avec ton backend

// interface Message {
//   sender: string;
//   content: string;
// }

// const Chat = ({ route, navigation }: any) => {
//   const { userId, userName } = route.params;
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     // Charger les messages existants pour cette conversation
//     const fetchMessages = async () => {
//       const fetchedMessages = await getMessages(userId);
//       setMessages(fetchedMessages);
//     };
//     fetchMessages();
//   }, [userId]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim() === "") return;
    
//     // Envoi du message
//     await sendMessage(userId, newMessage);
    
//     // Mise à jour de l'état local (ajout du message à la liste)
//     setMessages((prevMessages) => [...prevMessages, { sender: "You", content: newMessage }]);
//     setNewMessage(""); // Réinitialiser le champ de texte
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Chat avec {userName}</Text>

//       {/* Liste des messages */}
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => (
//           <View style={styles.message}>
//             <Text>{item.sender}: {item.content}</Text>
//           </View>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />

//       {/* Champ pour envoyer un nouveau message */}
//       <TextInput
//         style={styles.input}
//         placeholder="Écrire un message"
//         value={newMessage}
//         onChangeText={setNewMessage}
//       />
//       <Button title="Envoyer" onPress={handleSendMessage} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   message: {
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 10,
//   },
// });

// export default Chat;
