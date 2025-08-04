import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.darkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme) {
      this.setDarkTheme(savedTheme === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkTheme(prefersDark);
    }
  }

  toggleTheme() {
    this.setDarkTheme(!this.darkTheme.value);
  }

  setDarkTheme(isDark: boolean) {
    this.darkTheme.next(isDark);
    localStorage.setItem('darkTheme', isDark.toString());
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  isDark(): boolean {
    return this.darkTheme.value;
  }
}