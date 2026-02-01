import React, { useState, useEffect } from "react";
import { Moon, Sun, Settings } from "lucide-react";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem("darkMode");
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", JSON.stringify(newValue));

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const saveNotificationPreferences = () => {
    localStorage.setItem(
      "notificationPreferences",
      JSON.stringify({
        notifications,
        emailUpdates,
      })
    );
    alert("Preferences saved!");
  };

  return (
    <div className={`min-h-screen py-8 ${darkMode ? "dark" : ""}`}>
      <div className={`max-w-2xl mx-auto px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Settings className="w-8 h-8" />
          Settings
        </h1>

        {/* Display Settings */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-4">Display</h2>

          <div className="flex items-center justify-between p-4 border rounded">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
              <div>
                <p className="font-semibold">Dark Mode</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {darkMode ? "Currently enabled" : "Currently disabled"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                darkMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {darkMode ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Get notified about order updates
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <p className="font-semibold">Email Updates</p>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Receive promotional emails and offers
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button
            onClick={saveNotificationPreferences}
            className="mt-4 w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Save Preferences
          </button>
        </div>

        {/* Account Settings */}
        <div className={`rounded-lg shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-4">Account</h2>

          <div className="space-y-3">
            <button className="w-full text-left p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <p className="font-semibold">Change Password</p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Update your password
              </p>
            </button>

            <button className="w-full text-left p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <p className="font-semibold">Delete Account</p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Permanently delete your account
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
