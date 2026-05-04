import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import students from "../../api/students";

gsap.registerPlugin(ScrollTrigger);

const MLetters = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const sectionRef = useRef(null);
  const modalOverlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (!selectedStudent) {
      return undefined;
    }

    const scrollY = window.scrollY;
    const { body } = document;
    const previousStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.classList.add("modal-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.classList.remove("modal-open");
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.left = previousStyles.left;
      body.style.right = previousStyles.right;
      body.style.width = previousStyles.width;
      body.style.overflow = previousStyles.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [selectedStudent]);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const revealItems = Array.from(section.querySelectorAll(".letters-reveal"));

    if (!revealItems.length) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(revealItems, {
        y: 48,
        opacity: 0,
        filter: "blur(12px)",
      });

      gsap.to(revealItems, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        ease: "power3.out",
        duration: 1,
        stagger: 0.18,
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!selectedStudent || !modalOverlayRef.current || !modalRef.current) {
      return undefined;
    }

    isClosingRef.current = false;

    const ctx = gsap.context(() => {
      gsap.set(modalOverlayRef.current, {
        opacity: 0,
      });

      gsap.set(modalRef.current, {
        opacity: 0,
        y: -24,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.to(modalOverlayRef.current, {
        opacity: 1,
        duration: 0.24,
      });

      timeline.to(
        modalRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
        },
        0,
      );
    });

    return () => ctx.revert();
  }, [selectedStudent]);

  const openModal = (student) => {
    if (isClosingRef.current) {
      return;
    }

    setSelectedStudent(student);
  };

  const closeModal = () => {
    if (!selectedStudent || isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.in",
      },
      onComplete: () => {
        isClosingRef.current = false;
        setSelectedStudent(null);
      },
    });

    timeline.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.2,
    });

    timeline.to(
      modalRef.current,
      {
        opacity: 0,
        y: -24,
        duration: 0.24,
      },
      0,
    );
  };

  return (
    <>
      <section ref={sectionRef} className="mLetters">
        <div className="inner">
          <h2 className="letters-reveal">Letters From Us</h2>
          <p>
            <span className="letters-reveal">
              각자의 마음을 담아 전하는 작은 이야기들.
              <br className="br-hide" />
              쉽게 꺼내지 못했던 진심을 한 장의 편지에 담았습니다.
            </span>
          </p>

          <div className="mobile-letters-slider letters-reveal">
            <button
              type="button"
              className="mobile-letters-nav mobile-letters-nav--prev"
              aria-label="Previous letter"
            />
            <button
              type="button"
              className="mobile-letters-nav mobile-letters-nav--next"
              aria-label="Next letter"
            />
            <Swiper
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: ".mobile-letters-nav--prev",
                nextEl: ".mobile-letters-nav--next",
              }}
              modules={[Autoplay, Navigation, Pagination]}
              className="mySwiper"
            >
              {students.map((student) => (
                <SwiperSlide key={student.id}>
                  <button
                    type="button"
                    className="mobile-card-button"
                    onClick={() => openModal(student)}
                    aria-label={`Open letter from ${student.name}`}
                  >
                    <img src={student.cardImg} alt={student.name} />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <span className="click letters-reveal">Click on the card</span>
        </div>
      </section>

      {selectedStudent &&
        createPortal(
          <div
            ref={modalOverlayRef}
            className="letters-modal-overlay"
            onClick={closeModal}
          >
            <div
              ref={modalRef}
              className="letters-modal letters-modal--mobile"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="letters-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                CLOSE
              </button>
              <div className="letters-modal-content">
                <p>{selectedStudent.mLetter}</p>
                <em>{selectedStudent.name} 올림</em>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default MLetters;
