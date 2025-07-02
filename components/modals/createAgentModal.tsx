import { useState } from "react";
import { X, Shield, Mail, Phone, Briefcase, Lock, User } from "lucide-react";
import Button from "components/utils/button";
import { UserHandler } from "api/user.handler";
import { AgentHandler } from "api/agent.handler";
import type { IOrganisation } from "types/organisation.type";
import { toast } from "react-toastify";

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  organisation: IOrganisation | null;
}

interface CreateAgentForm {
  username: string;
  email: string;
  phone: string;
  title: string;
}

export function CreateAgentModal({
  isOpen,
  onClose,
  organisation,
}: CreateAgentModalProps) {
  const [formData, setFormData] = useState<CreateAgentForm>({
    username: "",
    email: "",
    phone: "",
    title: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof CreateAgentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Create user
      const userData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: "Agent12345",
        userRole: "AGENT",
        organisation: organisation?.id,
      };

      const userResponse = await UserHandler.register(userData);

      if (!userResponse.jwt) {
        throw new Error("Failed to create user");
      }

      // Step 2: Create agent with user documentId
      const agentData = {
        title: formData.title,
        user: userResponse.user.id.toString(), // Link to the created user
      };

      const agentResponse = await AgentHandler.create(agentData);

      if (!agentResponse) {
        throw new Error("Failed to create agent");
      }

      setSuccess(true);
      setFormData({
        username: "",
        email: "",
        phone: "",
        title: "",
      });
      onClose();
      toast.success("Agent created successfully");
    } catch (error) {
      console.error("Error creating agent:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        username: "",
        email: "",
        phone: "",
        title: "",
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white/10 backdrop-blur-lg border-l border-white/20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Create New Agent
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} className="text-white/60" />
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
              <Shield size={20} className="text-green-400" />
              <span className="text-green-400">
                Agent created successfully!
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <X size={20} className="text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col justify-between flex-1 h-11/12"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Username *
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter username"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Email *
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Phone Number *
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Agent Title *
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="e.g., Senior Support Agent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={16} className="text-white/60" />
                <span className="text-sm font-medium text-white/80">
                  Default Password
                </span>
              </div>
              <p className="text-sm text-white/60">
                The agent will be created with the default password:{" "}
                <span className="font-mono text-green-400">Agent12345</span>
              </p>
              <p className="text-xs text-white/40 mt-1">
                They can change this password after their first login.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              buttonText={isSubmitting ? "Creating Agent..." : "Register Agent"}
              onPress={(e) => handleSubmit(e as React.FormEvent)}
              disabled={isSubmitting}
              fullWidth
              className="self-end justify-self-end mt-auto"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
