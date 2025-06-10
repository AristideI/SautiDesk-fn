import { useAuthContext } from "store/auth.context";
import Button from "./button";
import { Bell, CircleHelp } from "lucide-react";

export default function UserButton() {
  const { user } = useAuthContext();
  const nameInitials = user?.username
    .split(" ")
    .map((n) => n[0])
    .join("");

  function handleFeedback() {}

  return (
    <article className="flex gap-6">
      <Button
        buttonText="FeedBack"
        onPress={handleFeedback}
        variant="secondary"
        className="!rounded-3xl !border-white/30 !text-white/30 !px-4 !py-1.5 !text-xs hover:!bg-white/10"
      />
      <section className="flex items-center gap-2 border border-white/30 px-2 rounded-3xl">
        <CircleHelp size={20} color="#ffffff30" />
        <Bell size={20} color="#ffffff30" />
      </section>
      <button>
        {user?.profile ? (
          <img
            src={user?.profile.url}
            alt="User Icon"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full grid place-content-center bg-green text-lg font-bold">
            <p>{nameInitials}</p>
          </div>
        )}
      </button>
    </article>
  );
}
