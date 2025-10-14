import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

// Branded icons that are not in Bootstrap Icons or need specific paths
const svgIcons: { [key: string]: React.ReactNode } = {
    mastercard: <><circle cx="8.5" cy="12" r="5.5" fill="#EA001B" /><circle cx="15.5" cy="12" r="5.5" fill="#F79E1B" /><path d="M12 8.5a5.5 5.5 0 00-3.5 9c2.17 1.45 5.83 1.45 8 0a5.5 5.5 0 00-4.5-9z" fill="#FF5F00" /></>,
    visa: <path d="M3.931,7.242,2.5,16.758h2.813L6.7,9.634,6.58,8.91c-.02-.119-.06-.268-.119-.448-.06-.179-.119-.328-.179-.447-.089.478-.194.926-.328,1.344L3.931,7.242Zm10.02,0L11.019,16.758h2.724L15.9,7.242H13.951Zm3.856,7.567.807-4.139-2.062.015.359,4.124h1.9Zm-7.727,1.949,1.614-9.516h2.466l-1.6,9.516H10.081Zm-7.46,0L1,16.758H2.174L3.08,11.2A11.011,11.011,0,0,1,3.4,9.5c.045-.224.089-.463.134-.717L2.833,16.758H.149L.026,16.63c-.045-.06-.075-.119-.09-.179l2.45-9.665h.015l-.119.268L.026,16.63c0,.03.015.045.015.06l.104.068ZM23,7.242H20.255a.476.476,0,0,0-.493.447L17.9,15.7a.2.2,0,0,0,.194.239l.867.015,2.4-7.8c.03-.119.105-.179.224-.179H23Z" />,
    'twitter-x': <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />,
};

const nameMap: { [key: string]: string } = {
  dashboard: 'house-door-fill',
  products: 'box-seam-fill',
  orders: 'clipboard2-data-fill',
  settings: 'gear-fill',
  cart: 'cart3',
  close: 'x-lg',
  plus: 'plus-lg',
  minus: 'dash-lg',
  trash: 'trash3-fill',
  edit: 'pencil-square',
  external: 'box-arrow-up-right',
  search: 'search',
  globe: 'globe',
  user: 'person-circle',
  grid: 'grid-fill',
  video: 'play-circle-fill',
  music: 'music-note-beamed',
  ai: 'robot',
  code: 'code-slash',
  book: 'book-fill',
  sparkles: 'sparkles',
  check: 'check-lg',
  chevronDown: 'chevron-down',
  'chevrons-left': 'chevron-double-left',
  'chevrons-right': 'chevron-double-right',
  star: 'star-fill',
  facebook: 'facebook',
  telegram: 'telegram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  chat: 'chat-dots-fill',
  rocket: 'rocket-takeoff-fill',
  passkey: 'key-fill',
  shield: 'shield-check-fill',
  headset: 'headset',
  handshake: 'people-fill',
  'refund-heart': 'arrow-counterclockwise',
  store: 'shop',
  palette: 'palette-fill',
  key: 'key-fill',
  upload: 'upload',
  'dollar-sign': 'currency-dollar',
  bell: 'bell-fill',
  logout: 'box-arrow-right',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'more-vertical': 'three-dots-vertical',
  menu: 'list',
  google: 'google',
  whatsapp: 'whatsapp',
  'credit-card': 'credit-card-2-front-fill',
  paypal: 'paypal',
  stripe: 'stripe',
  binance: 'currency-bitcoin',
  'file-search': 'file-earmark-text-fill',
  link: 'link-45deg',
  wallet: 'wallet2',
  package: 'box2-fill',
  mail: 'envelope-fill',
  bold: 'type-bold',
  italic: 'type-italic',
  underline: 'type-underline',
  list: 'list-ul',
};

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  if (svgIcons[name]) {
    return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        {svgIcons[name]}
      </svg>
    );
  }

  const mappedName = nameMap[name] || name;
  // Font-based icons are sized with font-size, so we remove w- and h- classes if they exist
  // and expect a text- size class to be provided instead.
  const finalClassName = className?.split(' ').filter(c => !c.startsWith('w-') && !c.startsWith('h-')).join(' ');

  return <i className={`bi bi-${mappedName} ${finalClassName}`} aria-hidden="true" />;
};