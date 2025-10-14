import React from 'react';
import * as icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  variant?: 'outline' | 'filled';
}

// Branded icons that are not in Lucide or need specific paths
const svgIcons: { [key: string]: React.ReactNode } = {
    mastercard: <><circle cx="8.5" cy="12" r="5.5" fill="#EA001B" /><circle cx="15.5" cy="12" r="5.5" fill="#F79E1B" /><path d="M12 8.5a5.5 5.5 0 00-3.5 9c2.17 1.45 5.83 1.45 8 0a5.5 5.5 0 00-4.5-9z" fill="#FF5F00" /></>,
    visa: <path d="M3.931,7.242,2.5,16.758h2.813L6.7,9.634,6.58,8.91c-.02-.119-.06-.268-.119-.448-.06-.179-.119-.328-.179-.447-.089.478-.194.926-.328,1.344L3.931,7.242Zm10.02,0L11.019,16.758h2.724L15.9,7.242H13.951Zm3.856,7.567.807-4.139-2.062.015.359,4.124h1.9Zm-7.727,1.949,1.614-9.516h2.466l-1.6,9.516H10.081Zm-7.46,0L1,16.758H2.174L3.08,11.2A11.011,11.011,0,0,1,3.4,9.5c.045-.224.089-.463.134-.717L2.833,16.758H.149L.026,16.63c-.045-.06-.075-.119-.09-.179l2.45-9.665h.015l-.119.268L.026,16.63c0,.03.015.045.015.06l.104.068ZM23,7.242H20.255a.476.476,0,0,0-.493.447L17.9,15.7a.2.2,0,0,0,.194.239l.867.015,2.4-7.8c.03-.119.105-.179.224-.179H23Z" />,
    'twitter-x': <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />,
    tiktok: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.2-2.95-2.2-6.87 0-9.85 1.59-2.12 4.19-3.26 6.78-2.91 1.18.16 2.35.63 3.39 1.31v-4.48c-.99-.31-2.02-.45-3.03-.51-1.31-.08-2.62-.01-3.92-.01l-.02-4.03c.61.01 1.22.02 1.84.02Z" />,
    google: <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.77 17.06,6.72L19.34,4.56C17.27,2.71 14.94,1.88 12.19,1.88C6.9,1.88 2.5,6.34 2.5,12C2.5,17.66 6.9,22.12 12.19,22.12C17.64,22.12 21.5,18.33 21.5,12.33C21.5,11.76 21.45,11.43 21.35,11.1Z" />,
    whatsapp: <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.49 0-2.96-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.68-8.22 8.22-8.22s8.22 3.68 8.22 8.22-3.68 8.22-8.22 8.22zm4.52-6.14c-.25-.12-1.47-.72-1.7-.84-.23-.12-.39-.18-.56.18s-.64.84-.79 1.01c-.14.18-.29.2-.53.06-.24-.12-1.02-.38-1.94-1.2s-1.4-1.51-1.56-1.77c-.16-.27-.02-.42.1-.54s.23-.27.35-.42c.12-.15.16-.25.25-.42.09-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.4-.42-.55-.42-.15 0-.31-.02-.48-.02s-.42.06-.64.3c-.22.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.18 1.7 2.58 4.14 3.62.59.26 1.05.41 1.41.52.59.18 1.13.15 1.55.09.47-.06 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.12-.23-.18-.48-.3z" />,
    paypal: <path d="M8.06,12.52C8.24,14,9.39,15,10.74,15h1.16c2.4,0,4.7-1.5,5.13-4.23.4-2.52-1.58-4-4.14-4H9.72L8.06,12.52Z M10.43,2.5H6.26A2.43,2.43,0,0,0,3.83,4.93L1.5,18.57A2.43,2.43,0,0,0,3.93,21.5H8.76l.16-.92.35-2.13c.1-.64.6-1.09,1.21-1.09h.5c.31,0,.6.13,.78.36l.27.35.16,1a.69.69,0,0,0,.67.56h.47l.45-2.74h0c.06-.33.36-.58.69-.58h.5c2.19,0,4-1.72,4.3-3.92.38-2.8-1.74-4.6-4.61-4.6H13.6L12.1,2.5h-1.67Z" />,
    stripe: <path d="M19.32,10.22A7.33,7.33,0,0,0,12,2,7.33,7.33,0,0,0,4.68,10.22H2v4.56H4.68a7.33,7.33,0,0,0,14.64,0H22V10.22ZM12,18.06a5.47,5.47,0,0,1-5.46-5.47h10.92A5.47,5.47,0,0,1,12,18.06Z" />,
};

// Map app's icon names to Lucide icon component names (PascalCase)
const nameMap: { [key: string]: keyof typeof icons } = {
  dashboard: 'Home',
  products: 'Package',
  orders: 'ClipboardList',
  settings: 'Settings',
  cart: 'ShoppingCart',
  close: 'X',
  plus: 'Plus',
  minus: 'Minus',
  trash: 'Trash2',
  edit: 'FilePenLine',
  external: 'ExternalLink',
  search: 'Search',
  globe: 'Globe',
  user: 'CircleUserRound',
  grid: 'LayoutGrid',
  video: 'PlayCircle',
  music: 'Music',
  ai: 'Bot',
  code: 'Code',
  book: 'Book',
  sparkles: 'Sparkles',
  check: 'Check',
  chevronDown: 'ChevronDown',
  'chevrons-left': 'ChevronsLeft',
  'chevrons-right': 'ChevronsRight',
  star: 'Star',
  facebook: 'Facebook',
  telegram: 'Send',
  youtube: 'Youtube',
  chat: 'MessageCircle',
  rocket: 'Rocket',
  passkey: 'KeyRound',
  shield: 'ShieldCheck',
  headset: 'Headset',
  handshake: 'Handshake',
  'refund-heart': 'RotateCcw',
  store: 'Store',
  palette: 'Palette',
  key: 'KeyRound',
  upload: 'Upload',
  'dollar-sign': 'DollarSign',
  bell: 'Bell',
  logout: 'LogOut',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'more-vertical': 'MoreVertical',
  menu: 'Menu',
  'credit-card': 'CreditCard',
  binance: 'Bitcoin',
  'file-search': 'FileSearch',
  link: 'Link',
  wallet: 'Wallet',
  package: 'Package',
  mail: 'Mail',
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  list: 'List',
};

// Map Tailwind CSS text size classes to pixel sizes for the `size` prop
const sizeMap: { [key: string]: number } = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
    'text-3xl': 30,
    'text-4xl': 36,
    'text-5xl': 48,
    'text-9xl': 128,
};

export const Icon: React.FC<IconProps> = ({ name, className = '', variant = 'outline' }) => {
    // Handle custom SVG icons first
    if (svgIcons[name]) {
        return (
            <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                {svgIcons[name]}
            </svg>
        );
    }
    
    // Lucide icons
    const iconName = nameMap[name];
    const LucideIcon = iconName ? icons[iconName] : icons['Ban']; // Fallback to 'Ban' icon

    let iconSize: number | undefined = undefined;
    const classTokens = className.split(' ');
    
    // Process classes to extract size and filter out text-size classes
    const finalClasses = classTokens.filter(token => {
        if (sizeMap[token]) {
            iconSize = sizeMap[token];
            return false;
        }
        return true;
    });

    const props: any = {
        className: finalClasses.join(' '),
        strokeWidth: 2,
    };

    if (iconSize) {
        props.size = iconSize;
    }

    if (variant === 'filled') {
        props.fill = 'currentColor';
    }

    return <LucideIcon {...props} />;
};