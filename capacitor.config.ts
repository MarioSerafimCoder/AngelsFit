import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.angelsfit.app",
  appName: "AngelsFit",
  webDir: "native-dist",
  backgroundColor: "#09090b",
  loggingBehavior: "debug",
  zoomEnabled: false,
  android: {
    backgroundColor: "#09090b",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: " AngelsFitAndroid/1.1.0",
  },
};

export default config;
