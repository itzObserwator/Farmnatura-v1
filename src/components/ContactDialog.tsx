import { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { contact, visitInterests, visitPlotSizes } from "../data/content";
export default function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [plotSize, setPlotSize] = useState("");
  useEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);
  return (
    <dialog
      data-lenis-prevent
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="contact-dialog"
      aria-labelledby="visit-enquiry-title"
      aria-describedby="visit-enquiry-description"
    >
      <div className="contact-dialog-tools">
        <button
          className="dialog-close"
          aria-label="Close enquiry"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <div className="contact-dialog-content">
        <span className="eyebrow">COME, WALK THE LAND</span>
        <h2 id="visit-enquiry-title">Book a site visit.</h2>
        <p id="visit-enquiry-description">
          Tell us a little about your visit. Your enquiry opens in WhatsApp for
          you to send to the Farm Natura team.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const message = `Hello Farm Natura! I would like to arrange a site visit.\nFull name: ${name.trim()}\nEmail address: ${email.trim()}\nPhone number: ${phone.trim()}\nInterested in: ${interest}\nLooking for plot size: ${plotSize}`;
            window.open(
              `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          <label>
            Full name
            <input
              required
              name="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Full name"
            />
          </label>
          <label>
            Email address
            <input
              required
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="Email address"
            />
          </label>
          <label>
            Phone number
            <input
              required
              type="tel"
              name="phone"
              pattern="[+0-9 ()-]{7,20}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="+91"
            />
          </label>
          <div className="enquiry-field">
            <label htmlFor="visit-interest">Interested in</label>
            <select
              id="visit-interest"
              required
              name="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="" disabled>
                Interested In
              </option>
              {visitInterests.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="enquiry-field">
            <label htmlFor="visit-plot-size">Looking for plot size</label>
            <select
              id="visit-plot-size"
              required
              name="plotSize"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
            >
              <option value="" disabled>
                Looking for Plot Size
              </option>
              {visitPlotSizes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button className="button dark" type="submit">
            Continue on WhatsApp <ArrowUpRight size={18} />
          </button>
          <a className="call-link" href={`tel:${contact.tel}`}>
            Or call {contact.phone}
          </a>
        </form>
      </div>
    </dialog>
  );
}
