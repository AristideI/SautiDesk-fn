import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "store/auth.context";
import Button from "components/utils/button";
import {
  User,
  Mail,
  Phone,
  Camera,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { API } from "api";

interface ProfileFormData {
  username: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export default function ProfilePage() {
  const { user, loadUserInfo } = useAuthContext();
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "settings"
  >("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Settings state
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: true,
    language: "en",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedImage = await API.userHandler.uploadImage(file);

      // Update user profile with new image
      await API.userHandler.updateUser(user?.documentId || "", {
        profile: uploadedImage,
      });

      await loadUserInfo();
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.userHandler.updateUser(user?.documentId || "", {
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
      });

      await loadUserInfo();
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Note: You'll need to implement this API endpoint
      await API.userHandler.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        "Failed to change password. Please check your current password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (
    key: keyof SettingsData,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Note: You'll need to implement this API endpoint
      await API.userHandler.updateSettings(user?.documentId || "", settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-white/60">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-6">
            <div className="relative">
              {user?.profile ? (
                <img
                  src={user.profile.url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green/20 border-4 border-green/20 flex items-center justify-center text-2xl font-bold">
                  {getInitials(user?.username || "")}
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="absolute -bottom-2 -right-2 bg-green p-2 rounded-full hover:bg-green-hover transition-colors disabled:opacity-50"
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.username}</h2>
              <p className="text-white/60">{user?.email}</p>
              <p className="text-sm text-white/40 capitalize">
                {user?.userRole?.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageUpload}
            className="hidden"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6 border border-white/10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "profile"
                ? "bg-green text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "password"
                ? "bg-green text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Lock size={16} />
            Password
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === "settings"
                ? "bg-green text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Shield size={16} />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  buttonText={isLoading ? "Saving..." : "Save Changes"}
                  onPress={() => {}}
                  disabled={isLoading}
                  icon={<Save size={16} />}
                />
              </div>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type={isPasswordVisible.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-12 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {isPasswordVisible.current ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type={isPasswordVisible.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-12 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {isPasswordVisible.new ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={16}
                    />
                    <input
                      type={isPasswordVisible.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-12 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white placeholder-white/40"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {isPasswordVisible.confirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  buttonText={isLoading ? "Changing..." : "Change Password"}
                  onPress={() => {}}
                  disabled={isLoading}
                  icon={<Lock size={16} />}
                />
              </div>
            </form>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>

              <div className="space-y-6">
                {/* Notifications */}
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Bell size={20} />
                    Notifications
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-white/60">
                          Receive notifications via email
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "emailNotifications",
                            !settings.emailNotifications
                          )
                        }
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.emailNotifications
                            ? "bg-green"
                            : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.emailNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-white/60">
                          Receive push notifications
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleSettingsChange(
                            "pushNotifications",
                            !settings.pushNotifications
                          )
                        }
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.pushNotifications
                            ? "bg-green"
                            : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.pushNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Palette size={20} />
                    Appearance
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-white/60">Use dark theme</p>
                    </div>
                    <button
                      onClick={() =>
                        handleSettingsChange("darkMode", !settings.darkMode)
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.darkMode ? "bg-green" : "bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Globe size={20} />
                    Language
                  </h4>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        handleSettingsChange("language", e.target.value)
                      }
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  buttonText={isLoading ? "Saving..." : "Save Settings"}
                  onPress={saveSettings}
                  disabled={isLoading}
                  icon={<Save size={16} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
