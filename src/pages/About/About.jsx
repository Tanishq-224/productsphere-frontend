import {
  FiArrowRight,
  FiCheck,
  FiLayers,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";

import styles from "./About.module.css";

const About = () => {
  const heroRef = useReveal({ delay: 0 });
  const introRef = useReveal({ delay: 100 });
  const valuesRef = useReveal({ delay: 200 });
  const whyUsRef = useReveal({ delay: 300 });
  const ctaRef = useReveal({ delay: 400 });
  return (
    <main className={styles.page}>

      {/* =========================
          HERO
      ========================= */}

      <section ref={heroRef} className={`${styles.hero} reveal`}>
        <div className={styles.container}>

          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              ABOUT US
            </span>

            <h1 className={styles.heading}>
              Building better
              <span> products.</span>
            </h1>

            <p className={styles.heroDescription}>
              We create thoughtful digital products designed
              to simplify work, improve productivity and help
              businesses grow with confidence.
            </p>

            <div className={styles.heroActions}>
              <Link
                to="/products"
                className={styles.primaryButton}
              >
                Explore Products
                <FiArrowRight />
              </Link>

              <Link
                to="/contact"
                className={styles.secondaryButton}
              >
                Get in Touch
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <div className={styles.visualTop}>
                <span>PRODUCTSPHERE</span>

                <span className={styles.status}>
                  ● BUILDING
                </span>
              </div>

              <div className={styles.visualMain}>
                <div className={styles.visualIcon}>
                  <FiLayers />
                </div>

                <h2>
                  Ideas into
                  <span> products.</span>
                </h2>

                <p>
                  Simple. Reliable. Purpose-driven.
                </p>
              </div>

              <div className={styles.visualStats}>
                <div>
                  <strong>01</strong>
                  <span>Think</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Build</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>Improve</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          INTRO
      ========================= */}

      <section ref={introRef} className={`${styles.intro} reveal`}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>
              WHAT WE DO
            </span>

            <h2>
              Technology should make
              <span> things easier.</span>
            </h2>
          </div>

          <div className={styles.introGrid}>
            <p>
              Our focus is simple: build digital products
              that solve real problems without unnecessary
              complexity.
            </p>

            <p>
              From product discovery to development and
              continuous improvement, we care about creating
              experiences that are useful, dependable and
              easy to understand.
            </p>
          </div>

        </div>
      </section>

      {/* =========================
          VALUES
      ========================= */}

      <section ref={valuesRef} className={`${styles.values} reveal`}>
        <div className={styles.container}>

          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>
              OUR APPROACH
            </span>

            <h2>
              What drives
              <span> our work.</span>
            </h2>
          </div>

          <div className={styles.valueGrid}>

            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FiUsers />
              </div>

              <h3>People First</h3>

              <p>
                We design around real users, their needs
                and the problems they actually face.
              </p>
            </article>

            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FiLayers />
              </div>

              <h3>Simple by Design</h3>

              <p>
                We avoid unnecessary complexity and focus
                on clear, intuitive product experiences.
              </p>
            </article>

            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FiShield />
              </div>

              <h3>Built with Care</h3>

              <p>
                Reliability, security and maintainability
                are considered from the beginning.
              </p>
            </article>

            <article className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FiTrendingUp />
              </div>

              <h3>Always Improving</h3>

              <p>
                We continuously learn, measure and improve
                our products based on real feedback.
              </p>
            </article>

          </div>

        </div>
      </section>

      {/* =========================
          WHY US
      ========================= */}

      <section ref={whyUsRef} className={`${styles.whyUs} reveal`}>
        <div className={styles.container}>

          <div className={styles.whyGrid}>

            <div>
              <span className={styles.eyebrow}>
                WHY CHOOSE US
              </span>

              <h2>
                Focused on creating
                <span> real value.</span>
              </h2>

              <p>
                We believe good software is not about
                adding more features. It is about solving
                the right problems in a way that people
                can actually use.
              </p>
            </div>

            <div className={styles.checkList}>

              <div className={styles.checkItem}>
                <FiCheck />
                <span>User-focused product thinking</span>
              </div>

              <div className={styles.checkItem}>
                <FiCheck />
                <span>Clean and scalable solutions</span>
              </div>

              <div className={styles.checkItem}>
                <FiCheck />
                <span>Transparent and practical approach</span>
              </div>

              <div className={styles.checkItem}>
                <FiCheck />
                <span>Continuous product improvement</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section ref={ctaRef} className={`${styles.cta} reveal`}>
        <div className={styles.container}>

          <div className={styles.ctaCard}>

            <div>
              <span className={styles.eyebrow}>
                LET'S BUILD
              </span>

              <h2>
                Have an idea?
                <span> Let's talk.</span>
              </h2>

              <p>
                Whether you want to explore our products
                or discuss a requirement, we'd love to hear
                from you.
              </p>
            </div>

            <Link
              to="/contact"
              className={styles.primaryButton}
            >
              Contact Us
              <FiArrowRight />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
};

export default About;