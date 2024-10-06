import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

const App = () => {
  return (
    <View style={{ flex: 1 }}> {/* Use View instead of div */}
      <StatusBar />
   
    </View>
  );
};

export default App;
