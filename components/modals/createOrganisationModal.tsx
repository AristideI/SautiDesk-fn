import { useState } from "react";
import {
  X,
  Building,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
} from "lucide-react";
import Button from "components/utils/button";
import useOrganisations from "hooks/useOrganisations";
import { API } from "api";
import type { CreateOrganisationForm } from "types/organisation.type";
import { toast } from "react-hot-toast";

interface CreateOrganisationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username?: string; email?: string; documentId?: string } | null;
}

export function CreateOrganisationModal({
  isOpen,
  onClose,
  user,
}: CreateOrganisationModalProps) {
  const [formData, setFormData] = useState<CreateOrganisationForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    industry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { loadOrganisations } = useOrganisations();

  const handleInputChange = (
    field: keyof CreateOrganisationForm,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await API.organisationHandler.create({
        name: formData.name,
        description: formData.description,
        ownerId: user?.documentId || "",
        industry: formData.industry,
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        description: "",
        industry: "",
      });
      onClose();
      toast.success("Organisation created successfully");
      loadOrganisations();
    } catch (error) {
      console.error("Error creating organisation:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        description: "",
        industry: "",
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
              Create New Organisation
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
              <Building size={20} className="text-green-400" />
              <span className="text-green-400">
                Organisation created successfully!
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Organisation Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Organisation Name *
              </label>
              <div className="relative">
                <Building
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter organisation name"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Industry *
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter organisation industry"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Address
              </label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter organisation address"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Website
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="https://example.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors resize-none"
                placeholder="Describe your organisation..."
                disabled={isSubmitting}
              />
            </div>

            {/* Owner Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Users size={16} className="text-white/60" />
                <span className="text-sm font-medium text-white/80">
                  Organisation Owner
                </span>
              </div>
              <p className="text-sm text-white/60">
                You will be set as the owner of this organisation with full
                administrative privileges.
              </p>
              <p className="text-xs text-white/40 mt-1">
                Owner: {user?.username || user?.email}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              buttonText={
                isSubmitting
                  ? "Creating Organisation..."
                  : "Create Organisation"
              }
              onPress={(e) => handleSubmit(e as React.FormEvent)}
              disabled={isSubmitting}
              className="w-full disabled:opacity-50"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
