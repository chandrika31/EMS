import { Injectable } from '@angular/core';
import { Theme, light_y, dark_b, light_r, dark_g } from "./theme";


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = dark_g;
  private availableThemes: Theme[] = [light_y, dark_b, light_r, dark_g];

  constructor() { }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isGreenTheme(): boolean {
    return this.active.name === dark_g.name;
  }

  setDarkGreenTheme(): void {
    this.setActiveTheme(dark_g);
  }

  setDarkBlueTheme(): void {
    this.setActiveTheme(dark_b);
  }
  setLightRedTheme(): void {
    this.setActiveTheme(light_r);
  }

  setLightYellowTheme(): void {
    this.setActiveTheme(light_y);
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}
