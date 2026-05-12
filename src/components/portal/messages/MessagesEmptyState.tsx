import { MessageSquare, Sparkles } from "lucide-react";

interface Props {
  firstName: string;
  brandName: string;
  accountantFirstName: string | null;
}

/**
 * Shown when there are no messages and no engagement letter to display.
 * Friendly, encouraging — tells the user the inbox isn't broken, it's
 * just empty, and what to do first. When we know the accountant's first
 * name we personalise the suggested opener.
 */
export default function MessagesEmptyState({
  firstName,
  brandName,
  accountantFirstName,
}: Props) {
  const greetingTarget = accountantFirstName ?? "your accountant";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <MessageSquare size={26} className="text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-text">
        Say hello to {greetingTarget}
      </h3>
      <p className="mt-2 text-text-light max-w-md mx-auto">
        Start a conversation with{" "}
        {accountantFirstName ? `${accountantFirstName} at ${brandName}` : `your accountant at ${brandName}`}
        {" "}— quick question, document request, anything at all. Use the box
        above to send your first message
        {firstName === "you" ? "" : `, ${firstName}`}.
      </p>

      <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-[11px] font-medium text-primary">
        <Sparkles size={11} />
        Replies usually within one working day
      </div>
    </div>
  );
}
