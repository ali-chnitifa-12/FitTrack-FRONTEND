import { useState } from "react";
import PageHeading from "../Components/PageHeading.jsx";
import api from "../Utils/axios";

const emptyForm = { name: "", email: "", message: "" };

export default function ContactForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const data = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, value.trim()]));
    if (!data.name || !data.email || !data.message) {
      setError("Enter your name, email address, and message.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/contact", data);
      setSubmitted(true);
      setFormData(emptyForm);
    } catch (error) {
      setError(error.response?.data?.message || "Could not send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fit-page fit-container fit-page-reading">
      <PageHeading title="Contact FitTrack" />
      {submitted ? (
        <section className="fit-panel" role="status">
          <h2 className="fit-section-title">Message sent</h2>
          <p className="mb-4 text-[var(--fit-muted)]">We’ll reply using the email address you entered.</p>
          <button type="button" className="fit-button fit-button-secondary" onClick={() => setSubmitted(false)}>
            Send another message
          </button>
        </section>
      ) : (
        <form className="fit-panel" onSubmit={handleSubmit}>
          {error && <p role="alert" className="rounded-lg bg-red-900/30 p-3 text-red-200">{error}</p>}
          <label className="fit-field-label" htmlFor="name">Your name</label>
          <input className="fit-auth-input" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required />
          <label className="fit-field-label" htmlFor="email">Email address</label>
          <input className="fit-auth-input" id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} required />
          <label className="fit-field-label" htmlFor="message">How can we help?</label>
          <textarea className="fit-auth-input" id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required />
          <button type="submit" className="fit-button fit-button-primary mt-4 disabled:opacity-60" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
