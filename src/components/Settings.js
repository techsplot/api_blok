import { useState } from 'react';
import { ArrowLeft, Moon, Sun, Globe, Volume2, Bell, Shield, User, Key } from 'lucide-react';

export function Settings({ onNavigate }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Moon,
      settings: [
        {
          id: 'darkMode',
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: darkMode,
          onChange: toggleDarkMode,
          icon: darkMode ? Moon : Sun
        }
      ]
    },
    {
      title: 'Language & Region',
      icon: Globe,
      settings: [
        {
          id: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: language,
          onChange: (value) => setLanguage(value),
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
            { value: 'de', label: 'Deutsch' },
            { value: 'ja', label: '日本語' }
          ]
        }
      ]
    },
    {
      title: 'Accessibility',
      icon: Volume2,
      settings: [
        {
          id: 'voice',
          label: 'Voice Responses',
          description: 'Enable text-to-speech for AI responses',
          type: 'toggle',
          value: voiceEnabled,
          onChange: (value) => setVoiceEnabled(value)
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive updates about new APIs and features',
          type: 'toggle',
          value: notifications,
          onChange: (value) => setNotifications(value)
        }
      ]
    },
    {
      title: 'Account',
      icon: User,
      settings: [
        {
          id: 'profile',
          label: 'Profile Settings',
          description: 'Manage your account information',
          type: 'link',
          onClick: () => console.log('Navigate to profile')
        },
        {
          id: 'apiKeys',
          label: 'API Keys',
          description: 'Manage your stored API keys',
          type: 'link',
          onClick: () => console.log('Navigate to API keys'),
          icon: Key
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          id: 'privacy',
          label: 'Privacy Policy',
          description: 'Review our privacy policy',
          type: 'link',
          onClick: () => console.log('Open privacy policy')
        },
        {
          id: 'security',
          label: 'Security Settings',
          description: 'Manage two-factor authentication',
          type: 'link',
          onClick: () => console.log('Navigate to security')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-medium">Settings</h1>
            <p className="text-gray-600">Customize your APIblok experience</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {settingsSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <SectionIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-medium">{section.title}</h2>
                </div>

                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {setting.icon && <setting.icon className="w-4 h-4 text-gray-500" />}
                          <h3 className="font-medium">{setting.label}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{setting.description}</p>
                      </div>

                      <div className="ml-4">
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => setting.onChange?.(!setting.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              setting.value
                                ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]'
                                : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                setting.value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}

                        {setting.type === 'select' && (
                          <select
                            value={setting.value}
                            onChange={(e) => setting.onChange?.(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {setting.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {setting.type === 'link' && (
                          <button
                            onClick={setting.onClick}
                            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* About Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">About APIblok</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                APIblok is an AI-powered hub that helps developers instantly find, understand, 
                and integrate APIs with clear explanations and ready-to-use code snippets.
              </p>
              <div className="flex items-center justify-between py-2">
                <span>Version</span>
                <span className="font-mono text-sm">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Build</span>
                <span className="font-mono text-sm">2024.01.15</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm">
                  Built with ❤️ for developers by the APIblok team
                </p>
              </div>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="bg-white border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-red-600 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reset All Settings</h3>
                  <p className="text-gray-600 text-sm">This will reset all your preferences to default values</p>
                </div>
                <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Reset
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-gray-600 text-sm">Permanently delete your account and all associated data</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
