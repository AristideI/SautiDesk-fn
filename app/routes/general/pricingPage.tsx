import React, { useState } from "react";
import Button from "components/utils/button";
import { Check, X, Star, Zap, Shield, Users, ArrowRight } from "lucide-react";

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  notIncluded: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for small teams getting started",
    icon: <Zap size={24} />,
    color: "from-blue-500 to-blue-600",
    features: [
      "Up to 5 team members",
      "100 tickets per month",
      "Basic email support",
      "Standard integrations",
      "1GB file storage",
      "Basic reporting",
      "Mobile app access",
      "Email notifications",
    ],
    notIncluded: [
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Advanced automation",
      "Multi-language support",
    ],
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    description: "Ideal for growing businesses",
    icon: <Shield size={24} />,
    color: "from-green-500 to-green-600",
    popular: true,
    features: [
      "Up to 25 team members",
      "Unlimited tickets",
      "Priority email & chat support",
      "Advanced integrations",
      "10GB file storage",
      "Advanced analytics & reporting",
      "Custom branding",
      "API access",
      "Workflow automation",
      "Multi-language support",
      "SLA management",
      "Advanced security",
    ],
    notIncluded: [
      "Dedicated account manager",
      "Custom development",
      "On-premise deployment",
      "Advanced compliance",
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large organizations with complex needs",
    icon: <Users size={24} />,
    color: "from-purple-500 to-purple-600",
    features: [
      "Unlimited team members",
      "Unlimited tickets",
      "24/7 phone & chat support",
      "All integrations",
      "Unlimited file storage",
      "Advanced analytics & AI insights",
      "Custom branding & white-labeling",
      "Full API access",
      "Advanced automation & workflows",
      "Multi-language & localization",
      "SLA management",
      "Advanced security & compliance",
      "Dedicated account manager",
      "Custom development support",
      "On-premise deployment option",
      "Advanced compliance (GDPR, HIPAA)",
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === "year" ? Math.round(price * 10) : price;
  };

  const getPeriodText = () => {
    return billingPeriod === "year" ? "year" : "month";
  };

  const handleGetStarted = (tierName: string) => {
    setSelectedTier(tierName);
    // TODO: Implement signup/checkout flow
    console.log(`Selected tier: ${tierName}`);
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your team. All plans include our core
            features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm ${
                billingPeriod === "month" ? "text-white" : "text-white/60"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingPeriod(billingPeriod === "month" ? "year" : "month")
              }
              className={`relative w-16 h-8 rounded-full transition-colors ${
                billingPeriod === "year" ? "bg-green-500" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingPeriod === "year" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                billingPeriod === "year" ? "text-white" : "text-white/60"
              }`}
            >
              Yearly
              <span className="ml-1 text-green-400 text-xs">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                  tier.popular
                    ? "bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                      <Star size={16} />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} mb-4`}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-white/60 mb-6">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">
                        ${getDiscountedPrice(tier.price)}
                      </span>
                      <span className="text-white/60">/{getPeriodText()}</span>
                    </div>
                    {billingPeriod === "year" && (
                      <p className="text-sm text-green-400 mt-1">
                        Save ${tier.price * 2}/year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    buttonText="Get Started"
                    onPress={() => handleGetStarted(tier.name)}
                    className={`w-full ${
                      tier.popular
                        ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                    icon={<ArrowRight size={20} />}
                  />
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg mb-4">
                    What&apos;s included:
                  </h4>
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-green-400" />
                      </div>
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}

                  {tier.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-lg mb-4 mt-6 text-white/60">
                        Not included:
                      </h4>
                      {tier.notIncluded.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                            <X size={12} className="text-red-400" />
                          </div>
                          <span className="text-sm text-white/40">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Compare Features
          </h2>
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              {/* Header */}
              <div className="p-6 bg-white/10">
                <h3 className="font-semibold">Features</h3>
              </div>
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-6 text-center ${
                    tier.popular ? "bg-green-500/10" : "bg-white/5"
                  }`}
                >
                  <h3 className="font-semibold">{tier.name}</h3>
                </div>
              ))}

              {/* Feature Rows */}
              {[
                {
                  name: "Team Members",
                  starter: "5",
                  pro: "25",
                  enterprise: "Unlimited",
                },
                {
                  name: "Tickets per Month",
                  starter: "100",
                  pro: "Unlimited",
                  enterprise: "Unlimited",
                },
                {
                  name: "File Storage",
                  starter: "1GB",
                  pro: "10GB",
                  enterprise: "Unlimited",
                },
                {
                  name: "Support",
                  starter: "Email",
                  pro: "Priority",
                  enterprise: "24/7 Phone",
                },
                {
                  name: "API Access",
                  starter: "No",
                  pro: "Yes",
                  enterprise: "Full Access",
                },
                {
                  name: "Custom Branding",
                  starter: "No",
                  pro: "Yes",
                  enterprise: "White-label",
                },
                {
                  name: "Advanced Analytics",
                  starter: "Basic",
                  pro: "Advanced",
                  enterprise: "AI Insights",
                },
                {
                  name: "SLA Management",
                  starter: "No",
                  pro: "Yes",
                  enterprise: "Advanced",
                },
                {
                  name: "Dedicated Manager",
                  starter: "No",
                  pro: "No",
                  enterprise: "Yes",
                },
                {
                  name: "On-premise Option",
                  starter: "No",
                  pro: "No",
                  enterprise: "Yes",
                },
              ].map((feature, index) => (
                <React.Fragment key={index}>
                  <div className="p-4 bg-white/5 border-t border-white/10">
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                    <span className="text-sm">{feature.starter}</span>
                  </div>
                  <div className="p-4 bg-green-500/5 border-t border-white/10 text-center">
                    <span className="text-sm">{feature.pro}</span>
                  </div>
                  <div className="p-4 bg-white/5 border-t border-white/10 text-center">
                    <span className="text-sm">{feature.enterprise}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan at any time?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.",
              },
              {
                question: "Can I cancel my subscription?",
                answer:
                  "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Absolutely. We use enterprise-grade security with encryption at rest and in transit. We're SOC 2 compliant and follow GDPR guidelines.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-white/60">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-white/60 mb-8">
              Join thousands of teams using our platform to deliver exceptional
              customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                buttonText="Start Free Trial"
                onPress={() => console.log("Start trial")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                icon={<ArrowRight size={20} />}
              />
              <Button
                buttonText="Contact Sales"
                variant="secondary"
                onPress={() => console.log("Contact sales")}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
