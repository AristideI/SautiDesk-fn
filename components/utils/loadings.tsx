import Lottie from "react-lottie";
import loadingAnimation from "assets/animations/mainLoading.json";
import whiteSpinner from "assets/animations/spinnerwhite.json";
import greenSpinner from "assets/animations/spinnerGreen.json";

export function LoadingSection() {
  const options = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <Lottie options={options} height={250} width={250} />
    </div>
  );
}

export function LoadingSpinner({ isWhite }: { isWhite: boolean }) {
  const animationData = isWhite ? whiteSpinner : greenSpinner;
  const options = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return <Lottie options={options} height={20} width={50} />;
}
