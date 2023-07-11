import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.formgenius.myapp',
  appName: 'FormGenius',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
