import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedPath: string = "";
  operationStatus: string = "";

  async selectFolder() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected) {
        this.selectedPath = selected as string;
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      this.operationStatus = 'Error selecting folder';
    }
  }

  async deleteContents() {
    if (!this.selectedPath) {
      this.operationStatus = 'Please select a folder first';
      return;
    }

    try {
      await invoke('delete_folder_contents', { path: this.selectedPath });
      this.operationStatus = 'Folder contents deleted successfully';
    } catch (error) {
      console.error('Error deleting folder contents:', error);
      this.operationStatus = `Error: ${error}`;
    }
  }
}
