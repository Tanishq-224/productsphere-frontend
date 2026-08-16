import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
} from "react-icons/fi";

import styles from "./Contact.module.css";
import useReveal from "../../hooks/useReveal";
import { submitContact } from "../../services/contactService";

const Contact = () => {
  const heroRef = useReveal({ delay: 0 });
  const infoRef = useReveal({ delay: 100 });
  const formRef = useReveal({ delay: 200 });
  const responseRef = useReveal({ delay: 300 });
  const faqRef = useReveal({ delay: 400 });
  const ctaRef = useReveal({ delay: 500 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitted(false);

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const result = await submitContact(formData);
      
      if (result.success) {
        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setError(result.message || "Unable to send your message. Please try again.");
      }
    } catch (submitError) {
      console.error(
        "Contact form error:",
        submitError
      );

      setError(
        submitError.response?.data?.message || "Unable to send your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question:
        "How quickly will I receive a response?",
      answer:
        "We aim to respond to every enquiry as quickly as possible during business hours.",
    },
    {
      question:
        "Can I ask about a specific product?",
      answer:
        "Yes. Mention the product name in your message and our team can help with product-related questions.",
    },
    {
      question:
        "Can I discuss a custom requirement?",
      answer:
        "Absolutely. Use the contact form and describe your requirement in as much detail as possible.",
    },
    {
      question:
        "Do I need an account to contact you?",
      answer:
        "No. You can contact us directly without creating an account.",
    },
  ];

  return (
    <main className={styles.page}>

      {/* =========================
          HERO
      ========================= */}

      <section ref={heroRef} className={`${styles.hero} reveal`}>
        <div className={styles.container}>

          <div className={styles.heroContent}>

            <span className={styles.eyebrow}>
              GET IN TOUCH
            </span>

            <h1 className={styles.heroHeading}>
              Let's start a{" "}
              <span>conversation.</span>
            </h1>

            <p className={styles.heroDescription}>
              Have a question, product enquiry or
              something you want to discuss? Send us
              a message and our team will get back to
              you.
            </p>

            <div className={styles.heroActions}>

              <a
                href="#contact-form"
                className={styles.primaryButton}
              >
                <span>
                  Send a Message
                </span>

                <FiArrowRight />
              </a>

              <a
                href="mailto:hello@productsphere.com"
                className={styles.secondaryButton}
              >
                <FiMail />

                <span>
                  Email Us
                </span>
              </a>

            </div>

          </div>

          <div className={styles.heroVisual}>

            <div className={styles.visualCard}>

              <div className={styles.visualIcon}>
                <FiMessageCircle />
              </div>

              <span className={styles.visualLabel}>
                WE'RE HERE TO HELP
              </span>

              <h2>
                Questions?
                <br />
                Let's talk.
              </h2>

              <p>
                Tell us what you need and we'll
                point you in the right direction.
              </p>

              <div className={styles.visualLine}>
                <span />
                <span />
                <span />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CONTACT INFO
      ========================= */}

      <section ref={infoRef} className={`${styles.infoSection} reveal`}>
        <div className={styles.container}>

          <div className={styles.infoGrid}>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FiMail />
              </div>

              <div>
                <span>
                  EMAIL
                </span>

                <h3>
                  hello@productsphere.com
                </h3>

                <p>
                  For general enquiries and
                  product questions.
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FiPhone />
              </div>

              <div>
                <span>
                  PHONE
                </span>

                <h3>
                  +91 99999 99999
                </h3>

                <p>
                  Available during business hours.
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FiMapPin />
              </div>

              <div>
                <span>
                  LOCATION
                </span>

                <h3>
                  Indore, India
                </h3>

                <p>
                  Madhya Pradesh, India.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CONTACT FORM
      ========================= */}

      <section
        id="contact-form"
        ref={formRef}
        className={`${styles.formSection} reveal`}
      >
        <div className={styles.container}>

          <div className={styles.formLayout}>

            {/* LEFT */}

            <div className={styles.formIntro}>

              <span className={styles.eyebrow}>
                CONTACT US
              </span>

              <h2>
                Tell us what
                <span> you need.</span>
              </h2>

              <p>
                Whether you have a question about a
                product, need help with something or
                want to discuss a custom requirement,
                we're ready to hear from you.
              </p>

              <div className={styles.points}>

                <div className={styles.point}>
                  <div>
                    <FiCheckCircle />
                  </div>

                  <span>
                    Clear and helpful responses
                  </span>
                </div>

                <div className={styles.point}>
                  <div>
                    <FiCheckCircle />
                  </div>

                  <span>
                    Product-related assistance
                  </span>
                </div>

                <div className={styles.point}>
                  <div>
                    <FiCheckCircle />
                  </div>

                  <span>
                    Help with custom requirements
                  </span>
                </div>

              </div>

            </div>

            {/* FORM */}

            <div className={styles.formCard}>

              {submitted && (
                <div
                  className={
                    styles.successMessage
                  }
                >
                  <FiCheckCircle />

                  <div>
                    <strong>
                      Message sent successfully.
                    </strong>

                    <p>
                      Thanks for reaching out.
                      We'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
              >

                <div className={styles.fieldGrid}>

                  <div className={styles.field}>
                    <label htmlFor="name">
                      Name
                      <span>*</span>
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email">
                      Email
                      <span>*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                </div>

                <div className={styles.fieldGrid}>

                  <div className={styles.field}>
                    <label htmlFor="phone">
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 99999 99999"
                      autoComplete="tel"
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="subject">
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </div>

                </div>

                <div className={styles.field}>
                  <label htmlFor="message">
                    Message
                    <span>*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a little about what you need..."
                    rows="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className={styles.buttonLoader}
                      />

                      <span>
                        Sending...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Send Message
                      </span>

                      <FiSend />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          RESPONSE INFO
      ========================= */}

      <section ref={responseRef} className={`${styles.responseSection} reveal`}>
        <div className={styles.container}>

          <div className={styles.responseCard}>

            <div className={styles.responseIcon}>
              <FiClock />
            </div>

            <div>
              <span>
                NEED A QUICK RESPONSE?
              </span>

              <h2>
                Send us your message and
                we'll take it from there.
              </h2>
            </div>

          </div>

        </div>
      </section>

      {/* =========================
          FAQ
      ========================= */}

      <section ref={faqRef} className={`${styles.faqSection} reveal`}>
        <div className={styles.container}>

          <div className={styles.faqHeader}>

            <span className={styles.eyebrow}>
              FAQ
            </span>

            <h2>
              Before you{" "}
              <span>reach out.</span>
            </h2>

            <p>
              A few quick answers to common
              questions.
            </p>

          </div>

          <div className={styles.faqGrid}>

            {faqs.map((faq) => (
              <article
                key={faq.question}
                className={styles.faqItem}
              >
                <h3>
                  {faq.question}
                </h3>

                <p>
                  {faq.answer}
                </p>
              </article>
            ))}

          </div>

        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================= */}

      <section ref={ctaRef} className={`${styles.ctaSection} reveal`}>
        <div className={styles.container}>

          <div className={styles.ctaCard}>

            <div>
              <span>
                READY WHEN YOU ARE
              </span>

              <h2>
                Have something
                <br />
                worth discussing?
              </h2>
            </div>

            <a
              href="#contact-form"
              className={styles.ctaButton}
            >
              <span>
                Start a Conversation
              </span>

              <FiArrowRight />
            </a>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Contact;