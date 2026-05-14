interface Props {
  firstName: string | null;
  totalStages: number;
  completedStages: number;
  isComplete: boolean;
}

/**
 * Personalised greeting + progress visualisation. Lives at the top of the
 * dashboard. Calm, warm, brand-themed — sets the tone before we hit the user
 * with the next action.
 */
export default function WelcomeBanner({
  firstName,
  totalStages,
  completedStages,
  isComplete,
}: Props) {
  const name = firstName?.trim() || "there";
  const pct = Math.round((completedStages / Math.max(totalStages, 1)) * 100);
  const greeting = timeBasedGreeting();

  return (
    <div className="animate-fade-in-up">
      <p className="text-sm font-medium text-text-light/80 tracking-wide">
        {greeting}
      </p>
      <div className="mt-1 flex items-baseline gap-3 flex-wrap">
        <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
          {name}
        </h1>
        <span className="text-3xl sm:text-4xl animate-wave-hand inline-block origin-bottom-right" aria-hidden>
          👋
        </span>
      </div>

      <p className="mt-3 text-text-light max-w-2xl text-base">
        {isComplete ? (
          <>You&apos;re all set up — welcome aboard. 🎉</>
        ) : completedStages === 0 ? (
          <>Welcome aboard. Let&apos;s get your onboarding moving.</>
        ) : (
          <>
            You&apos;re{" "}
            <span className="font-semibold text-text">{pct}%</span>
            {" "}of the way through your onboarding — here&apos;s where you are.
          </>
        )}
      </p>

      {/* Progress bar — only when actively onboarding */}
      {!isComplete && (
        <div className="mt-5 max-w-md">
          <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000 ease-out"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            {/* Subtle shimmer */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
              style={{ width: `${pct}%`, backgroundSize: "200% 100%" }}
              aria-hidden
            />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-medium text-text">
              {completedStages} of {totalStages} steps complete
            </span>
            <span className="text-text-light">{totalStages - completedStages} to go</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Time-of-day aware greeting. Server-rendered using the server's locale
 * which is fine for UK clients (we run on Netlify EU). For perfect accuracy
 * we'd use the client timezone — small Phase 2 polish.
 */
function timeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
