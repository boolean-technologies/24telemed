import React from 'react';
import { SafeAreaView, StatusBar, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export const App = () => {
  return (
    <View style={{ backgroundColor: '#FFDD00', flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, overflow: 'hidden', paddingBottom: 0 }}>
        <WebView
          source={{ uri: 'https://telemed-personnel-app.netlify.app' }}
          style={{ flex: 1, overflow: 'hidden' }}
          scrollEnabled={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;
