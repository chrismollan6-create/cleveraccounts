import { MessageSquare } from "lucide-react";

interface Props {
  firstName: string;
  brandName: string;
}

/**
 * Shown when there are no messages and no engagement letter to display.
 * Friendly, encouraging — tells the user the inbox isn't broken, it's
 * just empty, and what to do first.
 */
export default function MessagesEmptyState({ firstName, brandName }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center animate-fade-in-up">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <MessageSquare size={26} className="text-primary" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-text">
        No messages yet
      </h3>
      <p className="mt-2 text-text-light max-w-md mx-auto">
        Start a conversation with your accountant at {brandName} — quick
        question, document request, anything at all. Use the box above to
        send your first message{firstName === "you" ? "" : `, ${firstName}`}.
      </p>
    </div>
  );
}
