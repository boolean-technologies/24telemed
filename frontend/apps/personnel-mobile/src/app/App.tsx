import React from 'react';
import { SafeAreaView, StatusBar, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export const App = () => {
  const injectedJavaScript = `
    (function() {
      var originalConsoleLog = console.log;
      console.log = function() {
        window.ReactNativeWebView.postMessage(JSON.stringify(arguments));
        originalConsoleLog.apply(console, arguments);
      };
      // Repeat for console.error, etc., if needed
    })();
    true; 
  `;

  const onMessage = (event: any) => {
    const { data } = event.nativeEvent;
    // Log the message to the native console
    console.log("WebView Console:", data);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, overflow: 'hidden', paddingBottom: 0 }}>
        <WebView
          source={{ uri: 'https://telemed-personnel-app.netlify.app/meeting/bfe759dc-9544-489e-8168-96d939f3f65a' }}
          style={{ flex: 1, overflow: 'hidden' }}
          scrollEnabled={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          injectedJavaScript={injectedJavaScript}
          onMessage={onMessage}
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
