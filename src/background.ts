import { defaultSettings, Lang, Settings, tryParseLegacy } from "./types.js";

let g_newTab = false;
let g_tabId: number | undefined;

function createNewTab(url: string) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    chrome.tabs.create({
      index: tabs[0].index + 1,
      url
    }, (tab) => {
      g_tabId = tab.id;
      chrome.tabs.onRemoved.addListener((id) => {
        if (g_tabId === id) {
          g_tabId = undefined;
        }
      });
    });
  });
}

function onTransClick(info: chrome.contextMenus.OnClickData, lang: string) {
  const url = `http://translate.google.com/#auto/${lang}/${encodeURIComponent(info.selectionText!)}`;
  if (!g_newTab && g_tabId !== undefined) {
    chrome.tabs.update(g_tabId, { active: true, url }, (tab) => {
      if (tab) {
        chrome.windows.update(tab.windowId, { focused: true });
      } else {
        createNewTab(url);
      }
    });
  } else {
    createNewTab(url);
  }
}

chrome.contextMenus.onClicked.addListener(
  (info, _) => {
    const menuItemId = info.menuItemId.toString();
    switch (menuItemId) {
      case '3e15632a-128e-4a49-873d-4d88a6ab9c92':
      case '5bd7ff62-f469-4ad7-a2eb-0b5759ec57b3':
        chrome.runtime.openOptionsPage();
        break;
      default:
        if (menuItemId.startsWith('9b969d97-7fdb-46a4-b795-5c849ab2fb5d')) {
          const lang = menuItemId.substring(37);
          onTransClick(info, lang);
        }
        break;
    }
  }
)

function loadContextMenus(languages: Lang[]) {
  chrome.contextMenus.removeAll();
  for (const lang of languages) {
    chrome.contextMenus.create({
      id: '9b969d97-7fdb-46a4-b795-5c849ab2fb5d:' + lang.code,
      title: languages.length === 1 ? `Translate "%s" to ${lang.name}` : `To ${lang.name}`,
      contexts: ['selection'],
    });
  }
  if (languages.length > 1) {
    chrome.contextMenus.create({
      id: 'a76907ab-8574-44a1-b57c-81258e0c0a9f',
      type: 'separator',
      contexts: ['selection']
    });
  }
  if (languages.length !== 1) {
    chrome.contextMenus.create({
      id: '3e15632a-128e-4a49-873d-4d88a6ab9c92',
      title: languages.length === 0 ? 'Translate Options...' : 'More...',
      contexts: ['selection']
    });
  }
  chrome.contextMenus.create({
    id: '5bd7ff62-f469-4ad7-a2eb-0b5759ec57b3',
    title: 'Translate Options...',
    contexts: ['page']
  });
}

chrome.storage.sync.get(defaultSettings, (items: Settings) => {
  const { newTab, languages } = tryParseLegacy(items);
  g_newTab = newTab;
  loadContextMenus(languages);
});
