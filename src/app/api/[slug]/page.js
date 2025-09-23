'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiDetail } from '../../../components/apiDetails';

export default function ApiDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedApi, setSelectedApi] = useState(null);

  useEffect(() => {
    // Try to get API data from sessionStorage
    const storedApi = sessionStorage.getItem('selectedApi');
    if (storedApi) {
      setSelectedApi(JSON.parse(storedApi));
    } else {
      // If no stored API data, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        router.push('/');
        break;
      case 'search':
        router.back();
        break;
      case 'chat':
        router.push('/chat');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        router.push('/');
    }
  };

  if (!selectedApi) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Loading...</h1>
          <p className="text-gray-600">Retrieving API information</p>
        </div>
      </div>
    );
  }

  return (
    <ApiDetail
      api={selectedApi}
      onNavigate={handleNavigation}
    />
  );
}