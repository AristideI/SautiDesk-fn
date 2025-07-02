import React, { useState } from "react";
import Button from "components/utils/button";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowRight,
} from "lucide-react";

interface ContactMethod {
  title: string;
  description: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  action: string;
}

interface OfficeLocation {
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
}

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  department: string;
}

const contactMethods: ContactMethod[] = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    value: "support@sautidesk.com",
    icon: <Mail size={24} />,
    color: "from-blue-500 to-blue-600",
    action: "Send Email",
  },
  {
    title: "Sales Inquiries",
    description: "Talk to our sales team about pricing and features",
    value: "sales@sautidesk.com",
    icon: <Building size={24} />,
    color: "from-green-500 to-green-600",
    action: "Contact Sales",
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    value: "Available 24/7",
    icon: <MessageCircle size={24} />,
    color: "from-purple-500 to-purple-600",
    action: "Start Chat",
  },
  {
    title: "Phone Support",
    description: "Call us for urgent issues",
    value: "+1 (555) 123-4567",
    icon: <Phone size={24} />,
    color: "from-orange-500 to-orange-600",
    action: "Call Now",
  },
];

const officeLocations: OfficeLocation[] = [
  {
    city: "Nairobi",
    country: "Kenya",
    address: "Westlands, Nairobi, Kenya",
    phone: "+254 700 123 456",
    email: "nairobi@sautidesk.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM EAT",
    coordinates: { lat: -1.2921, lng: 36.8219 },
  },
  {
    city: "Kampala",
    country: "Uganda",
    address: "Kololo, Kampala, Uganda",
    phone: "+256 700 123 456",
    email: "kampala@sautidesk.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM EAT",
    coordinates: { lat: 0.3476, lng: 32.5825 },
  },
  {
    city: "Dar es Salaam",
    country: "Tanzania",
    address: "Masaki, Dar es Salaam, Tanzania",
    phone: "+255 700 123 456",
    email: "dodoma@sautidesk.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM EAT",
    coordinates: { lat: -6.8235, lng: 39.2695 },
  },
];

const departments = [
  "General Support",
  "Sales & Pricing",
  "Technical Support",
  "Billing & Account",
  "Partnerships",
  "Feature Requests",
  "Bug Reports",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    department: "General Support",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual form submission
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        department: "General Support",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactMethod = (method: ContactMethod) => {
    switch (method.action) {
      case "Send Email":
        window.location.href = `mailto:${method.value}`;
        break;
      case "Contact Sales":
        window.location.href = `mailto:${method.value}`;
        break;
      case "Start Chat":
        // TODO: Implement live chat
        console.log("Start live chat");
        break;
      case "Call Now":
        window.location.href = `tel:${method.value}`;
        break;
    }
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            We&apos;re here to help! Reach out to our team for support, sales
            inquiries, or just to say hello.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-white/60">Support Available</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2hr</div>
              <div className="text-white/60">Avg Response Time</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-white/60">Customer Satisfaction</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
              <div className="text-white/60">Office Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Can We Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => handleContactMethod(method)}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${method.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <p className="text-white/60 mb-4 text-sm">
                  {method.description}
                </p>
                <div className="text-green-400 font-medium text-sm mb-4">
                  {method.value}
                </div>
                <Button
                  buttonText={method.action}
                  onPress={() => handleContactMethod(method)}
                  className="w-full bg-white/10 hover:bg-white/20"
                  icon={<ArrowRight size={16} />}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-400" />
                  <span className="text-green-400">
                    Message sent successfully! We&apos;ll get back to you soon.
                  </span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-400" />
                  <span className="text-red-400">
                    Something went wrong. Please try again.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="Enter your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-gray-800">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  buttonText={isSubmitting ? "Sending..." : "Send Message"}
                  onPress={(e) => handleSubmit(e as React.FormEvent)}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
                  icon={isSubmitting ? undefined : <Send size={20} />}
                />
              </form>
            </div>

            {/* Office Locations */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Our Offices</h2>

              {officeLocations.map((office, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {office.city}, {office.country}
                      </h3>
                      <p className="text-white/60 mb-3">{office.address}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-white/40" />
                          <span className="text-white/80">{office.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-white/40" />
                          <span className="text-white/80">{office.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-white/40" />
                          <span className="text-white/80">{office.hours}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          buttonText="Get Directions"
                          variant="secondary"
                          onPress={() => {
                            const url = `https://www.google.com/maps?q=${office.coordinates.lat},${office.coordinates.lng}`;
                            window.open(url, "_blank");
                          }}
                          className="bg-white/10 hover:bg-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Additional Info */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
              <p className="text-xl text-white/60">
                Follow us on social media for updates, tips, and community
                insights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                {
                  name: "LinkedIn",
                  icon: <Linkedin size={24} />,
                  color: "from-blue-500 to-blue-600",
                  url: "#",
                },
                {
                  name: "Twitter",
                  icon: <Twitter size={24} />,
                  color: "from-sky-500 to-sky-600",
                  url: "#",
                },
                {
                  name: "Facebook",
                  icon: <Facebook size={24} />,
                  color: "from-blue-600 to-blue-700",
                  url: "#",
                },
                {
                  name: "Instagram",
                  icon: <Instagram size={24} />,
                  color: "from-pink-500 to-purple-600",
                  url: "#",
                },
              ].map((social, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  onClick={() => window.open(social.url, "_blank")}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${social.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {social.icon}
                  </div>
                  <h3 className="font-semibold">{social.name}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                <p className="text-white/60">
                  Monday - Friday
                  <br />
                  8:00 AM - 6:00 PM EAT
                  <br />
                  <span className="text-green-400">24/7 Online Support</span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                <p className="text-white/60">
                  Email: Within 24 hours
                  <br />
                  Live Chat: Instant
                  <br />
                  Phone: Immediate
                  <br />
                  <span className="text-green-400">
                    Priority Support Available
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Languages</h3>
                <p className="text-white/60">
                  English (Primary)
                  <br />
                  Swahili
                  <br />
                  French
                  <br />
                  <span className="text-green-400">More Coming Soon</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
