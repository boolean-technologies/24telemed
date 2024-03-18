import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export const App = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={{ flex: 1, overflow: 'hidden', paddingBottom: 0 }}>
        <WebView
          source={{ uri: 'http://192.168.0.103:4202' }}
          style={{ flex: 1, overflow: 'hidden' }}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
