#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::process::{Command, CommandEvent, TerminatedPayload};
use std::collections::HashMap;

fn main() {
  tauri::Builder::default()
    .setup(|_app| {
      let sidecar_node_port = if portpicker::is_free(4090) {
        4090
      } else {
        portpicker::pick_unused_port().expect("failed to pick a free port for sidecar(node)")
      };

      if cfg!(not(dev)) {
        tauri::async_runtime::spawn(async move {
          let (mut rx, ..) = Command::new_sidecar("node")
            .expect("failed to setup sidecar(node)")
            .envs(HashMap::from([
              ("TAURI_PROD_SIDECAR_NODE_PORT".to_owned(), sidecar_node_port.to_string())
            ]))
            .spawn()
            .expect("failed to spawn sidecar(node)");

          while let Some(event) = rx.recv().await {
            if let CommandEvent::Terminated(TerminatedPayload { code, .. }) = event {
              if let Some(code) = code {
                if code != 0 {
                  panic!("sidecar(node) exited with code {}", code);
                }
              }
            }
          }
        });
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
