import { useEffect, useState } from "react";

export default function HeroSection() {
  useEffect(() => {
    const ref = document;
    // setReferrer(ref);
    console.log("Referrer:", ref);
  }, []);

  return <article>Testitng Hero</article>;
}
