import { Component } from '@angular/core';
import { Header } from './core/components/header/header';
import { Footer } from './core/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from './core/components/sidenav/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Header, Footer, Sidenav, RouterOutlet]
})
export class App {

  


}
