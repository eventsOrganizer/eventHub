module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',  // The main preset for React Native
  ],
  
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true
    }],
    ["nativewind/babel"],

    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['react-native-reanimated/plugin'],  // Ensure Reanimated plugin is included last
  ]
}
