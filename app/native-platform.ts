type PluginListener = { remove: () => Promise<void> };

type CapacitorBridge = {
  getPlatform?: () => string;
  isNativePlatform?: () => boolean;
  Plugins?: Record<string, Record<string, (...args: never[]) => Promise<unknown>>>;
};

declare global {
  interface Window {
    Capacitor?: CapacitorBridge;
  }
}

function bridge(): CapacitorBridge | undefined {
  return typeof window === "undefined" ? undefined : window.Capacitor;
}

function plugin(name: string): Record<string, (...args: never[]) => Promise<unknown>> | undefined {
  return bridge()?.Plugins?.[name];
}

export function nativePlatform(): "android" | "ios" | "web" {
  const platform = bridge()?.getPlatform?.();
  return platform === "android" || platform === "ios" ? platform : "web";
}

export function isNativeApp(): boolean {
  return bridge()?.isNativePlatform?.() === true || nativePlatform() !== "web";
}

type IosDeviceInfo = {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
  nativePlatform?: "android" | "ios" | "web";
};

export function isIosDevice(deviceInfo?: IosDeviceInfo): boolean {
  const detectedNativePlatform = deviceInfo?.nativePlatform ?? nativePlatform();
  if (detectedNativePlatform === "ios") return true;
  if (detectedNativePlatform === "android") return false;

  const browserInfo = deviceInfo ?? (typeof navigator === "undefined" ? {} : {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });
  const userAgent = browserInfo.userAgent ?? "";
  const platform = browserInfo.platform ?? "";
  const maxTouchPoints = browserInfo.maxTouchPoints ?? 0;

  return /iPad|iPhone|iPod/i.test(userAgent)
    || (platform === "MacIntel" && maxTouchPoints > 1);
}

export async function hapticImpact(enabled = true): Promise<void> {
  if (!enabled) return;
  const haptics = plugin("Haptics");
  try {
    if (haptics?.impact) {
      await haptics.impact({ style: "MEDIUM" } as never);
      return;
    }
  } catch {
    // The web fallback below is intentionally best effort.
  }
  navigator.vibrate?.(120);
}

export async function configureNativeChrome(): Promise<void> {
  const statusBar = plugin("StatusBar");
  try {
    await statusBar?.setBackgroundColor?.({ color: "#09090b" } as never);
    await statusBar?.setStyle?.({ style: "DARK" } as never);
  } catch {
    // Older shells may not bundle the optional StatusBar plugin.
  }
}

export async function getInstalledAppVersion(): Promise<string | null> {
  const app = plugin("App");
  try {
    const info = await app?.getInfo?.();
    if (typeof info === "object" && info !== null && "version" in info && typeof info.version === "string") return info.version;
  } catch {
    // The APK supplied by the user does not bundle this plugin.
  }
  return null;
}

export async function registerNativeBackButton(handler: () => void): Promise<() => void> {
  const app = plugin("App");
  try {
    const listener = await app?.addListener?.("backButton" as never, handler as never) as PluginListener | undefined;
    if (listener) return () => { void listener.remove(); };
  } catch {
    // Browser history remains the fallback for shells without the App plugin.
  }
  return () => undefined;
}

export async function openExternal(url: string): Promise<void> {
  const browser = plugin("Browser");
  try {
    if (browser?.open) {
      await browser.open({ url } as never);
      return;
    }
  } catch {
    // Continue with the system-browser fallback.
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function shareNativeBackup(filename: string, contents: string): Promise<boolean> {
  if (!isNativeApp()) return false;
  const filesystem = plugin("Filesystem");
  const share = plugin("Share");
  if (!filesystem?.writeFile || !filesystem?.getUri || !share?.share) return false;
  try {
    await filesystem.writeFile({
      path: filename,
      data: contents,
      directory: "CACHE",
      encoding: "utf8",
      recursive: true,
    } as never);
    const file = await filesystem.getUri({ path: filename, directory: "CACHE" } as never);
    const uri = typeof file === "object" && file !== null && "uri" in file && typeof file.uri === "string" ? file.uri : null;
    if (!uri) return false;
    await share.share({
      title: "Backup do AngelsFit",
      text: "Backup dos meus dados de treino no AngelsFit.",
      files: [uri],
      dialogTitle: "Salvar ou compartilhar backup",
    } as never);
    return true;
  } catch {
    return false;
  }
}

export async function requestRestNotificationPermission(): Promise<boolean> {
  const notifications = plugin("LocalNotifications");
  if (!notifications) return typeof Notification !== "undefined" && Notification.permission === "granted";
  try {
    const current = await notifications.checkPermissions?.();
    if (typeof current === "object" && current !== null && "display" in current && current.display === "granted") return true;
    const requested = await notifications.requestPermissions?.();
    return typeof requested === "object" && requested !== null && "display" in requested && requested.display === "granted";
  } catch {
    return false;
  }
}

export async function showRestNotification(): Promise<void> {
  const notifications = plugin("LocalNotifications");
  if (notifications?.schedule) {
    try {
      await notifications.schedule({
        notifications: [{
          id: Math.max(1, Math.floor(Date.now() / 1000) % 2_000_000_000),
          title: "Descanso concluído",
          body: "Sua próxima série está pronta.",
          schedule: { at: new Date(Date.now() + 300) },
        }],
      } as never);
      return;
    } catch {
      // The service worker fallback remains available in browsers.
    }
  }
  await navigator.serviceWorker?.ready
    .then((registration) => registration.showNotification("Descanso concluído", {
      body: "Sua próxima série está pronta.",
      icon: "/icon-192.png",
      tag: "angelsfit-rest",
    }))
    .catch(() => undefined);
}
