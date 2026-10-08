/** Accessible, wrapping character masks for GSAP's staggered editorial reveals. */
export default function RevealText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="reveal-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index} className="reveal-word">
            {[...word].map((char, i) => (
              <span className="reveal-char" key={i}>
                {char}
              </span>
            ))}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
