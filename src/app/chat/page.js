"use client";

import { useRouter } from 'next/navigation';
import { AiChat } from '../../components/AiChat';

export default function ChatPage() {
  const router = useRouter();

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        router.push('/');
        break;
      case 'search':
        router.push('/search');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        router.push('/');
    }
  };

  return (
    <AiChat onNavigate={handleNavigation} />
  );
}
