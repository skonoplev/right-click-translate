const googleUrl = 'https://translate.google.com/';
const developersUrl = 'https://github.com/ericvan76/right-click-translate';
const donateUrl = 'https://www.paypal.com/donate/?business=RBUDZ9FDP8MFY&no_recurring=0&item_name=Thank+you%21&currency_code=USD';

const googleMenu = document.getElementById('google') as HTMLAnchorElement;
const optionsMenu = document.getElementById('options') as HTMLAnchorElement;
const devMenu = document.getElementById('developers') as HTMLAnchorElement;
const issueMenu = document.getElementById('issues') as HTMLAnchorElement;
const donateBtn = document.getElementById('donate') as HTMLAnchorElement;

optionsMenu.addEventListener('click', () => chrome.runtime.openOptionsPage());
googleMenu.addEventListener('click', () => chrome.tabs.create({ url: googleUrl }));
devMenu.addEventListener('click', () => chrome.tabs.create({ url: developersUrl }));
issueMenu.addEventListener('click', () => chrome.tabs.create({ url: `${developersUrl}/issues` }));
donateBtn.addEventListener('click', () => chrome.tabs.create({ url: donateUrl }));
