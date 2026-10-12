import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Phone, RotateCcw, X } from "../../icons";
import { contact, faqs } from "../../data/content";

type ChatMessage = { from: "farm" | "visitor"; text: string };
const welcome: ChatMessage[] = [
  { from: "farm", text: "Welcome to the Farm Natura Help Desk." },
  { from: "farm", text: "May we have your name, please?" },
];

export default function FloatingChat({ onVisit }: { onVisit: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(welcome);
  const [draft, setDraft] = useState("");
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [open, messages]);
  const restart = () => {
    setName("");
    setDraft("");
    setMessages(welcome);
    input.current?.focus();
  };
  const reply = (question: string, answer: string) => {
    setMessages((previous) => [
      ...previous,
      { from: "visitor", text: question },
      { from: "farm", text: answer },
    ]);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    if (!name) {
      setName(text);
      reply(
        text,
        `Hi ${text}! A little closer to the land starts here. What would you like to know about Farm Natura?`,
      );
      return;
    }
    const answer = /where|location|address|airport|kandukur/i.test(text)
      ? faqs[0][1]
      : /managed|farming|maintenance/i.test(text)
        ? faqs[1][1]
        : /visit|walk|book/i.test(text)
          ? faqs[2][1]
          : "Our team can help with that. Continue on WhatsApp to share your enquiry, or plan a visit to explore the farm with us.";
    reply(text, answer);
  };
  const lastQuestion = [...messages]
    .reverse()
    .find((message) => message.from === "visitor")?.text;
  const whatsapp = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
    `Hi Farm Natura! I'm ${name || "interested in the farm"}.${lastQuestion && lastQuestion !== name ? ` ${lastQuestion}` : " I'd like to know more about the farm."}`,
  )}`;
  return (
    <aside className="floating-chat" aria-label="Farm Natura chat">
      {open && (
        <section
          className="chat-panel"
          id="farm-chat-panel"
          role="dialog"
          data-lenis-prevent
          aria-labelledby="farm-chat-heading"
        >
          <header className="chat-panel-header">
            <img
              className="chat-header-logo"
              src="/branding/farmnatura-logo-170.avif"
              width={48}
              height={24}
              alt=""
            />
            <div className="chat-header-title">
              <h2 id="farm-chat-heading">Farm Natura</h2>
              <p>Help Desk</p>
            </div>
            <button
              className="chat-close"
              aria-label="Restart chat"
              onClick={restart}
            >
              <RotateCcw size={19} />
            </button>
            <button
              ref={closeButton}
              className="chat-close"
              aria-label="Close chat"
              onClick={close}
            >
              <X size={20} />
            </button>
          </header>
          <div
            ref={log}
            className="chat-conversation"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                className={`chat-message chat-message-${message.from}`}
                key={index}
              >
                {message.from === "farm" && (
                  <img
                    className="chat-message-avatar"
                    src="/branding/farmnatura-logo-170.avif"
                    width={30}
                    height={30}
                    alt=""
                    loading="lazy"
                  />
                )}
                <p>{message.text}</p>
              </div>
            ))}
            {name && (
              <div className="chat-followup">
                <div className="chat-options">
                  {[0, 1].map((index) => (
                    <button
                      key={faqs[index][0]}
                      onClick={() => reply(faqs[index][0], faqs[index][1])}
                    >
                      {faqs[index][0]}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setOpen(false);
                      onVisit();
                    }}
                  >
                    Plan a farm visit
                  </button>
                </div>
                <a
                  className="chat-whatsapp"
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue on WhatsApp <ArrowUpRight size={18} />
                </a>
              </div>
            )}
          </div>
          <form className="chat-composer" onSubmit={submit}>
            <div className="chat-answer-field">
              <input
                ref={input}
                aria-label={name ? "Your message" : "Your name"}
                placeholder="Type your answer…"
                autoComplete={name ? "off" : "name"}
                maxLength={name ? 1000 : 80}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim()}
              >
                <ArrowRight size={21} />
              </button>
            </div>
          </form>
        </section>
      )}
      {!open && (
        <nav
          className="floating-contact-links"
          aria-label="Contact Farm Natura"
        >
          <a
            className="floating-whatsapp"
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Farm Natura"
            title="WhatsApp"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.34-1.66a11.95 11.95 0 0 0 5.71 1.45h.01C18.65 23.79 24 18.43 24 11.84c0-3.19-1.24-6.18-3.48-8.36ZM12.06 21.77a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.76.99 1-3.67-.24-.38a9.87 9.87 0 0 1-1.52-5.17c0-5.48 4.45-9.93 9.93-9.93a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.48-4.45 9.92-9.92 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.37.2 1.88.12.57-.09 1.77-.73 2.02-1.44.25-.72.25-1.34.17-1.47-.07-.12-.27-.2-.57-.35Z" />
            </svg>
          </a>
          <a
            className="floating-call"
            href={`tel:${contact.tel}`}
            aria-label="Call Farm Natura"
            title="Call Farm Natura"
          >
            <Phone size={23} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </nav>
      )}
      <button
        ref={launcher}
        className="chat-launcher"
        aria-label={open ? "Close Farm Natura chat" : "Open Farm Natura chat"}
        aria-expanded={open}
        aria-controls={open ? "farm-chat-panel" : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="chat-greeting">Hi There!</span>
        <span className="chat-avatar" aria-hidden="true">
          <img
            src="/branding/farmnatura-logo-170.avif"
            width={54}
            height={25}
            alt=""
            loading="lazy"
            fetchPriority="low"
          />
          <span className="chat-status-dot" />
        </span>
      </button>
    </aside>
  );
}
