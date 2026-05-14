/**
 * Sanitised error logging for portal server code.
 *
 * Why this exists: `console.error("…", err)` prints the full Error including
 * its message (and on Node, the stack trace). In a portal context, error
 * messages frequently contain PII — emails, account IDs, Salesforce record
 * IDs, sometimes raw query fragments — that ends up in Netlify/BetterStack
 * logs and is visible to anyone with log access.
 *
 * `sanitisedError(err)` strips Errors down to: type + truncated message +
 * top frame of the stack (file:line only, no values). Enough to debug,
 * stripped of payload.
 *
 * Use it in catch blocks instead of bare `err`:
 *   } catch (err) {
 *     console.error("[clerk-webhook] failed:", sanitisedError(err));
 *   }
 */

const MAX_MESSAGE_LENGTH = 200;

interface SanitisedError {
  name: string;
  message: string;
  topFrame?: string;
}

export function sanitisedError(err: unknown): SanitisedError | string {
  if (err === null || err === undefined) return "<no error>";

  if (err instanceof Error) {
    const message = truncate(err.message, MAX_MESSAGE_LENGTH);
    const topFrame = extractTopFrame(err.stack);
    return topFrame ? { name: err.name, message, topFrame } : { name: err.name, message };
  }

  // Unknown thrown value — coerce to string and truncate.
  return truncate(String(err), MAX_MESSAGE_LENGTH);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}… [${s.length - max} more chars suppressed]`;
}

/**
 * Pull just the first stack frame, keep file:line:column, drop the rest
 * (which often includes captured values via inline closures on V8).
 */
function extractTopFrame(stack: string | undefined): string | undefined {
  if (!stack) return undefined;
  const lines = stack.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("at ")) {
      // Strip absolute paths to project-relative — Netlify build paths
      // leak the build sandbox layout otherwise.
      return trimmed.replace(/\/var\/task\//, "").replace(/^at\s+/, "");
    }
  }
  return undefined;
}
