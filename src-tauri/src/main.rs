#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let _window = app.get_webview_window("main").unwrap();

      #[cfg(target_os = "macos")]
      unsafe {
        // Get the NSApplication shared instance
        let ns_app: *mut objc::runtime::Object = msg_send![class!(NSApplication), sharedApplication];

        // Walk NSApp.windows to find our window and configure it.
        // During setup there should be exactly one window — grab it.
        let ns_windows: *mut objc::runtime::Object = msg_send![ns_app, windows];
        let count: usize = msg_send![ns_windows, count];

        if count > 0 {
          let ns_window: *mut objc::runtime::Object = msg_send![ns_windows, objectAtIndex: 0];

          // 1. Force absolute transparency
          let _: () = msg_send![ns_window, setOpaque: false];
          let _: () = msg_send![ns_window, setBackgroundColor: std::ptr::null::<objc::runtime::Object>()];

          // 2. Kill the macOS window shadow (removes the big grey box)
          let _: () = msg_send![ns_window, setHasShadow: false];

          // 3. Keep it floating across all monitors/spaces
          // NSStatusWindowLevel = 25 (the highest usable floating level)
          let _: () = msg_send![ns_window, setLevel: 25i64];

          // NSWindowCollectionBehaviorCanJoinAllSpaces = 1 << 0
          // NSWindowCollectionBehaviorIgnoresCycle       = 1 << 5
          let behavior: u64 = (1 << 0) | (1 << 5);
          let _: () = msg_send![ns_window, setCollectionBehavior: behavior];
        }

        // 4. Prevent the app from stealing keyboard focus from other desktop apps
        // NSApplicationActivationPolicyAccessory = 1
        let _: () = msg_send![ns_app, setActivationPolicy: 1u64];
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

