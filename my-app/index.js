import { AppRegistry } from 'react-native';
import App from './App'; // Ensure this is pointing to your main App component
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
