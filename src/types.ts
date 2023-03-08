export interface Lang {
  code: string;
  name: string;
}

export interface Settings {
  newTab: boolean,
  languages: Lang[]
}

export const defaultSettings: Settings = {
  newTab: false,
  languages: []
}

export function tryParseLegacy(settings: { newTab: any, languages: any }): Settings {
  var newTab: boolean = typeof settings.newTab == 'string' ? settings.newTab == 'true' : settings.newTab;
  var languages: Lang[] = typeof settings.languages == 'string' ? JSON.parse(settings.languages) : settings.languages

  return { newTab, languages };

}
