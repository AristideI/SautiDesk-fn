import { useEffect, useState } from "react";

export default function HeroSection() {
  useEffect(() => {
    const ref = document;
    // setReferrer(ref);
    console.log("Referrer:", ref);
  }, []);

  return (
    <article className="py-20 padd">
      <section className="w-full text-center pb-20">
        <h2 className="text-[4vw] font-semibold">
          Deliver beautifully simple service with
          <br />
          SautiDesk AI Agents
        </h2>
        <p className="text-2xl py-10 text-[1.2vw]">
          One app for projects, knowledge, conversations, and more. Get more
          done faster—together.
        </p>
        <form>
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-dark-green rounded-lg p-2 w-1/2 md:w-1/3 lg:w-1/4"
          />
          <button
            type="submit"
            className="bg-green text-white rounded-lg px-6 py-2 ml-2 hover:bg-dark-green transition-colors"
          >
            Get Started
          </button>
        </form>
      </section>
      <section className="h-[30rem] relative flex items-center">
        <div className="bg-blue-500 h-[70%] w-[10%] rounded-l-3xl overflow-hidden">
          <img
            src="/l2.jpg"
            className="object-cover w-full h-full object-center"
            alt=""
          />
        </div>
        <div className="bg-red-500 h-[80%] w-[15%] rounded-l-3xl overflow-hidden">
          <img
            src="/l1.webp"
            className="object-cover w-full h-full object-center-top"
            alt=""
          />
        </div>
        <div className="bg-green-500 h-full w-1/2 rounded-3xl overflow-hidden">
          <img
            src="/main1.webp"
            className="object-cover w-full h-full object-center"
            alt=""
          />
        </div>
        <div className="bg-purple-500 h-[80%] w-[15%] rounded-r-3xl overflow-hidden">
          <img
            src="/r2.webp"
            className="object-cover w-full h-full object-right"
            alt=""
          />
        </div>
        <div className="bg-yellow-500 h-[70%] w-[10%] rounded-r-3xl overflow-hidden">
          <img
            src="/r1.jpeg"
            className="object-cover w-full h-full object-center"
            alt=""
          />
        </div>
      </section>
    </article>
  );
}
