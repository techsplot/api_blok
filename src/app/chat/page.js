// src/app/chat/page.js
"use client";

import { useRouter } from 'next/navigation';
import { AiChat } from '../../components/aichat';

export default function ChatPage() {
  const router = useRouter();

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'back':
        // Go back step by step (typically to API details page)
        router.back();
        break;
      case 'home':
        router.push('/');
        break;
      case 'search':
        router.push('/search');
        break;
      case 'api_details':
        router.push('/api/[slug]');
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
