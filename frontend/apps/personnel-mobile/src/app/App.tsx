import React from 'react';
import { SafeAreaView, StatusBar, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export const App = () => {
  return (
    <View style={{ flex: 1 }}>
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
      <View 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          backgroundColor: "#FFDD00",
          zIndex: -1,
        }}
      />
    </View>
  );
};

export default App;
