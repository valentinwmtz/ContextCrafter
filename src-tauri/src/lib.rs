use std::path::Path;
use std::{fs, io};

#[tauri::command]
async fn delete_folder_contents(path: String) -> Result<(), String> {
    delete_directory_contents(&path).map_err(|e| e.to_string())
}

fn delete_directory_contents<P: AsRef<Path>>(path: P) -> io::Result<()> {
    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let path = entry.path();

        if path.is_dir() {
            fs::remove_dir_all(path)?;
        } else {
            fs::remove_file(path)?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![delete_folder_contents])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
