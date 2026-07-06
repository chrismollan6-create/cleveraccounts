/**
 * Native-app detection.
 *
 * The Capacitor shell appends "CleverAccountsApp" to the webview user-agent
 * (see mobile/capacitor.config.ts `appendUserAgent`). Detecting it from the UA
 * lets the SERVER-rendered portal choose the native shell (bottom tab bar, safe
 * areas) up front — no client flash or hydration mismatch.
 */

export const NATIVE_APP_UA_MARKER = "CleverAccountsApp";

/** True when the request's user-agent is the native app shell. */
export function isNativeAppUA(userAgent: string | null | undefined): boolean {
  return !!userAgent && userAgent.includes(NATIVE_APP_UA_MARKER);
}
