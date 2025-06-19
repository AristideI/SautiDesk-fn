import Lottie, { type Options } from "react-lottie";
import loadingAnimation from "assets/animations/mainLoading.json";
import whiteSpinner from "assets/animations/spinnerwhite.json";
import greenSpinner from "assets/animations/spinnerGreen.json";

function getDefaultOptions(animationData: Options["animationData"]) {
  return {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
}

export function LoadingSection() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Lottie
        options={getDefaultOptions(loadingAnimation)}
        height={250}
        width={250}
      />
    </div>
  );
}

export function LoadingSpinner({ isWhite }: { isWhite: boolean }) {
  const animationData = isWhite ? whiteSpinner : greenSpinner;
  return (
    <Lottie options={getDefaultOptions(animationData)} height={20} width={50} />
  );
}
