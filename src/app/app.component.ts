import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElectronService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontEnd_employee';

  constructor(private electronService: ElectronService) {
    if (this.electronService.isElectron) {
      console.log('Application exécutée dans Electron');
      // Vous pouvez utiliser les API Electron ici
    } else {
      console.log('Application exécutée dans le navigateur');
    }
  }
}
